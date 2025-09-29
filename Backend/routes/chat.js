import express from "express";
import Thread from "../models/Thread.js";
import getOpenAIAPIResponse from "../utils/openai.js";

const router = express.Router();

/**
 * @desc Test route — saves a dummy thread to DB
 */
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: "abc",
      title: "Testing New Thread2",
    });

    const response = await thread.save();
    res.send(response);
  } catch (err) {
    console.error("❌ DB Save Error:", err.message);
    res.status(500).json({ error: "Failed to save in DB" });
  }
});

/**
 * @desc Get all threads
 */
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error("❌ Fetch Threads Error:", err.message);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

/**
 * @desc Get messages from a specific thread
 */
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error("❌ Fetch Chat Error:", err.message);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

/**
 * @desc Delete a specific thread
 */
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({ success: "Thread deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Thread Error:", err.message);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

/**
 * @desc Chat endpoint — send user message, get AI reply, save to DB
 */
router.post("/chat", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    let thread = await Thread.findOne({ threadId });

    if (!thread) {
      // Create a new thread if it doesn't exist
      thread = new Thread({
        threadId,
        title: message.slice(0, 30), // take first 30 chars as thread title
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }

    // Get AI response
    const assistantReply = await getOpenAIAPIResponse(message);

    thread.messages.push({ role: "assistant", content: assistantReply });
    thread.updatedAt = new Date();

    await thread.save();

    res.json({ reply: assistantReply });
  } catch (err) {
    console.error("❌ Chat Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
