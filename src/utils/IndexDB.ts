import { openDB } from "idb";
const DB_NAME = "VoltageDB";
const CHANNEL_STORE = "channel";
const FEEDS_STORE = "feeds";

interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string | null;
  field2?: string | null;
  field3?: string | null;
}

interface ThingSpeakChannel {
  id: number;
  name: string;
  description?: string;
  latitude?: string;
  longitude?: string;
  field1?: string;
  field2?: string;
  field3?: string;
}

export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CHANNEL_STORE)) {
        db.createObjectStore(CHANNEL_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(FEEDS_STORE)) {
        db.createObjectStore(FEEDS_STORE, { keyPath: "created_at" });
      }
    },
  });
};

export const saveChannelAndFeeds = async ({
  channel,
  feeds,
}: {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}) => {
  const db = await initDB();
  const tx = db.transaction([CHANNEL_STORE, FEEDS_STORE], "readwrite");

  tx.objectStore(CHANNEL_STORE).put(channel);
  feeds.forEach(feed => tx.objectStore(FEEDS_STORE).put(feed));

  await tx.done;
};

export const getChannel = async () => {
  const db = await initDB();
  const all = await db.getAll(CHANNEL_STORE);
  return all.length > 0 ? all[0] : null;
};

export const getFeeds = async () => {
  const db = await initDB();
  return await db.getAll(FEEDS_STORE);
};
