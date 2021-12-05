import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import Select from "react-select";
import Graph from "./Graph";
import Slider from "@farbenmeer/react-spring-slider";
import AwesomeSlider from 'react-awesome-slider';

function constructNodes(n) {
    const nodes = [];
    for (let i = 0; i < n; i++) {
        nodes.push({ id: `n${i}` });
    }
    return nodes;
}

function parseToBits(data) {
    let bits = []
    for (let b of data) {
        for (let i = 5; i >= 0; i--) {
            bits.push((b >> i) & 1);
        }
    }
    return bits;
}

function constructEdges(bits, n) {
    const edges = [];
    let cnt = 0;
    let edgesCnt = 0;
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if (bits[cnt]) {
                edges.push({ id: `e${edgesCnt}`, source: `n${i}`, target: `n${j}` })
                edgesCnt += 1;
            }
            cnt += 1;
        }
    }
    return edges;
}

function unpack(str) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
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
    const [graphsList, setGraphsList] = useState([]); // La liste des graphes correspondant aux critères
    const [nodes, setnodes] = useState([]);
    const [edges, setEdges] = useState([]);

    let currentGraphSelect = {};

    useEffect( () => {
        let pathGraph = "assets/data_" + props.name + "/graphes/graphes-" + props.n + ".json";
        fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        setGraphsList(readGraph(myJson, props.m, props.invariantVal, props.name));
                    })

        }, [props.m, props.n, props.name, props.invariantVal]
    )

    const handleChangeGraph = (newGraph) => {
        currentGraphSelect = newGraph.value;
        refreshNodesEdges();
        return true;
    }

    const refreshNodesEdges = () => {
        let signature = currentGraphSelect["sig"];
        const bytesArr = unpack(signature);
        for (let i in bytesArr) {
            bytesArr[i] -= 63;
        }

        let [n, data] = bytesArrayToN(bytesArr);
        let nodes = constructNodes(n);
        let bits = parseToBits(data);
        let edges = constructEdges(bits, n);

        setnodes(nodes);
        setEdges(edges);
    }

    return (
        <div className="graphs">
            <AwesomeSlider animation="cubeAnimation">
                <div> A </div>
                <div> B </div>
                <div> C </div>
            </AwesomeSlider>
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>

        </div>
    );
    /*
            <label>
                Nous avons trouvé {graphsList.length} graphe(s) différent(s) :
                <Select
                    defaultValue={currentGraphSelect}
                    onChange={handleChangeGraph}
                    options={graphsList}
                />
            </label>
            <Graph nodes={nodes} edges={edges}/>
     */
}