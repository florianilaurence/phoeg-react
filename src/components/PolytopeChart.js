import $ from "jquery";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useState} from "react";
import {Scatter} from "react-chartjs-2";

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

    const resetCanvas = () => {
        let polytopeCanvas = document.getElementById("pol_chart" + props.invariant);
        let polytopeContainer = polytopeCanvas.parentElement;
        polytopeCanvas.remove();
        let newCanvas = document.createElement('canvas');
        newCanvas.id = "pol_chart" + props.invariant;
        polytopeContainer.append(newCanvas);
        return document.getElementById("pol_chart" + props.invariant);
    };

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
/*
    const initChart = (envelope, points) => {
        const canvas = resetCanvas();
        let chart = new Chart(canvas.getContext('2d'), {
            type: 'bubble',
            data: {
                datasets:[
                    {
                        type: 'line',
                        label: 'Enveloppe',
                        data: currentEnvelope,
                        lineTension: 0,
                        fill: false,
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0
                    },
                    {
                        type: 'bubble',
                        data: [
                            {x: 1, y: 1},
                            {x: 2, y: 2}
                        ]
                    }
                ]
            },
            options: {
                animation: false,
                parsing: false
            }});
        return chart;
    }*/

    const data = {
        type: 'line',
        datasets: [
            {
                label: 'ESSAI',
                data: [
                    {x: 1, y: 1},
                    {x: 3, y: 3},
                    {x: 4, y: 2},
                    {x: 1, y: 1}
                ],
                backgroundColor: 'rgba(255, 99, 132, 1)',
            },
        ],
    };

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    },
                },
                ],
        },
    };

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            <Scatter
                data={data}
                options={options} />
        </div>
    )


}
