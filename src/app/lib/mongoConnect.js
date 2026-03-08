import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("No mongodb uri found!");
}

const uri = process.env.MONGODB_URI;

const options = {
  tls: true,
  tlsAllowInvalidCertificates: true,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
};

/* ── Always create a fresh connected client ── */
export async function mongoConnect(dbName = "VoltStore") {
  const client = new MongoClient(uri, options);
  await client.connect();
  const db = client.db(dbName);
  return { client, db };
}