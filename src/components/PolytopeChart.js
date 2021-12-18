import React, {useEffect, useMemo, useState} from "react";
import {Axis, GlyphSeries, LineSeries, XYChart} from "@visx/xychart";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import {scaleLinear, scaleQuantile} from "@visx/scale";
import {LegendLinear, LegendQuantile} from "@visx/legend";


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

const colorMinMax = (colors) => {
    let min = colors[0].col;
    let max = colors[0].col;
    for(let col of colors) {
        if (col.col < min) {
            min = col.col;
        } else if (col.col > max) {
            max = col.col;
        }
    }
    return {min: min, max: max};
}

const groupedPoints2 = (grouped, colors, numberClusters) => {
    let sizeCluster = Math.floor(colors.length / numberClusters);
    let result = [];
    let start = 0;
    let end = sizeCluster;
    while (end < grouped.length) {
        let temp = [];
        while (start <= end) {
            temp.push(grouped[colors[start]]);
            start += 1;
        }
        result.push(temp);
        end += sizeCluster;
    }
    let temp = [];
    while (start < grouped.length) {
        temp.push(grouped[colors[start]]);
        start += 1;
    }
    result.push(temp);
    return result;
}

const regroupedPoints = (points, numberClusters) => {
    let pointsGrouped = {};
    for (let point of points) {
        if (pointsGrouped[point.col] == null) {
            pointsGrouped[point.col] = [];
        }
        pointsGrouped[point.col].push(point);
    }
    const colors = Object.keys(pointsGrouped).map(x => parseInt(x)).sort((a, b) => a >= b);
    return groupedPoints2(pointsGrouped, colors, numberClusters);
}


export default function PolytopeChart(props) {
    const [points, setPoints] = useState([{}]);
    const [groupedPoints, setGroupedPoints] = useState([[{}]]);
    const [lines, setLines] = useState([{}]);

    const xScale = {type: 'linear'}
    const yScale = {type: 'linear'}

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

    const RenderGlypheSeries = () => {
        let grouped = regroupedPoints(points, 10);
        return (
            grouped.map((listPoints) =>
                <GlyphSeries
                    dataKey={listPoints[0]}
                    data={listPoints}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')}
                    renderGlyphs={data => accessors(data, 'r')} />
            )
        );

    }

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
            <RenderGlypheSeries />
        </XYChart>
    );
}


