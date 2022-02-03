import React, {useEffect, useState} from "react";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import {Group} from "@visx/group";
import {Axis, AxisLeft} from "@visx/axis";
import {scaleLinear} from "@visx/scale";
import {Circle, LinePath} from "@visx/shape";

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
    const [lines, setLines] = useState([{}]);
    const [points, setPoints] = useState([{}]);

    useEffect( async () => {
        let pathEnv = "assets/data_" + props.invariantX + "/enveloppes/enveloppe-" + props.invariantY + ".json";
        let pathPoints = "assets/data_" + props.invariantX + "/points/points-" + props.invariantY + ".json";

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
                return readPoints(myJson, props.invariantX, props.invariantColor);
            })
        console.log(tempPoints);
        setPoints(tempPoints);
        setLines(tempLines);
        console.log(points);
    },
        [props.invariantX, props.invariantY, props.invariantColor]);

    const minX = Math.min(...points.map((d) => accessors(d, "x")));
    const maxX = Math.max(...points.map((d) => accessors(d, "x")));
    const minY = Math.min(...points.map((d) => accessors(d, "y")));
    const maxY = Math.max(...points.map((d) => accessors(d, "y")));

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
                <Group pointerEvents="none">
                    <LinePath
                        stroke="black"
                        strokeWidth={ 1 }
                        data={ lines }
                        x={ (d) => xScale(d.x) }
                        y={ (d) => yScale(d.y) }
                    />
                    {
                        points.map((d) => (
                            <Circle
                                fill="black"
                                cx={ xScale(accessors(d, "x")) }
                                cy={ yScale(accessors(d, "y")) }
                                r={ accessors(d, "") }
                            />
                        ))
                    }
                </Group>

            </Group>
        </svg>
    )
}
