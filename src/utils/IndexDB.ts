import { openDB } from "idb";
const DB_NAME = "VoltageDB";
const CHANNEL_STORE = "channel";
const FEEDS_STORE = "feeds";

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

export const saveChannelAndFeeds = async ({ channel, feeds }: any) => {
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
