import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import logo from "./assets/blacklogo.png";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title || "Untitled Chat",
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.error("❌ Failed to fetch threads:", err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `http://localhost:8080/api/thread/${newThreadId}`
      );
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.error("❌ Failed to load thread:", err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      await fetch(`http://localhost:8080/api/thread/${threadId}`, {
        method: "DELETE",
      });

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.error("❌ Failed to delete thread:", err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat} aria-label="Start a new chat">
        <img src={logo} alt="GPT logo" className="logo" />
        <span>
          <i className="fa-solid fa-pen-to-square"></i>
        </span>
      </button>

      <ul className="history">
        {allThreads?.length > 0 ? (
          allThreads.map((thread) => (
            <li
              key={thread.threadId}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}
              title={thread.title} // tooltip
            >
              {thread.title.length > 20
                ? thread.title.slice(0, 20) + "..."
                : thread.title}
              <i
                className="fa-solid fa-trash"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteThread(thread.threadId);
                }}
              ></i>
            </li>
          ))
        ) : (
          <p className="empty">No chats yet. Start a new one!</p>
        )}
      </ul>

      <div className="sign">
        <p>By Swayam Chaudhary ❤️</p>
      </div>
    </section>
  );
}

export default Sidebar;
