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

  const saveToMongo = useCallback(async () => {
    if (messages.length > 0) {
      try {
        await axios.post("http://localhost:5000/api/chats/saveChat", { chat: messages });
      } catch (error) {
        console.error("Error saving to MongoDB", error);
      }
    }
  }, [messages]);

  useEffect(() => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    const storedSessions = Object.keys(sessionStorage).map((key) => ({
      name: key,
      chat: JSON.parse(sessionStorage.getItem(key)),
    }));
    setChatSessions(storedSessions);

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      saveToMongo();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveToMongo]);

  const sideSE = () => setSide((prev) => !prev);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage("");

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

  const loadSession = (session) => setMessages(session.chat);

  const deleteSession = (sessionName) => {
    sessionStorage.removeItem(sessionName);
    setChatSessions((prev) => prev.filter((session) => session.name !== sessionName));
  };

  const startNewChat = async () => {
    if (messages.length > 0) {
      const sessionName = `Session ${new Date().toISOString()}`;
      if (!sessionStorage.getItem(sessionName)) {
        sessionStorage.setItem(sessionName, JSON.stringify(messages));
      }
    }
    await saveToMongo();
    setMessages([]);

    const updatedSessions = Object.keys(sessionStorage).map((key) => ({
      name: key,
      chat: JSON.parse(sessionStorage.getItem(key)),
    }));
    setChatSessions(updatedSessions);
  };

  return (
    <div className="parent-div">
      <div className={`side-bar ${sidenav ? "active" : ""}`}>
        <div className="side-navigate">
          <span onClick={startNewChat}>New Chat</span>
        </div>
        <div className="previouschat">
  <ul>
    {chatSessions.map((session, index) => (
      <li key={index}>
        <strong onClick={() => loadSession(session)}>
          {session.name}
          <span className="delete-icon" onClick={(e) => {
            e.stopPropagation(); // Prevents triggering loadSession when deleting
            deleteSession(session.name);
          }}>
            ⋮
          </span>
        </strong>
      </li>
    ))}
  </ul>
</div>
      </div>

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