import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useState} from "react";
import {SigmaContainer, useSigma} from "react-sigma-v2";
import Graph from "graphology";
import Sigma from "sigma";

export default function PolytopeChart(props) {
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}, {x: 1, y: 1}]);
    const [points, setPoints] = useState([{data: [{x: 0, y: 0, r: 5}]}]); // Remarque j'ai besion ici d'une liste de datasets car les points doivent avoir des couleurs différentes
    const [data, setData] = useState({datasets: [points, {type: 'line', data: envelope}]})

    const update = () => {
        let pathEnv = "assets/data_" + props.invariant + "/enveloppes/enveloppe-" + props.number + ".json";
        let pathPoints = "assets/data_" + props.invariant + "/points/points-" + props.number + ".json";

        fetch(pathPoints,{headers : {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function(response){
                return response.json();
            })
            .then(function(myJson) {
                setPoints(readPoints(myJson, props.invariant));
            });

        fetch(pathEnv, {headers : {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function(response){
                return response.json();
            })
            .then(function(myJson) {
                setEnvelope(readEnvelope(myJson));
            });
        setData({datasets: [points, {type: 'line', data: envelope}]});
    }

    const MyCustomGraph = () => {
        const sigma = useSigma();
        const graph = sigma.getGraph();
        graph.addNode("Jessica", { label: "Jessica", x: 1, y: 1, color: "#FF0", size: 10 });
        graph.addNode("Truman", { label: "Truman", x: 0, y: 0, color: "#00F", size: 5 });
        graph.addEdge("Jessica", "Truman", { color: "#CCC", size: 1 });
        return null;
    }

    useEffect(update, [props.invariant, props.color, props.number]);

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            ReactDOM.render(
                <React.StrictMode>
                    <SigmaContainer style={{ height: "500px", width: "500px" }}>
                        <MyCustomGraph />
                    </SigmaContainer>
                </React.StrictMode>,
            document.getElementById("root"),.
            );
        </div>
    )


}
