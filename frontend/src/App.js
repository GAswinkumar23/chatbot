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

  useEffect(() => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });

    // Load previous sessions on mount
    const storedSessions = Object.keys(sessionStorage).map((key) => ({
      name: key,
      chat: JSON.parse(sessionStorage.getItem(key)),
    }));
    setChatSessions(storedSessions);
  }, []);

  /*****************side bar ***************************/
  const sideSE = () => {
    setSide(!sidenav);
  };

  /******************** Save session to sessionStorage *****************/
  const saveSession = useCallback(() => {
    if (messages.length > 0 && !loading) {
      const sessionName = `Session ${Object.keys(sessionStorage).length + 1}`;
      if (!sessionStorage.getItem(sessionName)) {
        sessionStorage.setItem(sessionName, JSON.stringify(messages));
        setChatSessions((prev) => [
          ...prev,
          { name: sessionName, chat: messages },
        ]);
      }
    }
  }, [messages, loading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    saveSession();
  }, [messages, saveSession]);

  /********************user message processing*****************/
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage("");

    /******************bot message processing *****************/
    try {
      const res = await axios.post("http://192.168.52.83:5000/chat", { message });
      const botMessage = { text: res.data.response, sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { text: "Error: Server not responding", sender: "bot" }]);
    } finally {
      setLoading(false);
    }
  };

  /******************** Load selected session *****************/
  const loadSession = (session) => {
    setMessages(session.chat);
  };

  /******************** Start new chat session *****************/
  const startNewChat = () => {
    setMessages([]);
  };

  return (
    <div className="parent-div">
      <div className={`side-bar ${sidenav ? "active" : ""}`}>
        Sidebar Content
        <div className="side-navigate">
          <span onClick={startNewChat}>New Chat</span>
        </div>
        <div className="previouschat">
          <ul>
            {chatSessions.map((session, index) => (
              <li key={index} onClick={() => loadSession(session)}>
                <strong>{session.name}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* main Content */}
      <div className="main-content">

        {/* head section  */}
        <div className="headsec">
          <button onClick={sideSE}>☰</button>
          <div className="medtitle">MedicalChatBot</div>
        </div>

        {/* conversation Div */}
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

        {/* input area  */}
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