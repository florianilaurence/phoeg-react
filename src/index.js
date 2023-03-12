import ReactDOM from "react-dom";
import MainApp from "./components/home_and_frame/MainApp";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./components/annex_pages/About.tsx";
import Tutorial from "./components/annex_pages/Tutorial.tsx";
import Welcome from "./components/annex_pages/Welcome.tsx";
import AutoConjApp from "./components/autoconjectures/AutoConjApp";
import Infos from "./components/annex_pages/Infos";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <BrowserRouter basename={"/ui"}>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/main-app" exact element={<MainApp />} />
      <Route path="/tutorial" element={<Tutorial />} />
      <Route path="/about" element={<About />} />
      <Route path="/autonconj-app" element={<AutoConjApp />} />
      <Route path="/infos" element={<Infos />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);
