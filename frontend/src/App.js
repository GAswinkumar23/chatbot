import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import "./App.css";
import botAvatar from "./images/image.png";
import userAvatar from "./images/human.png";

export default function App() {
  // const [search, setSearch] = useState("");
  const [sidenav, setSide] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  }, []);

  /*****************side bar ***************************/
  const sideSE = () => {
    setSide(!sidenav);
  };

  /********************user message processing*****************/
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { text: message, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage("");

    /******************bot message precessing *****************/
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatData = [
    { id: 1, context: "Alice", chat: "Hello, how are you?" },
    { id: 2, context: "Bob", chat: "I'm good, thanks! What about you?" },
    { id: 3, context: "Alice", chat: "I'm doing great. Working on my project." },
    { id: 4, context: "Bob", chat: "Nice! Need any help?" },
  ];

  return (
    <div className="parent-div">
      <div className={`side-bar ${sidenav ? "active" : ""}`}>
        Sidebar Content
        <div className="side-navigate">
          <span onClick={() => alert("Currently updating not fully functionalable")}>New Chat</span>
        </div>
        <div className="previouschat">
          <ul>
            {chatData.map((chat) => (
              <li key={chat.id}>
                <strong>{chat.context}: </strong>
                {chat.chat}
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
          <nav className="head-nav">
            {/* <span className="share">Share</span>
            <span className="profile" onClick={() => alert("Currently updating not fully functionalable")}>
              <img src={userAvatar} alt="profile icon"/>
            </span> */}
          </nav>
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

        {/* <div className="search-div">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div> */}
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