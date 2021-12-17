import React, {useEffect, useMemo, useState} from "react";
import {Axis, GlyphSeries, LineSeries, XYChart} from "@visx/xychart";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import {scaleLinear, scaleQuantile} from "@visx/scale";
import {LegendQuantile} from "@visx/legend";


const accessors = (data, param) => {
    if (data !== undefined) { // Obligatoire sinon problème car est parfois appelé avec un undefined
        switch (param) {
            case 'x':
                return data.x;
            case 'y':
                return data.y;
            case 'r':
                return data.r;
            case 'c':
                return data.c;
            default:
                console.log("Houston, on a un problème !")
            }
        }
    }

export default function PolytopeChart(props) {
    const [points, setPoints] = useState([{}]);
    const [lines, setLines] = useState([{}]);

    const xScale = {type: 'linear'}
    const yScale = {type: 'linear'}

    const colorMin = Math.min(points.map(data => accessors(data, 'c')));

    const sizeScale = scaleLinear({
        domain: [0, 10],
        range: [5, 13],
    });

    useEffect( () => {
        let pathEnv = "assets/data_" + props.invariantName + "/enveloppes/enveloppe-" + props.numberVertices + ".json";
        let pathPoints = "assets/data_" + props.invariantName + "/points/points-" + props.numberVertices + ".json";
        fetch(pathEnv, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                setLines(readEnvelope(myJson));
                fetch(pathPoints, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        setPoints(readPoints(myJson, props.invariantName, props.invariantColor));
                    })
            });
    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    return (
        <XYChart
            height={300}
            xScale={xScale}
            yScale={yScale}>
            <Axis orientation="bottom" />
            <Axis orientation="left" />
            <LineSeries
                dataKey="Enveloppe"
                data={lines}
                xAccessor={data => accessors(data, 'x')}
                yAccessor={data => accessors(data, 'y')} />
            <GlyphSeries
                dataKey="Points"
                data={points}
                xAccessor={data => accessors(data, 'x')}
                yAccessor={data => accessors(data, 'y')}
                renderGlyphs={data => accessors(data, 'r')} />
        </XYChart>
    );
}


