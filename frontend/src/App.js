import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import "./App.css";
import botAvatar from "./images/image.png";
import userAvatar from "./images/human.png";

export default function App() {
  const [sidenav, setSide] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const chatEndRef = useRef(null);

  //SAVE CHATS
  const saveToMongo = useCallback(async () => {
    if (messages.length > 0) {
      try {
        await axios.post("http://localhost:5000/api/chats/saveChat", {
          chat: messages,
        });
        console.log("Chat saved to MongoDB");
      } catch (error) {
        console.error("Error saving to MongoDB", error);
      }
    }
  }, [messages]);
  
     //FETCH CHATS FROM MONGODB
  const fetchChatsFromMongo = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/chats/getChats");
  
      // Map chats to sequential session names (Session 1, Session 2, etc.)
      const sessions = res.data.map((chat, index) => ({
        name: `Session ${index + 1}`, // Sequential numbering
        chat: chat.chat,
      }));
  
      setChatSessions(sessions);
    } catch (error) {
      console.error("Error fetching chats from MongoDB", error);
    }
  };
  
  // ✅ Initialize chat sessions on load
  useEffect(() => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    fetchChatsFromMongo();

    const handleBeforeUnload = () => saveToMongo();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveToMongo]);

  // ✅ Toggle Sidebar
  const sideSE = () => setSide((prev) => !prev);

  // ✅ Handle message send
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await axios.post("https://medicalchatbot-2.onrender.com/chat", { message });
      const botMessage = { text: res.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error: Server not responding", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load selected session
  const loadSession = (session) => setMessages(session.chat);

  // ✅ Delete chat session (MongoDB + UI)
  const deleteSession = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/api/chats/deleteChat/${index}`);
      alert("Chat deleted successfully!");
  
      // Refresh the chat sessions after deletion
      fetchChatsFromMongo();
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };
  

  // ✅ Start new chat session
  const startNewChat = async () => {
    if (messages.length > 0) {
      await saveToMongo();
    }
    setMessages([]);
    fetchChatsFromMongo(); // Refresh sessions
  };

  return (
    <div className="parent-div">
      {/* Sidebar */}
      <div className={`side-bar ${sidenav ? "active" : ""}`}>
        <div className="side-navigate">
          <span onClick={startNewChat}>New Chat</span>
        </div>

        {/* Chat History */}
        <div className="previouschat">
          <ul>
            {chatSessions.map((session, index) => (
              <li key={index}>
                <strong className="session-div" onClick={() => loadSession(session)}>
                  {session.name}
                  <span
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents loading while deleting
                      deleteSession(session.name);
                    }}
                  >
                    ⋮
                  </span>
                </strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="main-content">
        <div className="headsec">
          <button onClick={sideSE}>☰</button>
          <div className="medtitle">MedicalChatBot</div>
        </div>

        <div className="conversaction">
          {messages.map((msg, index) => (
            <div key={index} className={`message-container ${msg.sender}`}>
              <img
                src={msg.sender === "bot" ? botAvatar : userAvatar}
                alt="avatar"
                className="avatar"
              />
              <div className="message">{msg.text}</div>
            </div>
          ))}

          {loading && (
            <div className="message-container bot">
              <img src={botAvatar} alt="avatar" className="avatar" />
              <div className="message loading-indicator">...</div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="input-area">
          <textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            rows="1"
          />
        </div>
      </div>
    </div>
  );
}