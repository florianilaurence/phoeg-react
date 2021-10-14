import Banner from "./Banner.js";
import Polytopes from "./Polytopes.js";
import Graphs from "./Graphs.js";

function App() {
    return (
        <div className="app">
            <header className="app_header">
                <Banner />
                <Polytopes />
                <Graphs />
            </header>
        </div>
    )
}

export default App;