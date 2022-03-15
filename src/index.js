import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App.js';
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";
import About from "./components/About.js"
import Tutorial from "./components/Tutorial.js"
import Welcome from "./components/Welcome";

const rootElement = document.getElementById('root');

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

