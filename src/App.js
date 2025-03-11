import { useState } from "react";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
   const[sidenav,setSide]=useState(true);
  
   const sideSE =()=>{
    setSide(!sidenav);
   };
   return (
    
    <div className="parent-div">
      <button onClick={sideSE}>☰</button>
      <div className={`side-bar ${sidenav ? "active" : ""}`}>
        Sidebar Content
        <button onClick={sideSE}>☰</button>
      </div>
      <div className="main-content">
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