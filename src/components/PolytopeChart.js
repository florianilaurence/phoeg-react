import $ from "jquery";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useState} from "react";
import {Bubble} from "react-chartjs-2";

export default function PolytopeChart(props) {
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}, {x: 1, y: 1}]);
    const [points, setPoints] = useState([{data: [{x: 0, y: 0, r: 5}]}]); // Remarque j'ai besion ici d'une liste de datasets car les points doivent avoir des couleurs différentes
    const [data, setData] = useState({datasets: [points, {type: 'line', data: envelope}]})

    const update = () => {
        let pathEnv = "assets/data_" + props.invariant + "/enveloppes/enveloppe-" + props.number + ".json";
        let pathPoints = "assets/data_" + props.invariant + "/points/points-" + props.number + ".json";

        fetch(pathPoints
            ,{
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }})
            .then(function(response){
                return response.json();
            })
            .then(function(myJson) {
                setPoints(readPoints(myJson, props.invariant));
            });


        fetch(pathEnv
            ,{
            headers : {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }})
            .then(function(response){
                return response.json();
            })
            .then(function(myJson) {
                setEnvelope(readEnvelope(myJson));
            });
        setData({datasets: [points, {type: 'line', data: envelope}]});
    }

    useEffect(update, [props.invariant, props.color, props.number]);

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
