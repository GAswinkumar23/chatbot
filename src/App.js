import { useState } from "react";
import "./App.css";

export default function App() {
  const [search, setSearch] = useState("");
   const[sidenav,setSide]=useState(false);
  
   const sideSE =()=>{
    setSide(!sidenav);
   };
   return (
    
    <div className="parent-div">
      <div className="side-bar"></div>
        <button onClick={sideSE}></button>
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