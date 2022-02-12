import React, {useEffect, useState} from "react";
import {readEnvelope, readPoints} from "../core/ParseFiles";
import {Group} from "@visx/group";
import {Axis, AxisLeft} from "@visx/axis";
import {scaleLinear} from "@visx/scale";
import {Circle, LinePath} from "@visx/shape";
import {GridColumns, GridRows} from "@visx/grid";
import { Dimensions } from 'react-native';
import Select from "react-select";

const accessors = (data, param) => {
    if (data !== undefined) { // Obligatoire sinon problème, car est parfois appelé avec un undefined
        switch (param) {
            case 'x':
                return data.x;
            case 'y':
                return data.y;
            case 'r':
                return data.r;
            default:
                return data.col;
        }
    }
}

export default function PolytopeChart(props) {
    // Données de configuration de l'encadré contenant le graphique
    const background = '#fafafa';
    const width = Dimensions.get('window').width;
    const height = width / 2;
    const margin = { top: 35, right: 35, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Les lignes de l'enveloppe du polytope
    const [lines, setLines] = useState([{}]);

    // Dictionnaire de tous les clusters de points possibles
    const [allClusters, setAllClusters] = useState({});

    // Liste des nom de clusters
    const [clusterList, setClusterList] = useState([]);

    // Indice correspondant à la liste de cluster courant
    const [indexCluster, setIndexCluster] = useState(0);

    // Valeurs nécessaires pour construit les axes et les échelles (xScale et yScale)
    const [minX, setMinX] = useState(0);
    const [maxX, setMaxX] = useState(0);
    const [minY, setMinY] = useState(0);
    const [maxY, setMaxY] = useState(0);
    const [minColor, setMinColor] = useState(0);
    const [maxColor, setMaxColor] = useState(0);

    // Permet de recalculer les domaines seulement si le nombre de clusters a été changé (éviter trop de re render qui plantent l'appli)
    const [previousState, setPreviousState] = useState(0);

    // COLORATIONS
    const optionsTypeColoration = [
        { value: 'gradient', label: 'Coloration par gradient' },
        { value: 'indep', label: 'Coloration en choisissant les couleurs'}
    ];
    const [typeSelected, setTypeSelected] = useState(optionsTypeColoration[0]);
    let typeCurrent = typeSelected.value;

    //    * Pour une coloration indépendante
    //          Liste des domaines correspondants à chaque couleur
    const [domains, setDomains] = useState([]);
    //          Liste des inputs de sélection de couleurs
    const [range, setRange] = useState([]);

    //     * Pour une coloration par gradient
    const [maxDomain, setMaxDomain] = useState(1); // 1 pour quand il n'y a qu'un cluster, les points prennent la couleur de color1
    const [color1, setColor1] = useState('#000000');
    const [color2, setColor2] = useState('#fff200');
    const colorScale = scaleLinear({
        domain: [0, maxDomain], // Le domaine doit être lié au nombre de clusters pas à la valeur de l'invariant couleur => Répartition fair des couleurs
        range: [color1, color2]
    });

    // Fonction d'initialisation à la création du graphique
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
                return readPoints(myJson, props.invariantX, "m", props.invariantColor); // ToDo A modifier pour ne pas être hardcodé
            })
        computeScaleDomains(tempPoints, tempLines);
        setLines(tempLines);
        let groupedByColor = regroupPointsByColor(tempPoints); // COLORS et GROUPEDBYCOLOR
        let clusters = computeAllCluster(groupedByColor.pointsGr, groupedByColor.cols, tempPoints);
        setAllClusters(clusters.allClusters);
        setClusterList(clusters.clusterPossible);
        setMaxDomain(Math.max(1, clusterList[indexCluster]-1));
    },
        [props.invariantX, props.invariantY, props.invariantColor]);

    // Calcule les domaines pour les échelles en X et en Y
    const computeScaleDomains = (tempPoints, tempLines) => {
        setMinX(Math.floor(Math.min(
            Math.min(...tempPoints.map((d) => accessors(d, "x"))),
            Math.min(...tempLines.map((d) => accessors(d, "x"))))
        ));
        setMaxX(Math.ceil(Math.max(
            Math.max(...tempPoints.map((d) => accessors(d, "x"))),
            Math.max(...tempLines.map((d) => accessors(d, "x"))))
        ));
        setMinY(Math.floor(Math.min(
            Math.min(...tempPoints.map((d) => accessors(d, "y"))),
            Math.min(...tempLines.map((d) => accessors(d, "y"))))
        ));
        setMaxY(Math.ceil(Math.max(
            Math.max(...tempPoints.map((d) => accessors(d, "y"))),
            Math.max(...tempLines.map((d) => accessors(d, "y"))))
        ));
        setMinColor(Math.min(...tempPoints.map((d) => accessors(d))));
        setMaxColor(Math.max(...tempPoints.map((d) => accessors(d))));
    }

    // Echelle pour l'axe Ox
    const xScale = scaleLinear({
        range: [margin.left, innerWidth],
        domain: [minX, maxX],
        round: true,
    });

    // Echelle pour l'axe Oy
    const yScale = scaleLinear({
        range: [innerHeight, margin.top],
        domain: [minY, maxY],
        round: true,
    });

    // Fonctions pour regrouper les points et les calculs qui y sont associés
    const regroupPointsByColor = (points) => {
        let pointsGr = {};
        for (let point of points) {
            if (pointsGr[point.col] == null) {
                pointsGr[point.col] = [];
            }
            pointsGr[point.col].push(point);
        }
        return {
            cols: Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a - b),
            pointsGr: pointsGr
        };
    }

    const computeAllCluster = (groupedByColor, colors, points) => {
        let currentNbCluster = 2;
        let currentSizeCluster = Math.floor(colors.length / currentNbCluster);
        let viewedNb = [1];
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
        while (end <= colors.length - sizeCluster) {
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

    // COLORATIONS
    const handleChangeType = (newType) => {
        setTypeSelected(newType);
        typeCurrent = newType.value;
    }

    // Fonctions pour la coloration avec choix
    const computeNamesDomain = (currentGroupedPoints) => {
        let result = [];
        if (currentGroupedPoints !== undefined) {
            for (let group of currentGroupedPoints) {
                let min = Math.min(...group.map((d) => d.col));
                let max = Math.max(...group.map((d) => d.col));
                if (min !== max) {
                    result.push(`[${min} ; ${max}]`);
                } else {
                    result.push(`${min}`);
                }
            }
        }
        return result;
    }

    const computeColorsRange = (newDomain) => {
        let result = [];
        if (range.length > newDomain.length) {
            result = range.slice(0, newDomain.length); // Copie du nombre de couleurs nécessaires
        } else if (range.length < newDomain.length) {
            result = range.slice(); // Copier l'entièreté des précédentes couleurs
            let i = range.length;
            while (i < newDomain.length) { // Compléter avec suffisamment de couleurs
                let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                while (color in result) {
                    color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
                }
                result.push(color);
                i++;
            }
        }
        return result;
    }

    // Créer les balises de choix des couleurs pour une coloration avec choix
    const RenderInputColorsForIndep = () => {
        let result = [];
        for (let i in range) {
            result.push(
                <div>
                    <input type="color" name={range[i]} id={range[i]} value={range[i]} onChange={e => {
                        let tempRange = range.slice();
                        tempRange[i] = e.target.value;
                        setRange(tempRange);
                    }} />
                    <label htmlFor={range[i]}> {props.invariantColor} = {domains[i]} </label>
                </div>

            )
        }
        return result;
    }

    const RenderInputColorsForGradient = () => {
        if (clusterList[indexCluster] === 1) {
            return (
                <div>
                    <p> {props.invariantColor} : </p>
                    <input type="color" name="color1" id="color1" value={color1} onChange={e => setColor1(e.target.value)}/>
                    <label htmlFor="color1"> { minColor } - { maxColor } </label>
                </div>
            )
        } else {
            return (
                <div>
                    <p> {props.invariantColor} : </p>
                    <input type="color" name="color1" id="color1" value={color1} onChange={e => setColor1(e.target.value)}/>
                    <label htmlFor="color1"> { minColor } </label>
                    <input type="color" name="color2" id="color2" value={color2} onChange={e => setColor2(e.target.value)}/>
                    <label htmlFor="color2"> { maxColor } </label>
                </div>
            )
        }
    }

    const selectColorForOnePoint = (i) => {
        let col = colorScale(i);
        if (typeCurrent === 'indep') {
            col = range[i];
        }
        return col;
    }

    const updateStates = () => {
        let currentClustersNumber = clusterList[indexCluster];
        let currentGroupedPoints = allClusters[currentClustersNumber];
        if (previousState !== currentClustersNumber) { // Il faut modifier le range et le domain du color scale
                setMaxDomain(Math.max(1, clusterList[indexCluster]-1));
                setPreviousState(currentClustersNumber);
                let currentDomain = computeNamesDomain(currentGroupedPoints);
                setDomains(currentDomain);
                setRange(computeColorsRange(currentDomain));
            }
    }

    // Créer les points sur le graphique
    const RenderCircleSeries = () => {
        let result = [];
        if (clusterList.length > 0) { // Important, car parfois appelé avant que les données ne soient correctement initialisées
            let currentClustersNumber = clusterList[indexCluster];
            let currentGroupedPoints = allClusters[currentClustersNumber];
            currentGroupedPoints.map((group, i) => {
                group.map((currentData, j) => result.push(
                    <React.Fragment key={`group-${i}-${j}`}>
                        <Circle
                            cx={xScale(accessors(currentData, "x"))}
                            cy={yScale(accessors(currentData, "y"))}
                            r={4}
                            fill={selectColorForOnePoint(i, accessors(currentData))}
                        />
                    </React.Fragment>
                ));
            });
            return result;
        } else {
            return null;
        }
    }

    return (
        <div>
            {updateStates()}
            <svg width={width} height={height}>
                <rect width={width} height={height} fill={background}/>
                <Group left={margin.left} top={margin.top}>
                    <AxisLeft scale={yScale} left={margin.left} />
                    <Axis orientation="bottom" scale={xScale} top={innerHeight} />
                    <GridRows left={margin.left} scale={yScale} width={innerWidth} strokeDasharray="1" stroke={'#464646'} strokeOpacity={0.25} pointerEvents="none" />
                    <GridColumns bottom={margin.bottom} scale={xScale} height={innerHeight} strokeDasharray="1" stroke={'#464646'} strokeOpacity={0.25} pointerEvents="none" />
                    <Group pointerEvents="none">
                        <LinePath
                            stroke="black"
                            strokeWidth={ 1 }
                            data={ lines }
                            x={ (d) => xScale(accessors(d, "x")) }
                            y={ (d) => yScale(accessors(d, "y")) }
                        />
                        <RenderCircleSeries />
                    </Group>
                </Group>
            </svg>
            <Select defaultValue={typeSelected} options={optionsTypeColoration} onChange={handleChangeType}/>
            {typeCurrent === 'indep' ?
                <RenderInputColorsForIndep /> :
                <RenderInputColorsForGradient />
            }

            <p>
                Combien souhaitez-vous de clusters pour colorier les graphes ? {clusterList.map(d => d + " ")}
            </p>
            <button onClick={() => setIndexCluster(indexCluster > 0 ? indexCluster - 1 : clusterList.length - 1)}> Précédent </button>
            {" " + clusterList[indexCluster] + " "}
            <button onClick={() => setIndexCluster((indexCluster+1) % clusterList.length)}> Suivant </button>
        </div>
    )
}
