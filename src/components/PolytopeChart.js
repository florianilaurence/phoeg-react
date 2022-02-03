import React, {useEffect, useState} from "react";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import {Group} from "@visx/group";
import {Axis, AxisBottom, AxisLeft, AxisTop} from "@visx/axis";
import {scaleLinear} from "@visx/scale";

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

    useEffect( async () => {
        let pathEnv = "assets/data_" + props.invariantName + "/enveloppes/enveloppe-" + props.numberVertices + ".json";
        let pathPoints = "assets/data_" + props.invariantName + "/points/points-" + props.numberVertices + ".json";

        const tempLines = await fetch(pathEnv, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                return readEnvelope(myJson);
            });
        const tempPoints = await fetch(pathPoints, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                return readPoints(myJson, props.invariantName, props.invariantColor);
            })

    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    const minX = 0;
    const maxX = 10;
    const minY = 0;
    const maxY = 20;

    const background = '#f3f3f3';
    const width = 750;
    const height = 500;
    const margin = { top: 35, right: 35, bottom: 35, left: 35 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = scaleLinear({
        range: [margin.left, innerWidth],
        domain: [minX, maxX],
        nice: true,
    });

    const yScale = scaleLinear({
        range: [innerHeight, margin.top],
        domain: [minY, maxY],
        nice: true,
    });

    return (
        <svg width={width} height={height}>
            <rect width={width} height={height} fill={background}/>
            <Group left={margin.left} top={margin.top}>
                <AxisLeft scale={yScale} left={margin.left} />
                <Axis orientation="bottom" scale={xScale} top={innerHeight} />
            </Group>
        </svg>
    )
}
