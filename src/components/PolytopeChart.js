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

    const [groupedPointsByColor, setGroupedPointsByColor] = useState({});             // Liste des points regroupés par couleurs
    const [groupedPointsByCluster, setGroupedPointsByCluster] = useState([[{}]]);     // Liste des points regroupés par clusters de couleurs
    const [lines, setLines] = useState([{}]);                                         // Liste des lignes qui construisent l'enveloppe

    const [colors, setColors] = useState([]);                                         // Liste des valeurs de couleurs différentes
    const [clustersList, setClustersList] = useState([]);                             // Liste des clusters possibles
    const [indexCluster, setIndexCluster] = useState(0);                              // Index pointant sur l'un des clusters de la liste

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
                        let points = readPoints(myJson, props.invariantName, props.invariantColor);
                        setGroupedPointsByColor(regroupedPointsByColor(points)); // Construit le dico (Clé = color, Value = Liste de points)
                        if (colors.length > clusterNb) {
                            setGroupedPointsByCluster(regroupedPointsByCluster());
                        } else {
                            let result = [];
                            for (let col of colors) {
                                result.push(groupedPointsByColor[col]);
                            }
                            setGroupedPointsByCluster(result);
                            setClustersList(computeClustersList());
                        }
                    })
            });
    },
        [props.invariantName, props.invariantColor, props.numberVertices]);

    useEffect(() => {
        if (colors.length > clusterNb) {
            setGroupedPointsByCluster(regroupedPointsByCluster());
        } else {
            let result = [];
            for (let col of colors) {
                result.push(groupedPointsByColor[col]);
            }
            setGroupedPointsByCluster(result);
        }
    },
        [clusterNb]);

    const computeClustersList = () => {
        let maxCluster = colors.length;
        let currentNb = 1;
        let currentSize = Math.ceil( maxCluster / currentNb);
        let result = [1];
        while (currentNb < maxCluster) {
            if (! currentSize in result ) {
                result.push(currentSize);
            }
            currentNb += 1;
            currentSize = Math.ceil( maxCluster / currentNb);
        }
        return result;
    }

    const regroupedPointsByCluster = () => {
        let sizeCluster = clustersList[indexCluster];
        let maxCluster = colors.length;
        let result = [];
        let start = 0;
        let end = sizeCluster;
        while (end < maxCluster - sizeCluster) {
            let temp = [];
            while (start < end) {
                temp.push(...groupedPointsByColor[colors[start]]);
                start += 1;
            }
            result.push(temp);
            end += sizeCluster;
        }
        let temp = [];
        while (start < maxCluster) {
            temp.push(...groupedPointsByColor[colors[start]]);
            start += 1;
        }
        result.push(temp);
        return result;
    }

    const regroupedPointsByColor = (points) => { // Séparer du regroupement par cluster pour ne pas être appelé trop souvent
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
        setColors(Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a >= b));
        setDomainX([Math.floor(minX), Math.ceil(maxX)]);
        return pointsGr;
    }

    const RenderGlypheSeries = () => {
        let result = [];
        for (let group of groupedPointsByCluster) {
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
                Combien souhaitez-vous de clusters pour colorier les graphes ? Entre {1} et {colors.length}.
            </p>
            <button onClick={() => clusterNb > 1 ? setClusterNb(clusterNb - 1):setClusterNb(1)}> - </button>
            {" " + clusterNb + " "}
            <button onClick={() => setClusterNb(Math.max((clusterNb + 1) % (colors.length + 1), 1))}> + </button>
            {
                // Attention le changement du nombre de clusters n'entraîne pas toujours un changement de la coloration
                // Car au moment du ceil, on peut tomber plusieurs fois sur la même valeur
                // Math.ceil(3.3) === Math.ceil(3.6)
            }
        </div>
    );
}


