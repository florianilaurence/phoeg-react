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
    const [allClusters, setAllClusters] = useState({});
    const [lines, setLines] = useState([{}]);

    const [clusterList, setClusterList] = useState([]);
    const [indexCluster, setIndexCluster] = useState(0);

    let firstTime = true;

    const xScale = {type: 'linear'}
    const yScale = {type: 'linear'}

    useEffect( () => {

    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    const regroupPointsByColor = (points) => {
        let pointsGr = {};
        for (let point of points) {
            if (pointsGr[point.col] == null) {
                pointsGr[point.col] = [];
            }
            pointsGr[point.col].push(point);
        }
        return {
            cols: Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a >= b),
            pointsGr: pointsGr
        };
    }

    const computeAllCluster = (groupedByColor, colors, points) => {
        let currentNbCluster = 2;
        let currentSizeCluster = Math.ceil(colors.length / currentNbCluster);
        let viewedNb = [];
        let result = {
            1: [points]
        };
        while (currentNbCluster <= colors.length) {
            let currentClusters = regroupPointsInCluster(currentSizeCluster, colors, groupedByColor);
            if (!viewedNb.includes(currentClusters.length)) {
                viewedNb.push(currentClusters.length);
                result[currentClusters.length] = currentClusters;
            }
            currentNbCluster += 1;
            currentSizeCluster = Math.ceil(colors.length / currentNbCluster);
        }
        return {
            clusterPossible: viewedNb.sort((a, b) => a - b),
            allClusters: result
        };
    }

    const regroupPointsInCluster = (sizeCluster, colors, groupedPointsByColor) => {
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
        let currentGroupedPoints = allClusters[clusterList[indexCluster]];
        for (let group of currentGroupedPoints) {
            result.push(
                <GlyphSeries
                    dataKey={`${group[0].col} - ${group[group.length - 1].col}`}
                    data={group}
                    xAccessor={data => accessors(data, 'x')}
                    yAccessor={data => accessors(data, 'y')}
                    renderGlyphs={data => accessors(data, 'r')}/>
            )
        }
        return result;
    }

    const initData = () => {
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
                let points = readPoints(myJson, props.invariantName, props.invariantColor);
                let temp = regroupPointsByColor(points); // COLORS et GROUPEDBYCOLOR
                let temp2 = computeAllCluster(temp.pointsGr, temp.cols, points);
                setAllClusters(temp2.allClusters);
                setClusterList(temp2.clusterPossible);
                firstTime = false;
            })
    }

    return (
        <div>
            {firstTime ? initData() : null}
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
            <p>
                Combien souhaitez-vous de clusters pour colorier les graphes ? {clusterList.map(d => d + " ")}
            </p>
            <button onClick={() => setIndexCluster(indexCluster > 0 ? indexCluster - 1 : clusterList.length)}> Précédent </button>
            {" " + clusterList[indexCluster] + " "}
            <button onClick={() => setIndexCluster(indexCluster < clusterList.length ? indexCluster + 1 : 1)}> Suivant </button>
        </div>
    );
}
