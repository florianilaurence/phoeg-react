import logo from "../assets/logo_phoeg.png"
import Polytopes from "./Polytopes.js"
import file from "../data/description.txt"
import React from "react";

export default class Banner extends React.Component {
    render() {
        return (
            <div className="banner">
                <h1 align="center">PHOEG
                    <img align="right" src={logo} className="app-logo" alt="logo"/>
                </h1>
                <text align="justify">{this.readFile}</text>
            </div>
        )
    }
};