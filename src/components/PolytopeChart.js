import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useState} from "react";
import {Bubble} from "react-chartjs-2";
import 'chartjs-plugin-zoom';

export default function PolytopeChart(props) {
    const [data, setData] = useState({datasets: [
            {type: 'bubble', data: [{x: 0, y: 0, r: 5}]},
            {type: 'line', data: [{x: 0, y: 0}]}
        ]})

    useEffect( () => {
        let pathEnv = "assets/data_" + props.invariant + "/enveloppes/enveloppe-" + props.number + ".json";
        let pathPoints = "assets/data_" + props.invariant + "/points/points-" + props.number + ".json";

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
                        const points = readPoints(myJson, props.invariant, props.color);
                        points.push({type: 'line', label: "Envelope", borderColor: "0xFFFFFF", data: envelope});
                        setData({datasets: points});
                    })
            });
    },
        [props.invariant, props.color, props.number]);

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
        console.log(elt);
        console.log("OK " + evt);
    }

    return (
        <div>
            <h4> Polytope Chart </h4>
            <Bubble
                data={data}
                options={options}
                height={200}
                getElementAtEvent={(elt, evt) => handleClick(elt, evt)}
            />
        </div>
    )
}


