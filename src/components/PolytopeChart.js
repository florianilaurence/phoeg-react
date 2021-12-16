import {readEnvelope, readPoints} from "../core/ParseFiles";
import React, {useEffect, useMemo, useState} from "react";
import {
    AnimatedAxis, // any of these can be non-animated equivalents
    AnimatedGrid,
    AnimatedLineSeries,
    LineSeries,
    XYChart,
} from '@visx/xychart';
import Graphs from "./Graphs";
import {Circle} from "@visx/shape";
import {GridColumns} from "@visx/grid";

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

    const data1 = [
        { x: 0.5, y: 0.5 },
        { x: 0.5, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 0.5},
        { x: 0.5, y: 0.5}
    ];

    const data2 = [
        { x: 0.75, y: 0.25, r: 5},
        { x: 0.25, y: 0.9, r: 5 },
        { x: 0.9, y: 0.9, r: 5 },
        { x: 0.9, y: 0.25, r: 5},
        { x: 0.25, y: 0.25, r: 5}
    ]

    const accessors = {
        xAccessor: d => d.x,
        yAccessor: d => d.y,
    };
    const xScale = { type: 'linear' }
    const yScale = { type: 'linear'}

    return (

        <XYChart height={300} xScale={xScale} yScale={yScale}>
            <LineSeries dataKey={"Essaie"} data={data1} xAccessor={accessors.xAccessor} yAccessor={accessors.yAccessor} />
            {data2.map((point, i) => (
              <Circle
                key={`point-${point[0]}-${i}`}
                className="dot"
                cx={point.x}
                cy={point.y}
                r={point.r}
                fill={"red"}
              />
            ))}
        </XYChart>
    );
}


