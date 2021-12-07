import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import Graph from "./Graph";

export default function Graphs(props) {
    // const [graphsList, setGraphsList] = useState([]); // La liste des graphes correspondant aux critères
    const [currentIndex, setCurrentIndex] = useState(0); // Indice du graphe à afficher

    useEffect( () => {
        if (props.selected) {
            let pathGraph = "assets/data_" + props.name + "/graphes/graphes-" + props.n + ".json";
            fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    let graphs = readGraph(myJson, props.m, props.invariantVal, props.name);
                    if (graphs.length > 0) {
                        renderGraphs(graphs);
                    }
                })
            }
        }, [props.m, props.name, props.invariantVal, props.n, props.selected] );

    const renderGraphs = (graphs) => {
        return (
            <div>
                <p> Nous avons trouvé {graphs.length} graphe(s) différent(s) </p>
                <button onClick={() => currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(graphs.length - 1)}>
                    Précédent
                </button>
                <Graph signature={graphs[currentIndex]}/>
                <button onClick={() => {
                    setCurrentIndex((currentIndex + 1) % graphs.length);
                }}>
                    Suivant
                </button>
            </div>
        );
    }

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>
        </div>
    );
}