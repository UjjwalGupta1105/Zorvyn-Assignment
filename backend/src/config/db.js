const mongoose = require("mongoose");

let memoryServer = null;

async function connectDB() {
  // try {
  // try connecting to the URI in .env
  console.log("url", process.env.MONGO_URI)
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 }).then(() => {
    console.log("backend connected")
  })
    .catch((err) => {
      console.log("Errorva", err)
    });
  console.log(`MongoDB connected: ${mongoose.connection.host}`);
  // } catch (err) {
  //   console.log(err)
  //   // in production (Vercel), don't fall back to in-memory — just fail loudly
  //   if (process.env.NODE_ENV === "production") {
  //     console.error("MongoDB connection failed. Make sure MONGO_URI is set in Vercel env vars.");
  //     throw err;
  //   }

  //   // local dev only — fallback to in-memory if local mongo isn't running
  //   console.warn("Local MongoDB not found. Starting in-memory MongoDB...");
  //   const { MongoMemoryServer } = require("mongodb-memory-server");
  //   memoryServer = await MongoMemoryServer.create();
  //   const memUri = memoryServer.getUri();
  //   await mongoose.connect(memUri);
  //   console.log("In-memory MongoDB started and connected.");
  //   console.log("Note: Data will be lost when the server restarts.");
  // }
}

module.exports = connectDB;
