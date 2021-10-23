import Banner from "./Banner.js";
import Polytopes from "./Polytopes.js";
import Graphs from "./Graphs.js";
import Menu from "./Menu.js";
import React from "react";

// Component's core

export default class App extends React.Component {
    render() {
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
}