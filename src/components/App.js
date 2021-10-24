import Banner from "./Banner.js";
import Polytopes from "./Polytopes.js";
import Graphs from "./Graphs.js";
import Menu from "./Menu.js";

// Component's core
export default function App() {
    return (
        <div className="app">
            <header className="app_header">
                <Banner/>
                <Menu/>
                <Polytopes/>
                <Graphs/>
            </header>
        </div>
    )
}