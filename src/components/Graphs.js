import React, {useEffect, useState} from "react";
import {readGraph, readPoints} from "../core/ParseFiles";
import Select from "react-select";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";



export default function Graphs(props) {
    const [graphs, setGraphs] = useState([]); // La liste des graphes correspondant aux critères
    let currentGraph = {};

    let myGraph = {
        nodes: [{ id: "n1", label: "Alice" }, { id: "n2", label: "Bob" }],
        edges: [{ id: "e1", source: "n1", target: "n2"}]
    };

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

    const constructGraph = () => {

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
                <button type="button" onClick={constructGraph}>Soumettre</button>
            </label>
            <Sigma graph={myGraph} settings={{ drawEdges: true, clone: false }}>
                <RelativeSize initialSize={15} />
                <RandomizeNodePositions />
            </Sigma>
        </div>
    )
}