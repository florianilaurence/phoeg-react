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

const rootElement = document.getElementById('root');

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" exact element={<App />} />
            <Route path="/about" element={<About />} />
            <Route path="/tutorial" element={<Tutorial />} />
        </Routes>
    </BrowserRouter>,
    rootElement
  );

