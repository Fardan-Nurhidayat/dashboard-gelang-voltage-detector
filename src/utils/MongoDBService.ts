//  mongoDBService.ts
 import { connectDB } from "@/utils/MonggoDB";
  import {
    User,
    Channel,
    Feed,
    IUser,
    IThingSpeakChannel,
    IThingSpeakFeed,
  } from "./models";

  const userData: IUser[] = [
    { id: 0, name: "Vinn", password: "12345", is_admin: 0 },
    { id: 1, name: "Arfa", password: "12345", is_admin: 0 },
    { id: 2, name: "Fardan", password: "12345", is_admin: 0 },
    { id: 3, name: "Farhan", password: "12345", is_admin: 0 },
    { id: 4, name: "Lutfhi", password: "12345", is_admin: 0 },
    { id: 5, name: "Rakha", password: "12345", is_admin: 0 },
    { id: 6, name: "izza", password: "12345", is_admin: 0 },
    { id: 7, name: "Reza", password: "12345", is_admin: 0 },
    { id: 8, name: "Josef", password: "12345", is_admin: 0 },
    { id: 9, name: "Angga", password: "12345", is_admin: 0 },
    { id: 10, name: "Admin", password: "admin123", is_admin: 1 },
  ];

  export const initDB = async (): Promise<void> => {
    try {
      await connectDB();

      // Cek apakah user data sudah ada
      const userCount = await User.countDocuments();

      if (userCount === 0) {
        console.log("Initializing user data...");
        await User.insertMany(userData);
        console.log("User data initialized successfully");
      }
    } catch (error) {
      console.error("Error initializing database:", error);
      throw error;
    }
  };

  export const getUser = async (name: string, password: string) => {
    try {
      await connectDB();

      const foundUser = await User.findOne({
        name: name,
        password: password,
      }).select("id name is_admin -_id");

      return foundUser
        ? {
            id: foundUser.id,
            name: foundUser.name,
            is_admin: foundUser.is_admin,
          }
        : null;
    } catch (error) {
      console.error("Error getting user:", error);
      throw error;
    }
  };

  export const getDetailUser = async (id: string) => {
    try {
      await connectDB();

      const foundUser = await User.findOne({
        id: parseInt(id),
      }).select("id name -_id");

      return foundUser
        ? {
            id: foundUser.id,
            name: foundUser.name,
          }
        : null;
    } catch (error) {
      console.error("Error getting user detail:", error);
      throw error;
    }
  };

  export const saveChannelAndFeeds = async ({
    channel,
    feeds,
  }: {
    channel: IThingSpeakChannel;
    feeds: IThingSpeakFeed[];
  }) => {
    try {
      await connectDB();

      // Update atau insert channel
      await Channel.findOneAndUpdate({ id: channel.id }, channel, {
        upsert: true,
        new: true,
      });

      // Bulk upsert feeds untuk performance yang lebih baik
      const bulkOps = feeds.map(feed => ({
        updateOne: {
          filter: { created_at: feed.created_at },
          update: feed,
          upsert: true,
        },
      }));

      if (bulkOps.length > 0) {
        await Feed.bulkWrite(bulkOps);
      }

      console.log(`Saved ${feeds.length} feeds and channel data`);
    } catch (error) {
      console.error("Error saving channel and feeds:", error);
      throw error;
    }
  };

  export const getChannel = async (): Promise<IThingSpeakChannel | null> => {
    try {
      await connectDB();

      const channel = await Channel.findOne().select(
        "-_id -__v -createdAt -updatedAt"
      );
      return channel;
    } catch (error) {
      console.error("Error getting channel:", error);
      throw error;
    }
  };

  export const getAllFeeds = async (): Promise<IThingSpeakFeed[]> => {
    try {
      await connectDB();

      const feeds = await Feed.find()
        .select("-_id -__v -createdAt -updatedAt")
        .sort({ created_at: 1 });

      return feeds;
    } catch (error) {
      console.error("Error getting all feeds:", error);
      throw error;
    }
  };

  export const getFeeds = async (
    userId: string | null = null
  ): Promise<IThingSpeakFeed[]> => {
    try {
      await connectDB();

      let query = {};
      if (userId) {
        query = { field5: userId };
      }

      const feeds = await Feed.find(query)
        .select("-_id -__v -createdAt -updatedAt")
        .sort({ created_at: 1 });

      return feeds;
    } catch (error) {
      console.error("Error getting feeds:", error);
      throw error;
    }
  };

  // Function tambahan untuk mendapatkan feeds dengan pagination
  export const getFeedsWithPagination = async (
    userId: string | null = null,
    page: number = 1,
    limit: number = 100
  ): Promise<{ feeds: IThingSpeakFeed[]; total: number; totalPages: number }> => {
    try {
      await connectDB();

      let query = {};
      if (userId) {
        query = { field5: userId };
      }

      const skip = (page - 1) * limit;

      const [feeds, total] = await Promise.all([
        Feed.find(query)
          .select("-_id -__v -createdAt -updatedAt")
          .sort({ created_at: -1 })
          .skip(skip)
          .limit(limit),
        Feed.countDocuments(query),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        feeds,
        total,
        totalPages,
      };
    } catch (error) {
      console.error("Error getting feeds with pagination:", error);
      throw error;
    }
  };

  // Function untuk mendapatkan feeds berdasarkan rentang tanggal
  export const getFeedsByDateRange = async (
    startDate: Date,
    endDate: Date,
    userId: string | null = null
  ): Promise<IThingSpeakFeed[]> => {
    try {
      await connectDB();

      let query: any = {
        created_at: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString(),
        },
      };

      if (userId) {
        query.field5 = userId;
      }

      const feeds = await Feed.find(query)
        .select("-_id -__v -createdAt -updatedAt")
        .sort({ created_at: 1 });

      return feeds;
    } catch (error) {
      console.error("Error getting feeds by date range:", error);
      throw error;
    }
  };
