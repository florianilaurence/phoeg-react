import $ from "jquery";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useState} from "react";
import {Bubble} from "react-chartjs-2";

export default function PolytopeChart(props) {
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}]);
    let currentEnvelope = envelope;
    let currentDataEnv = {
        type: 'bubble',
        datasets: [
            {
                type: 'line',
                label: 'Enveloppe',
                data: currentEnvelope,
                fill: false,
            }]};

    const update = () => {
        let pathEnv = "https://florianilaurence.github.io/assets/data_" + props.invariant
            + "/enveloppes/enveloppe-" + props.number + ".csv";
        let pathPoi = "https://florianilaurence.github.io/assets/data_" + props.invariant
            + "/points/points-" + props.number + ".csv";
        $.get(pathEnv, function(dataEnvelope) {
            let env = readEnvelope(dataEnvelope, props.invariant);
            $.get(pathPoi, function (dataPoints) {
                env.push(env[0]);
                let points = readPoints(dataPoints);
                currentEnvelope = env;
                setEnvelope(env);
                currentDataEnv = {
                    labels: [],
                    datasets: [
                        {
                            label: 'Envelope',
                            data: currentEnvelope,
                            fill: false,
                        }
                    ]
                };
            });
        });
    }

    const data = {
          datasets: [{
              label: 'First Dataset',
              data: [{
                  x: 20,
                  y: 30,
                  r: 15
              }, {
                  x: 40,
                  y: 10,
                  r: 10
              }],
              backgroundColor: 'rgb(255, 99, 132)'
          },
          {
              type: 'line',
              label: 'Second Dataset',
              data: [{
                  x: 80,
                  y: 3
              }, {
                  x: 40,
                  y: 10
              }],
              backgroundColor: 'rgb(255, 99, 132)'
          }
          ]
        }
    ;

    const options = {
        type: 'bubble',
        data: data,
        options: {}
    };

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            <Bubble
                data={data}
                options={options}
                height={200}
            />
        </div>
    )


}
