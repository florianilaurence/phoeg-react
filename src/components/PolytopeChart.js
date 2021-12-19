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
    let firstTime = true;
    const [dataIsReturned, setDataIsReturned] = useState(false);
    let points = [{}];
    const [groupedPointsByColor, setGroupedPointsByColor] = useState({});
    const [groupedPointsByClusters, setGroupedPointsByClusters] = useState([[{}]]) ;
    const [lines, setLines] = useState([{}]);

    const [clustersList, setClustersList] = useState([]);
    const [clusterNb, setClusterNb] = useState(1);
    const [colors, setColors] = useState([]);

    const xScale = {type: 'linear'}
    const yScale = {type: 'linear'}

    useEffect( () => {
        if (firstTime) {
            console.log("IF");
            let pathEnv = "assets/data_" + props.invariantName + "/enveloppes/enveloppe-" + props.numberVertices + ".json";
            let pathPoints = "assets/data_" + props.invariantName + "/points/points-" + props.numberVertices + ".json";
            fetch(pathEnv, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    setLines(readEnvelope(myJson));
                });
            fetch(pathPoints, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                .then(function (response) {
                    return response.json();
                })
                .then(function (myJson) {
                    points = readPoints(myJson, props.invariantName, props.invariantColor);
                    setDataIsReturned(true);
                    regroupPointsByColor();
                    computeClustersList();
                    regroupPointsByClusterSwitch();
                    firstTime = false;
                })

        } else {
            console.log("ELSE");
            regroupPointsByClusterSwitch();
        }
    },
        [props.invariantName, props.invariantColor, props.numberVertices, firstTime, dataIsReturned, clusterNb]);

    const computeClustersList = () => {
        let maxCluster = colors.length;
        let currentNb = 1;
        let currentSize = Math.ceil( maxCluster / currentNb);
        let result = [1];
        while (currentNb < maxCluster) {
            if (!result.includes(currentSize)) {
                result.push(currentSize);
            }
            currentNb += 1;
            currentSize = Math.ceil( maxCluster / currentNb);
        }
        result.sort((a, b) => a - b);
        setClustersList(result);
    }

    const regroupPointsByColor = () => {
        let pointsGr = {};
        for (let point of points) {
            if (pointsGr[point.col] == null) {
                pointsGr[point.col] = [];
            }
            pointsGr[point.col].push(point);
        }
        setColors(Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a >= b))
        setGroupedPointsByColor(pointsGr);
    }

    const regroupPointsByClusterSwitch = () => {
        if (colors.length > clusterNb) {
            setGroupedPointsByClusters(regroupPointsByCluster(groupedPointsByColor));
        } else {
            let result = [];
            for (let col of colors) {
                result.push(groupedPointsByColor[col]);
            }
            setGroupedPointsByClusters(result);
        }
    }

    const regroupPointsByCluster = () => {
        let sizeCluster = Math.ceil(colors.length / clusterNb);
        let result = [];
        let start = 0;
        let end = sizeCluster;
        while (end < colors.length - sizeCluster) {
            let temp = [];
            while (start < end) {
                temp.push(...groupedPointsByColor[colors[start]]);
                start += 1;
            }
            result.push(temp);
            end += sizeCluster;
        }
        let temp = [];
        while (start < colors.length) {
            temp.push(...groupedPointsByColor[colors[start]]);
            start += 1;
        }
        result.push(temp);
        return result;
    }

    const RenderGlypheSeries = () => {
        let result = [];
        for (let group of groupedPointsByClusters) {
            result.push(
                <GlyphSeries
                    dataKey={`${group[0].col} - ${group[group.length-1].col}`}
                    data={group}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')}
                    renderGlyphs={data => accessors(data, 'r')} />
            )
        }
        return result;
    }

    return (
        <div>
            <XYChart height={500} xScale={xScale} yScale={yScale}>
                        <Axis orientation="bottom" label={props.invariantName}/>
                        <Axis orientation="left" label="Nombre d'arêtes"/>
                        <LineSeries
                            dataKey="Enveloppe"
                            data={lines}
                            xAccessor={data => accessors(data, 'x')}
                            yAccessor={data => accessors(data, 'y')}/>
                        <RenderGlypheSeries/>
                    </XYChart>
                    <p>Combien souhaitez-vous de clusters pour colorier les graphes?Entre {1} et {colors.length}.</p>
                    <button onClick={() => setClusterNb(clusterNb > 1 ? clusterNb - 1 : colors.length)}> -</button>
                        {" " + clusterNb + " "}
                    <button onClick={() => setClusterNb(clusterNb < colors.length ? clusterNb + 1 : 1)}> + </button>
                {
                    // Attention le changement du nombre de clusters n'entraîne pas toujours un changement
                    // Car au moment de au ceil, on peut tomber plusieurs fois sur la même valeur
                }
        </div>
    );
}
