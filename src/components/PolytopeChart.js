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
        datasets: [
            {
                label: "Line Dataset 2",
                data: [{ x: 1, y: 10 }, { x: 3, y: 10 }],
                type: "line",
                fill: "false",
                // pointRadius: 0,
                pointStyle: "circle"
            },
            {
                label: "Line Dataset",
                data: [{ x: 1, y: 10, r: 5 }, { x: 3, y: 10, r: 5 }],
                pointHoverRadius: [5, 5, 5],
                type: "bubble",
                // pointRadius: 0,
                pointStyle: "circle"
            }],
        labels: ["Data"]
    };

    const options = {
        elements: {
            line: {tension: 0.000001}
        },
        tooltips: {displayColors: false},
        legend: {display: false},
        scales: {
            xAxes: [
                {
                    gridLines: {
                        display: true,
                        drawBorder: true
                    },
                    ticks: {
                        stepSize: 0.5,
                        min: -0.5,
                        max: 3.5,
                        precision: 0.01
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Incidenza",
                        padding: 10
                    }
                }
                ],
            yAxes: [
                {
                    gridLines: {
                        display: true,
                        drawBorder: true
                    },
                    ticks: {
                        stepSize: 5,
                        min: 0,
                        max: 20
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Coefficiente Potenza di Fuoco",
                        padding: 10
                    }
                }
                ]
        }
    };

    const plugins = [
        {
            afterDraw: (chartInstance, easing) => {
                console.log("aaa");
            }
        }];

    return (
        <div>
            <h4> Polytope Chart </h4>
            <p>
                Invariant : {props.invariant} Color : {props.color} Number : {props.number}
            </p>
            <Bubble
                data={data}
                options={options}
                plugins={plugins}
                height={200}
            />
        </div>
    )


}
