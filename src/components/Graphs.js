import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import GraphSlider from "./GraphSlider";

export default function Graphs(props) {
    const [graphlist, setGraphList] = useState(["@"]); // La liste des graphes correspondant aux critères
    const [computedList, setComputedList] = useState(false);

    useEffect( () => {
        let pathGraph = "assets/data_" + props.invariantName + "/graphes/graphes-" + props.numberVertices + ".json";
        fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                let temp = readGraph(myJson, props.numberEdges, props.invariantName, props.invariantValue);
                if (temp !== null) {
                    setGraphList(temp);
                    setComputedList(true);
                } else {
                    setComputedList(false);
                }
            })
    }, [props.invariantName, props.invariantValue, props.numberVertices, props.numberEdges] );

    const RenderGraphSlider = () => {
        if (computedList) {
            return <GraphSlider graphList={graphlist}/>;
        } else {
            return null;
        }
    }

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.invariantName} | Nombre d'arêtes : {props.numberEdges} | Nombre de sommets : {props.numberVertices} | Valeur de l'invariant : {props.invariantValue} </p>
            <RenderGraphSlider />
        </div>
    );
}