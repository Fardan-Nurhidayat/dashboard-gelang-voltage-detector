// MonggoDB.ts
import mongoose from "mongoose";

const url = import.meta.env.VITE_DBURL;

// Interface untuk connection state
interface MongoConnection {
  isConnected: boolean;
}

const connection: MongoConnection = {
  isConnected: false,
};

export const connectDB = async (): Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  if (!url) {
    throw new Error(
      "MongoDB connection string is not defined in environment variables"
    );
  }

  try {
    const db = await mongoose.connect(url, {
      // Options untuk MongoDB connection
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    });

    connection.isConnected = db.connections[0].readyState === 1;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (!connection.isConnected) {
    return;
  }

  try {
    await mongoose.disconnect();
    connection.isConnected = false;
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error disconnecting from MongoDB:", error);
    throw error;
  }
};

