
// Component's core
import React, {useEffect, useState} from "react";
import {readGraph, readPoints} from "../core/ParseFiles";
import Select from "react-select";

export default function Graphs(props) {
    const [graphs, setGraphs] = useState([]);
    let currentGraph = {};

    useEffect( () => {
        let pathGraph = "assets/data_" + props.name + "/graphes/graphes-" + props.n + ".json";
        fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        setGraphs(readGraph(myJson, props.m, props.invariantVal, props.name));
                    })

        }, [props.m, props.n, props.name, props.invariantVal]
    )

    const handleChangeGraph = (newGraph) => {
        currentGraph = newGraph.value;
        return true;
    }

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>
            <label>
                    Nous avons trouvé {graphs.length} graphe(s) différent(s)
                    <Select
                        defaultValue={currentGraph}
                        onChange={handleChangeGraph}
                        options={graphs}
                    />
                </label>
        </div>
    )
}