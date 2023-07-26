import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Header from "./components/Header";
import "./style.scss";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sent from "./components/Sent";
import Compose from "./components/Compose";
import Nav from "./components/Nav";
import Inbox from "./components/Inbox";
import Info from "./components/Info";
import Forward from "./components/Forward";
import Profile from "./components/Profile";
import Modal from "./components/Modal";

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const [showNav, setShowNav] = useState(true);
  return (
    <BrowserRouter>
      <Header />
      {showNav && currentUser && <Nav setShowNav = {setShowNav}/>}
      <Routes>
        <Route path="/" element={<Login setShowNav = {setShowNav}/>} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/register" element={<Register setShowNav = {setShowNav}/>} />
        <Route path="/sent" element={<Sent />} />
        <Route path="/compose" element={<Compose />} />
        <Route path="/sent/:fileId" element={<Info />} />
        <Route path="/inbox/:fileId" element={<Info />} />
        <Route path="/inbox/:fileId/forward" element={<Forward />} />
        <Route path="/sent/:fileId/forward" element={<Forward />} />
        <Route path="/profile" element = {<Profile setShowNav = {setShowNav}/>}/>
        <Route path="/:id" element = {<Modal />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
