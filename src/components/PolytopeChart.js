import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useState} from "react";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-zoom';
import Graphs from "./Graphs";

export default function PolytopeChart(props) {
    const [data, setData] = useState({datasets: [
            {type: 'bubble', data: [{x: 0, y: 0, r: 5}]},
            {type: 'line', data: [{x: 0, y: 0}]}
        ]});
    const [numberEdges, setNumberEdges] = useState(0);
    const [invariantValue, setInvariantValue] = useState(0);
    const [selected, setSelected] = useState(false);

    useEffect( () => {
        let pathEnv = "assets/data_" + props.invariantName + "/enveloppes/enveloppe-" + props.numberVertices + ".json";
        let pathPoints = "assets/data_" + props.invariantName + "/points/points-" + props.numberVertices + ".json";
        fetch(pathEnv, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                const envelope = readEnvelope(myJson);
                fetch(pathPoints, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        const points = readPoints(myJson, props.invariantName, props.invariantColor);
                        points.push({type: 'line', label: "Envelope", borderColor: "0xFFFFFF", data: envelope}); // Ajoute l'enveloppe à la suite des points
                        setData({datasets: points});
                    })
            });
    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    const options = {
        /*events: [
            onclick = (evt) => {
                console.log("cool");
                console.log(evt);
            }
        ],*/
        // title: { display: true, text: "Polytope pour l'invariant " + props.invariant},
        /*plugins: {
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x',
                },
                zoom:{
                    wheel: {enabled: true, modifierKey: 'ctrl'},
                    drag: {enabled: true, modifierKey: 'shift'},
                    pinch: {enabled: true},
                    mode: 'xy'
                }
            }
        }*/
    };

    const handleClick = (elt, evt) => {
        if (elt.length > 0) {
            let datasetIndex = elt[0]["datasetIndex"];
            let index = elt[0]["index"];
            let point = data["datasets"][datasetIndex]["data"][index];
            setNumberEdges(point["y"]);
            setInvariantValue(point["x"]);
            setSelected(true);
        } else {
            setSelected(false);
        }
    }

    const RenderGraphs = () => {
        if (selected) {
            return <Graphs
                invariantName={props.invariantName}
                invariantValue={invariantValue}
                numberVertices={props.numberVertices}
                numberEdges={numberEdges}
            />;
        } else {
            return null;
        }
    }

    return (
        <div>
            <h4> Polytope Chart </h4>
            <Bubble
                data={data}
                options={options}
                height={200}
                getElementAtEvent={(elt, evt) => handleClick(elt, evt)}
                type={"bubble"}/>
            <RenderGraphs />
        </div>
    )
}


