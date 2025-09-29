import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080; // use dynamic port for deployment

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", chatRoutes);

// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected with Database!");
  } catch (err) {
    console.error("❌ Failed to connect with DB:", err.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

// Start server after DB is connected
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
