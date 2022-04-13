import React, {useEffect, useState} from "react";
import {readEnvelope, readPoints} from "../../core/ParseFiles";
import {Group} from "@visx/group";
import {Axis, AxisLeft} from "@visx/axis";
import {scaleLinear} from "@visx/scale";
import {LinePath} from "@visx/shape";
import {GridColumns, GridRows} from "@visx/grid";
import {Dimensions, Text} from 'react-native';
import Select from "react-select";
import "./Polytopes.css";
import Graphs from "../graphs/Graphs";
import {stringify} from "qs";
import {API_URL} from "../../.env";
import {fetch_api} from "../../core/utils";
import {
    accessors, computeAllCluster,
    computeColorsRange,
    computeTagsDomainGradient,
    computeTagsDomainIndep, regroupPointsByColor
} from "../../core/utils_PolytopeChart";
import {Zoom} from "@visx/zoom";
import { RectClipPath } from '@visx/clip-path';
import {localPoint} from "@visx/event";
import { Tooltip } from 'react-svg-tooltip';

export default function PolytopeChart(props) {
    // Données de configuration de l'encadré contenant le graphique
    const background = '#fafafa';
    const background_mini_map = 'rgba(197,197,197,0.9)';
    const width = Dimensions.get('window').width*70/100;
    const height = width / 2;
    const margin = { top: 35, right: 35, bottom: 35, left: 35 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Les lignes de l'enveloppe du polytope
    const [lines, setLines] = useState([{}]);

    // Dictionnaire de tous les clusters de points possibles
    const [allClusters, setAllClusters] = useState({});

    // Liste des noms de clusters
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

    // COLORATIONS
    const optionsTypeColoration = [
        { value: 'gradient', label: 'Coloration par gradient' },
        { value: 'indep', label: 'Coloration en choisissant les couleurs'}
    ];
    const [typeSelected, setTypeSelected] = useState(optionsTypeColoration[0]);
    let typeCurrent = typeSelected.value;

    //    * Pour une coloration indépendante
    //          Liste des domaines correspondants à chaque couleur
    const [domainsIndep, setDomainsIndep] = useState([]);
    //          Liste des inputs de sélection de couleurs
    const [range, setRange] = useState([]);

    //     * Pour une coloration par gradient
    const [maxDomain, setMaxDomain] = useState(1); // 1 pour quand il n'y a qu'un cluster, les points prennent la couleur de color1
    const [color1, setColor1] = useState('#000000');
    const [color2, setColor2] = useState('#00ff00');
    const colorScale = scaleLinear({
        domain: [0, maxDomain], // Le domaine doit être lié au nombre de clusters pas à la valeur de l'invariant couleur => Répartition fair des couleurs
        range: [color1, color2]
    });
    let [tagsGradient, setTagsGradient] = useState([]);
    let colorsGradient = [];

    // Pour sélectionner un point du graphe et passer à la suite
    const [selectedX, setSelectedX] = useState(null);
    const [selectedY, setSelectedY] = useState(null);
    const [selected, setSelected] = useState(false);

    // Pour sélectionner un point à partir de la légende
    const [selectedMin, setSelectedMin] = useState(-Infinity);
    const [selectedMax, setSelectedMax] = useState(+Infinity);
    const [selectedTag, setSelectedTag] = useState("");
    const [isLegendClicked, setIsLegendClicked] = useState(false);

    // Fonction d'initialisation à la création du graphique
    useEffect( async () => {
        // Récupération des données du polytope
        const graphPath = props.endpoint.value.path;
        let envelope_request = new URL(`${API_URL}${graphPath}/polytope`);
        envelope_request += "?" + stringify({
            max_graph_size: props.maxOrder,
            x_invariant: props.invariantX,
            y_invariant: props.invariantY,
            constraints: props.others
        })

        const envelope = await fetch_api(envelope_request.toString())
            .then(response => response.json())
            .then(json => {
                return readEnvelope(json);
            });

        let points_request = new URL(`${API_URL}${graphPath}/points`);
        points_request += "?" + stringify({
            max_graph_size: props.maxOrder,
            x_invariant: props.invariantX,
            y_invariant: props.invariantY, //TODO manque la couleur non ?
            constraints: props.others,
        });

        const tempPoints = await fetch_api(points_request.toString())
            .then(response => response.json())
            .then(json => readPoints(json))
            computeScaleDomains(tempPoints, envelope);
        setLines(envelope);

        if(props.hasColor) {
            let groupedByColor = regroupPointsByColor(tempPoints); // COLORS et GROUPEDBYCOLOR
            let clusters = computeAllCluster(groupedByColor.pointsGr, groupedByColor.cols, tempPoints);
            setAllClusters(clusters.allClusters);
            setClusterList(clusters.clusterPossible);
            updateStates(clusters.clusterPossible, 0, clusters.allClusters);
        } else {
            let clusters = {
                clusterPossible: [1],
                allClusters: {1: [tempPoints]}
            }
            setClusterList(clusters.clusterPossible);
            setAllClusters(clusters.allClusters);
            updateStates(clusters.clusterPossible, 0, clusters.allClusters);
        }
    },
        [props.invariantX, props.invariantY, props.others, props.maxOrder, props.endpoint, props.hasColor]);

    // Fait séparément pour ne pas recalculer systématiquement tous les clusters
    useEffect(() => {
            updateStates(clusterList, indexCluster, allClusters);
        },
        [indexCluster, clusterList, allClusters]);

    const updateStates = (currentClusterList, currentIndexCluster, currentAllClusters) => {
        let currentClustersName = currentClusterList[currentIndexCluster];
        let currentGroupedPoints = currentAllClusters[currentClustersName];
        setMaxDomain(Math.max(1, currentClustersName - 1));
        // Màj pour coloration avec choix
        let currentDomainIndep = computeTagsDomainIndep(currentGroupedPoints);
        setDomainsIndep(currentDomainIndep);
        setRange(computeColorsRange(currentDomainIndep, range));
        // Màj pour coloration par gradient
        setTagsGradient(computeTagsDomainGradient(currentGroupedPoints));
    }

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

    // ZOOM
    const [showMiniMap, setShowMiniMap] = useState(true);
    // COLORATIONS
    const handleChangeType = (newType) => {
        setTypeSelected(newType);
        typeCurrent = newType.value;
    }

    const handleClickOnCircle = (x, y) => {
        setSelectedX(x);
        setSelectedY(y);
        setSelected(true);
    }

    // Créer les balises de choix des couleurs pour une coloration avec choix
    const RenderInputColorsForIndep = () => {
        let result = [];
        for (let i in range) {
            let tag = domainsIndep[i];
            result.push(
                <>
                    <input type="color" name={range[i]} id={range[i]} value={range[i]} onChange={e => {
                        let tempRange = range.slice();
                        tempRange[i] = e.target.value;
                        setRange(tempRange);
                    }} />
                    <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ?
                            {fontWeight: 'bold', fontStyle: 'italic', textDecorationLine: 'underline'} :
                            {fontWeight: 'bold'}}
                    >
                        { tag } </Text>
                </>
            )
        }
        result.push(<br/>);
        return result;
    }

    const RenderInputColorsForGradient = () => {
        if (clusterList[indexCluster] === 1) {
            let tag = '';
            if (minColor === maxColor) {
                tag += minColor;
            } else {
                tag = "[" + minColor + " ; " + maxColor + "]";
            }
            return (
                <div>
                    <p> {props.invariantColor} : </p>
                    <input type="color" name="color1" id="color1" value={color1} onChange={e => setColor1(e.target.value)}/>
                    <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ?
                            {color: color1, fontWeight: 'bold', fontStyle: 'italic', textDecorationLine: 'underline'} :
                            {color: color1, fontWeight: 'bold'}}>
                        { tag } </Text>
                </div>
            )
        } else {
            return (
                <div>
                    <p> {props.invariantColor} : </p>
                    <input type="color" name="color1" id="color1" value={color1} onChange={e => setColor1(e.target.value)}/>
                    {tagsGradient.map((tag, i) => <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ?
                            {color: colorsGradient[i], fontWeight: 'bold', fontStyle: 'italic', textDecorationLine: 'underline'} :
                            {color: colorsGradient[i], fontWeight: 'bold'}}
                        key={`gradient_tag${i}`}>
                        { tag } </Text>)}
                    <input type="color" name="color2" id="color2" value={color2} onChange={e => setColor2(e.target.value)}/>
                </div>
            )
        }
    }

    const handleOnPressLegend = (tag) => {
        if (tag[0] === "[") {
            let result = tag.slice(1, tag.length - 1);
            result = result.split(";");
            updateStatesOfLegend(parseFloat(result[0]), parseFloat(result[1]), tag);

        } else {
            updateStatesOfLegend(parseFloat(tag), parseFloat(tag), tag);
        }
    };

    const updateStatesOfLegend = (min, max, tag) => {
        if(min === selectedMin && max === selectedMax) {
            resetStatesofLegend()
        } else {
            setIsLegendClicked(true);
            setSelectedMin(min);
            setSelectedMax(max);
            setSelectedTag(tag);
        }
    }

    const resetStatesofLegend = () => {
        setIsLegendClicked(false);
        setSelectedMin(-Infinity);
        setSelectedMax(+Infinity);
        setSelectedTag("");
    }

    // Sélectionner la couleur pour un point selon le type de coloration actuelle
    const selectColorForOnePoint = (i) => {
        let col = colorScale(i);
        if (typeCurrent === 'indep') {
            col = range[i];
        }
        return col;
    }

    // Construire la liste qui servira à placer les points
    const constructPoints = () => {
        let result = [];
        allClusters[clusterList[indexCluster]].map((group, i) => {
            colorsGradient.push(colorScale(i));
            group.map((currentData, j) => {
                    let x = accessors(currentData, "x");
                    let y = accessors(currentData, "y");
                    let col = accessors(currentData);
                    result.push({
                        key: `(x:${x};y:${y};col:${col}`,
                        x: x,
                        y: y,
                        r: 3,
                        col: col,
                        fill: selectColorForOnePoint(i)
                    })
                })
        });
        return result;
    }

    const RenderData = () => {
        return (
            <Group left={margin.left} top={margin.top}>
                <AxisLeft scale={yScale} left={margin.left} />
                <Axis orientation="bottom" scale={xScale} top={innerHeight} />
                <GridRows left={margin.left} scale={yScale} width={innerWidth} strokeDasharray="1" stroke={'#464646'} strokeOpacity={0.25} pointerEvents="none" />
                <GridColumns bottom={margin.bottom} scale={xScale} height={innerHeight} strokeDasharray="1" stroke={'#464646'} strokeOpacity={0.25} pointerEvents="none" />
                { clusterList.length > 0 ? colorsGradient = [] : null }
                <g>
                    <LinePath
                        stroke="black"
                        strokeWidth={ 1 }
                        data={ lines }
                        x={ (d) => xScale(accessors(d, "x")) }
                        y={ (d) => yScale(accessors(d, "y")) }
                    />
                    { (clusterList.length > 0 && allClusters[indexCluster]) ? constructPoints().map(circle => {
                        const ref = React.createRef();
                        return (
                            <>
                                <circle
                                    ref={ref}
                                    className="circle"
                                    key={circle.key}
                                    onClick={() => handleClickOnCircle(circle.x, circle.y)}
                                    cx={xScale(circle.x)}
                                    cy={yScale(circle.y)}
                                    fillOpacity={0.75}
                                    r={isLegendClicked ?
                                        circle.col >= selectedMin && circle.col <= selectedMax ?
                                            circle.r+5 :
                                            circle.r :
                                        circle.r}
                                    fill={circle.fill}
                                />
                                <Tooltip triggerRef={ref}>
                                    <text x={-125} y={-10} fontSize={15} fill='#000000' >

                                        {props.formData.x_invariant} = {circle.x} | {props.formData.y_invariant} = {circle.y //TODO Ne pas être hardcodé et ajouté les autres données
                                        }
                                    </text>
                                </Tooltip>
                            </>
                        )
                    }) : null }
                </g>
            </Group>
        )
    }

    const handlePrevious = () => {
        resetStatesofLegend();
        setIndexCluster(indexCluster > 0 ? indexCluster - 1 : clusterList.length - 1)
    }

    const handleNext = () => {
        resetStatesofLegend();
        setIndexCluster((indexCluster+1) % clusterList.length);
    }

    return (
        <>
            <h5> Graphique :</h5>
            <div className="main-container" >
                <Zoom width={width} height={height}>
                    {(zoom) => (
                        <div className="relative">
                            <svg
                                width={width}
                                height={height}
                                style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                                ref={zoom.containerRef}
                            >
                                <RectClipPath id="zoom-clip" width={width} height={height} />
                                <rect
                                    width={width}
                                    height={height}
                                    rx="10"
                                    ry="10"
                                    stroke="#000000"
                                    strokeWidth="5"
                                    fill={background}
                                    onTouchStart={zoom.dragStart}
                                    onTouchMove={zoom.dragMove}
                                    onTouchEnd={zoom.dragEnd}
                                    onMouseDown={zoom.dragStart}
                                    onMouseMove={zoom.dragMove}
                                    onMouseUp={zoom.dragEnd}
                                    onMouseLeave={() => {
                                        if (zoom.isDragging) zoom.dragEnd();
                                    }}
                                    onDoubleClick={(event) => {
                                        const point = localPoint(event) || { x: 0, y: 0 };
                                        zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                                    }}
                                />
                                <g transform={zoom.toString()}>
                                    <RenderData />
                                </g>
                                {showMiniMap && (
                                    <g
                                        clipPath="url(#zoom-clip)"
                                        transform={`
                                            scale(0.25)
                                            translate(${width * 4 - width - 60}, ${height * 4 - height - 60})
                                        `}
                                    >
                                        <rect width={width} height={height} fill={background_mini_map} />
                                        <RenderData />
                                        <rect
                                            width={width}
                                            height={height}
                                            fill="white"
                                            fillOpacity={0.75}
                                            stroke="white"
                                            strokeWidth={4}
                                            transform={zoom.toStringInvert()}
                                        />
                                    </g>
                                )}
                            </svg>
                            <div className="controls">
                                <p>
                                    <Text>Options de zoom pour le graphique : </Text>
                                    <button
                                        type="button"
                                        className="btn btn-zoom"
                                        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
                                    >
                                        +
                                    </button>
                                    {" "}
                                    <button
                                        type="button"
                                        className="btn btn-zoom btn-bottom"
                                        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                                    >
                                        -
                                    </button>
                                    {" "}
                                    <button type="button" className="btn btn-lg" onClick={zoom.center}>
                                        Center
                                    </button>
                                    {" "}
                                    <button type="button" className="btn btn-lg" onClick={zoom.reset}>
                                        Reset
                                    </button>
                                    {" "}
                                    <button type="button" className="btn btn-lg" onClick={zoom.clear}>
                                        Clear
                                    </button>
                                    {" "}
                                    <button
                                        type="button"
                                        className="btn btn-lg"
                                        onClick={() => setShowMiniMap(!showMiniMap)}
                                    >
                                        {showMiniMap ? 'Hide' : 'Show'} Mini Map
                                    </button>
                                    <br/>
                                    <Text>Choix du type de coloration : </Text>
                                    <Select className="select" defaultValue={typeSelected} options={optionsTypeColoration} onChange={handleChangeType}/>
                                </p>
                            </div>
                        </div>
                    )}
                </Zoom>
            </div>
            <Text>Légende (coloration avec l'invariant {props.invariantColor}) :</Text>
            {typeCurrent === 'indep' ?
                <RenderInputColorsForIndep /> :
                <RenderInputColorsForGradient />
            }
            <Text>Nombre de clusters pour colorier les graphes {clusterList.map(d => d + " ; ")}</Text>
            <button onClick={() => handlePrevious()}> Précédent </button>
            {" " + clusterList[indexCluster] + " "}
            <button onClick={() => handleNext()}> Suivant </button>
            {selected ?
                <Graphs
                    graphPath={props.graphPath}
                    formData={props.formData}
                    invariantXValue={selectedX}
                    invariantYValue={selectedY}
                />
                : null
            }
        </>
    )
}
