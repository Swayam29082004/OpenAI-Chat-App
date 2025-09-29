import './Chat.css';
import { useContext } from 'react';
import { MyContext } from './MyContext';

function Chat() {
  const { newChat, prevChats } = useContext(MyContext);

  return (
    <>
      {newChat && <h1>Start a New Chat</h1>}

      <div className="chats">
        {prevChats && prevChats.map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx} // ✅ fixed key
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <p className="gptMessage">{chat.content}</p>
            )}
          </div>
        ))}

        {/* Example static messages (you can remove if not needed) */}
        <div className="userDiv">
          <p className="userMessage">User message goes here</p>
        </div>

        <div className="gptDiv">
          <p className="gptMessage">GPT Generator Message</p>
        </div>
      </div>
    </>
  );
}

export default Chat;
