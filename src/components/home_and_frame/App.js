import Polytopes from "../polytopes/Polytopes.js";
import "react-banner/dist/style.css";
import Banner from "./Banner";
import Introduction from "./Introduction";

// Main component
export default function App() {
    return (
        <div className="app">
            <Banner isHome="true"/>
            <Introduction />
            <Polytopes />
        </div>
    )
}