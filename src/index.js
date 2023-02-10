import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/home_and_frame/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./components/annex_pages/About.js";
import Tutorial from "./components/annex_pages/Tutorial.js";
import Welcome from "./components/annex_pages/Welcome";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={"/ui"}>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/home" exact element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/tutorial" element={<Tutorial />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
