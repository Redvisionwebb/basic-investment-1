import mongoose from "mongoose";
 
let cached = global.mongoose;
 
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
 
export async function ConnectDB() {
  if (cached.conn) {
    return cached.conn;
  }
 
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    cached.promise = mongoose
      .connect(uri)
      .then((mongoose) => mongoose);
  }
 
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
 
  return cached.conn;
}