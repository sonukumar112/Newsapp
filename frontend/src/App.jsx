import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import SavedNews from "./Components/SavedNews/SavedNews";
import Notes from "./Components/Notes/Notes";
import Feedback from "./Components/Feedback/Feedback";
import LoginSignup from "./Components/LoginSignup/LoginSignup";
import Home from "./Components/Home/Home";
import { NewsProvider } from "./Components/NewsContext";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };
  return (
    <NewsProvider>
      <BrowserRouter>
        <Navbar onSearch={handleSearch} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/saved" element={<SavedNews />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/loginsignup" element={<LoginSignup />} />
        </Routes>
      </BrowserRouter>
    </NewsProvider>
  );
}

export default App;
