import { useState } from "react";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [sidenav, setSide] = useState(false);

  const sideSE = () => {
    setSide(!sidenav);
  };
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
        {/* <button onClick={sideSE}>☰</button> */}
        <div className="side-navigate">
            <span onClick={()=>alert("Currently updating not fully functionalable")}>New Chat</span>
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
      <div className="main-content">
        <div className="headsec">
        <button onClick={sideSE}>☰</button>
        <div className="medtitle">MedicalChatBot</div>
        <nav className="head-nav">
          <span>share</span>
          
          <span className="profile" onClick={()=>alert("Currently updating not fully functionalable")}>Profile</span>
        </nav>
        </div>
        <div className="conversaction">Conversaction</div>

        <div className="search-div">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
          />
        </div>
      </div>
    </div>
  );
}