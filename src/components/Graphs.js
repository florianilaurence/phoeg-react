import React, {useEffect, useState} from "react";
import {readGraph, readPoints} from "../core/ParseFiles";
import Select from "react-select";
import { Sigma, RandomizeNodePositions, RelativeSize } from "react-sigma";


function unpack(str) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        //bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
        }
    return bytes;
}

function bytesArrayToN(bytesArray) {
    if (bytesArray[0] <= 62)
        return [bytesArray[0], bytesArray.slice(1)];

    if (bytesArray[1] <= 62)
        return [(bytesArray[1] << 12) + (bytesArray[2] << 6) + bytesArray[3], bytesArray.slice(4)];

    return [(bytesArray[2] << 30)
                + (bytesArray[3] << 24)
                + (bytesArray[4] << 18)
                + (bytesArray[5] << 12)
                + (bytesArray[6] << 6)
                + bytesArray[7],
        bytesArray.slice(8)];
}

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
        let signature = currentGraph["sig"];
        const bytesArr = unpack(signature);
        for (let i in bytesArr) {
            bytesArr[i] -= 63;
        }
        let [n, data] = bytesArrayToN(bytesArr);
        let nd = Math.floor((Math.floor(n * (n - 1) / 2) + 5) / 6)
        let bits = []
        for (let b of data) {
            for (let i = 5; i >= 0; i--) {
                bits.push((b >> i) & 1);
            }
        }
        const nodes = [];
        for (let i = 0; i < n; i++) {
            nodes.push({
                data: {
                    id: `n${i}`
                }
            });
        }

        const edges = [];
        let cnt = 0;
        let edgesCnt = 0;
        for (let j = 1; j < n; j++) {
            for (let i = 0; i < j; i++) {
                if (bits[cnt]) {
                    edges.push({
                        data: { id: `e${edgesCnt}`, source: `n${i}`, target: `n${j}` }
                    })
                    edgesCnt += 1;
                }
                cnt += 1;
            }
        }
        console.log(bytesArr);
        return { nodes, edges };
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