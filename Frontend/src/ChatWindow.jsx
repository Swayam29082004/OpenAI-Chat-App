import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PuffLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);

  const getReply = async () => {
    if (!prompt.trim()) return; // ✅ prevent empty queries

    try {
      setLoading(true);

      const res = await fetch("http://localhost:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: prompt,
          threadId: currThreadId,
        }),
      });

      const data = await res.json();
      setReply(data.reply);

      // ✅ move clearing here, so only once
      setPrompt("");
    } catch (err) {
      console.error("❌ Error fetching reply:", err);
    } finally {
      setLoading(false);
    }
  };

  // Append new chat when reply arrives
  useEffect(() => {
    if (reply) {
      setPrevChats((prevChats) => [
        ...prevChats,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
  }, [reply]);

  return (
    <div className="chatWindow">
      {/* Navbar */}
      <div className="navbar">
        <span>
          SigmaGPT <i className="fa-solid fa-angle-down"></i>
        </span>
        <div className="userIconDiv">
          <span className="userIcon">
            <i className="fa-solid fa-user"></i>
          </span>
        </div>
      </div>

      {/* Chat area */}
      <div className="chatArea">
        <Chat />
        {loading && (
          <div className="loader">
            <PuffLoader color="#339cff" size={40} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            type="text"
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? getReply() : null)}
          />
          <button id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;
