import ParseFiles from '../core/ParseFiles'
import React from "react";
import { Bubble } from "react-chartjs-2";

export default function PolytopeChart(props) {
    const update = () => {
        const parser = new ParseFiles(props.invariant, props.coloration, props.number);
        let envelope = parser.readEnvelope();
        let points = parser.readPoints();
        let data = {
            datasets: [
                {
                    type: 'line',
                    label: "Enveloppe",
                    data: envelope,
                    lineTension: 0,
                    fill: false,
                    backgroundColor: 'black',
                    borderColor: 'black',
                    pointRadius: 0
                },
                ...points
            ]
        }
        return <Bubble type={"bubble"} data={data}/>
    }

    return (
        <div>
            <h4>invariant : {props.invariant} number : {props.number} coloration : {props.coloration}</h4>
            {update()}
        </div>
    )
}