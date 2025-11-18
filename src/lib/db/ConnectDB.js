import mongoose from "mongoose";
 
let cached = global.mongoose;
 
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
 
export async function ConnectDB() {
  if (cached.conn) return cached.conn;
 
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("❌ MONGODB_URI environment variable not set");
    }
 
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false, // recommended for serverless environments
    }).then((mongoose) => mongoose);
  }
 
  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    cached.promise = null;
    throw null;
  }
 
  return cached.conn;
}