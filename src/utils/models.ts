// utils/models.ts
import mongoose from "mongoose";

// Interface untuk TypeScript
export interface IUser {
  id: number;
  name: string;
  password: string;
  is_admin: number;
}

export interface IThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  field9?: string;
}

export interface IThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
  field4?: string | null;
  field5?: string | null;
  field6?: string | null;
  field7?: string | null;
  field8?: string | null;
  field9?: string | null;
}

// MongoDB Schemas
const UserSchema = new mongoose.Schema<IUser>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    is_admin: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const ChannelSchema = new mongoose.Schema<IThingSpeakChannel>(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: String,
    latitude: String,
    longitude: String,
    field1: String,
    field2: String,
    field3: String,
    field4: String,
    field5: String,
    field6: String,
    field7: String,
    field8: String,
    field9: String,
  },
  {
    timestamps: true,
  }
);

const FeedSchema = new mongoose.Schema<IThingSpeakFeed>(
  {
    created_at: { type: String, required: true, unique: true },
    entry_id: { type: Number, required: true },
    field1: { type: String, default: null },
    field2: { type: String, default: null },
    field3: { type: String, default: null },
    field4: { type: String, default: null },
    field5: { type: String, default: null },
    field6: { type: String, default: null },
    field7: { type: String, default: null },
    field8: { type: String, default: null },
    field9: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// Buat index untuk field5 (userId) untuk query yang lebih cepat
FeedSchema.index({ field5: 1 });
FeedSchema.index({ created_at: 1 });

// Export models
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export const Channel =
  mongoose.models.Channel ||
  mongoose.model<IThingSpeakChannel>("Channel", ChannelSchema);
export const Feed =
  mongoose.models.Feed || mongoose.model<IThingSpeakFeed>("Feed", FeedSchema);
