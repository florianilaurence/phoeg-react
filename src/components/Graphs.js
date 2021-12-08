import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import GraphSlider from "./GraphSlider";

export default function Graphs(props) {
    const [graphlist, setGraphList] = useState(["@"]); // La liste des graphes correspondant aux critères

    useEffect( () => {
        if (props.selected) {
            let pathGraph = "assets/data_" + props.name + "/graphes/graphes-" + props.n + ".json";
            fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    setGraphList(readGraph(myJson, props.m, props.invariantVal, props.name));
                })
            }
        }, [props.m, props.name, props.invariantVal, props.n, props.selected] );

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>
            <GraphSlider graphList={graphlist}/>
        </div>
    );
}