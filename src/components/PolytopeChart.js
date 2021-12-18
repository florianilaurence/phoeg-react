import React, {useEffect, useState} from "react";
import {Axis, GlyphSeries, LineSeries, XYChart} from "@visx/xychart";
import {readEnvelope, readPoints} from "../core/ParseFiles";

const accessors = (data, param) => {
    if (data !== undefined) { // Obligatoire sinon problème car est parfois appelé avec un undefined
        switch (param) {
            case 'x':
                return data.x;
            case 'y':
                return data.y;
            case 'r':
                return data.r;
            default:
                return data.c;
        }
    }
}

export default function PolytopeChart(props) {
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
                        setGroupedPoints(regroupedPoints(readPoints(myJson, props.invariantName, props.invariantColor), 10));
                    })
            });
    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    const regroupedPoints2 = (grouped, colors, numberClusters) => {
        let sizeCluster = Math.ceil(colors.length / numberClusters);
        let result = [];
        let start = 0;
        let end = sizeCluster;
        while (end < colors.length - sizeCluster) {
            let temp = [];
            while (start < end) {
                temp.push(...grouped[colors[start]]);
                start += 1;
            }
            result.push(temp);
            end += sizeCluster;
        }
        let temp = [];
        while (start < colors.length) {
            temp.push(...grouped[colors[start]]);
            start += 1;
        }
        result.push(temp);
        return result;
    }

    const regroupedPoints = (points, numberClusters) => {
        let pointsGr = {};
        for (let point of points) {
            if (pointsGr[point.col] == null) {
                pointsGr[point.col] = [];
            }
            pointsGr[point.col].push(point);
        }
        const colors = Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a >= b);
        if (colors.length > numberClusters) {
            return regroupedPoints2(pointsGr, colors, numberClusters);
        } else {
            let result = [];
            for (let col of colors) {
                result.push(pointsGr[col]);
            }
            return result;
        }
    }

    const RenderGlypheSeries = () => {
        let result = [];
        for (let group of groupedPoints) {
            result.push(
                <GlyphSeries
                    dataKey={`Points-${group[0].col}`}
                    data={group}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')}
                    renderGlyphs={data => accessors(data, 'r')} />
            )
        }
        return result;
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


