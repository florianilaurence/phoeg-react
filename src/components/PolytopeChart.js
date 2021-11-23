import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useState} from "react";
import {Bubble} from "react-chartjs-2";

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
                        console.log(points[0]);
                        setData({datasets: [{type: 'bubble', data: points}, {type: 'line', data: envelope}]});
                    })
            });
    },
        [props.invariant, props.color, props.number]);

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            <Bubble
                data={data}
                height={200}
            />
        </div>
    )
}


