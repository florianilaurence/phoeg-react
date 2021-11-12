import $ from "jquery";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useState} from "react";
import {Bubble} from "react-chartjs-2";

export default function PolytopeChart(props) {
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}]);
    const [points, setPoints] = useState([{data: [{x: 0, y: 0, r: 5}]}]); // Remarque j'ai besion ici d'une liste de datasets car les points doivent avoir des couleurs différentes
    const [data, setData] = useState({datasets: [points, {type: 'line', data: envelope}]})
    let currentEnvelope = envelope;

    const update = () => {
        let pathEnv = "assets/data_" + props.invariant + "/enveloppes/enveloppe-" + props.number + ".csv"; //TODO Changer fichier en json
        let pathPoints = "assets/data_" + props.invariant + "/points/points-" + props.number + ".csv";
        $.get(pathEnv, function(dataEnvelope) {
            let env = readEnvelope(dataEnvelope, props.invariant);
            if(env.length >  2) {
                env.push(env[0]);
            }
            setEnvelope(env);
            $.get(pathPoints, function (dataPoints) {
                let points = readPoints(dataPoints);
                setPoints(points);
            });
        });
    }

/*
    const data = {
          datasets: [{
              label: 'First Dataset',
              data: [{x: 20, y: 30, r: 15}, {x: 0, y: 0, r: 10}],
              backgroundColor: 'rgb(255, 99, 132)'
          },
          {
              type: 'line',
              label: 'Second Dataset',
              data: [{x: 10, y: 10}, {x: 20, y: 10}, {x: 20, y: 20}, {x: 10, y: 20}, {x: 10, y: 10}],
              backgroundColor: 'rgb(99,255,107)'
          }]};
*/

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            {
                console.log(props.invariant)
            }
            <Bubble
                data={data}
                height={200}
            />
        </div>
    )


}
