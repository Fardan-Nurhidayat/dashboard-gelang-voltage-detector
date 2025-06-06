import { openDB } from "idb";
const DB_NAME = "VoltageDB";
const CHANNEL_STORE = "channel";
const FEEDS_STORE = "feeds";
const USER_STORE = "user";
const USER_ID_INDEX = "byUserId";
interface ThingSpeakFeed {
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

interface ThingSpeakChannel {
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

interface User {
  id: number;
  name: string;
  password: string;
}

const userData: User[] = [
  {
    id: 0,
    name: "Vinn",
    password: "12345",
  },
  {
    id: 1,
    name: "Arfa",
    password: "12345",
  },
  {
    id: 2,
    name: "Fardan",
    password: "12345",
  },
  {
    id: 3,
    name: "Farhan",
    password: "12345",
  },
  {
    id: 4,
    name: "Lutfhi",
    password: "12345",
  },
  {
    id: 5,
    name: "Rakha",
    password: "12345",
  },
  {
    id: 6,
    name: "izza",
    password: "12345",
  },
  {
    id: 7,
    name: "Reza",
    password: "12345",
  },
  {
    id: 8,
    name: "Josef",
    password: "12345",
  },
  {
    id: 9,
    name: "Angga",
    password: "12345",
  },
];

export const initDB = async () => {
  const db = await openDB(DB_NAME, 2, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CHANNEL_STORE)) {
        db.createObjectStore(CHANNEL_STORE, { keyPath: "id" });
        const store = db.createObjectStore(FEEDS_STORE, {
          keyPath: "created_at",
        });
        // Buat indeks untuk pencarian berdasarkan field5
        store.createIndex(USER_ID_INDEX, "field5");
      }
      if (!db.objectStoreNames.contains(FEEDS_STORE)) {
        db.createObjectStore(FEEDS_STORE, { keyPath: "created_at" });
      }
      if (!db.objectStoreNames.contains(USER_STORE)) {
        db.createObjectStore(USER_STORE, { keyPath: "id" });
      }
    },
  });
  const tx = db.transaction(USER_STORE, "readwrite");
  const store = tx.objectStore(USER_STORE);

  // Cek apakah data sudah ada
  const count = await store.count();
  if (count === 0) {
    for (const user of userData) {
      await store.put(user); // Tunggu setiap operasi put
    }
  }

  await tx.done; // Tunggu transaksi selesai
  return db;
};
export const getUser = async (name: string, password: string) => {
  const db = await initDB();
  const tx = db.transaction(USER_STORE, "readonly");
  const store = tx.objectStore(USER_STORE);

  // Mencari user berdasarkan nama dan password
  const user = await store.getAll();
  const foundUser = user.find(u => u.name === name && u.password === password);

  await tx.done;
  return foundUser || null;
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

export const getAllFeeds = async () => {
  const db = await initDB();
  const tx = db.transaction(FEEDS_STORE, "readonly");
  const store = tx.objectStore(FEEDS_STORE);
  const feeds = await store.getAll();
  await tx.done;
  return feeds;
};

export const getFeeds = async (userId: string | null = null) => {
  const db = await initDB();
  const tx = db.transaction(FEEDS_STORE, "readonly");
  const store = tx.objectStore(FEEDS_STORE);

  if (userId) {
    const index = store.index(USER_ID_INDEX);
    const feeds = await index.getAll(IDBKeyRange.only(userId));
    return feeds;
  }

  return await store.getAll();
};
