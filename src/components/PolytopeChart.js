import React, {useEffect, useState} from "react";
import {Axis, GlyphSeries, LineSeries, XYChart} from "@visx/xychart";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import { Zoom } from "@visx/zoom";

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
    const [maxCluster, setMaxCluster] = useState(10);
    const [clusterNb, setClusterNb] = useState(1);
    const [domainX, setDomainX] = useState([1, 10]);

    const xScale = {type: 'linear', domain: domainX};
    const yScale = {type: 'linear'};

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
        [props.invariantName, props.invariantColor, props.numberVertices, clusterNb, maxCluster]);

    const regroupedPoints2 = (grouped, colors) => {
        let sizeCluster = Math.ceil(colors.length / clusterNb);
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

    const regroupedPoints = (points) => {
        let pointsGr = {};
        let minX = 100;
        let maxX = 0;
        for (let point of points) {
            if (pointsGr[point.col] == null) {
                pointsGr[point.col] = [];
            }
            minX = Math.min(minX, point.x);
            maxX = Math.max(maxX, point.x);
            pointsGr[point.col].push(point);
        }
        const colors = Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a >= b);
        setMaxCluster(colors.length);
        setDomainX([Math.floor(minX), Math.ceil(maxX)]);
        if (colors.length > clusterNb) {
            return regroupedPoints2(pointsGr, colors);
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
                    dataKey={`${group[0].col} - ${group[group.length-1].col}`}
                    data={group}
                    size={4}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')}
                    renderGlyphs={data => accessors(data, 'r')}
                />
            )
        }
        return result;
    }

    return (
        <div>
            <XYChart
                height={500}
                xScale={xScale}
                yScale={yScale}>
                <Axis orientation="bottom" label={props.invariantName}  />
                <Axis orientation="left" label="Nombres d'arêtes"/>
                <LineSeries
                    dataKey="Enveloppe"
                    data={lines}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')} />
                <RenderGlypheSeries />
            </XYChart>
            <p>
                Combien souhaitez-vous de clusters pour colorier les graphes ? Entre {1} et {maxCluster}.
            </p>
            <button onClick={() => clusterNb > 1 ? setClusterNb(clusterNb - 1):setClusterNb(1)}> - </button>
            {" " + clusterNb + " "}
            <button onClick={() => setClusterNb(Math.max((clusterNb + 1) % (maxCluster + 1), 1))}> + </button>
            {
                // Attention le changement du nombre de clusters n'entraîne pas toujours un changement
                // Car au moment de au ceil, on peut tomber plusieurs fois sur la même valeur
                // Math.ceil(3.3) === Math.ceil(3.6)
            }
        </div>
    );
}


