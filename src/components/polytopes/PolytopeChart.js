import {useCallback, useEffect, useState} from "react";
import {accessors, computeColorsRange, computeTagsDomainGradient, computeTagsDomainIndep}
    from "../../core/utils_PolytopeChart";
import {scaleLinear} from "@visx/scale";
import {View} from "react-native-web";
import {Text} from "react-native";
import {INNER_TEXT_SIZE, BOTTOM, INNER, LEFT, RIGHT, TOP} from "../../designVars";
import {Group} from "@visx/group";
import {AxisBottom, AxisLeft} from "@visx/axis";
import {GridColumns, GridRows} from "@visx/grid";
import {LinePath} from "@visx/shape";
import Tooltip from '@mui/material/Tooltip';
import SubSubTitleText from "../styles_and_settings/SubSubTitleText";
import {Zoom} from "@visx/zoom";
import {ScaleSVG} from '@visx/responsive';
import {RectClipPath} from "@visx/clip-path";
import {localPoint} from "@visx/event";
import InnerText from "../styles_and_settings/InnerText";
import Button from "@mui/material/Button";
import GraphsFetch from "../graphs/GraphsFetch";
import {Box, Grid, MenuItem, Select} from "@mui/material";

export default function PolytopeChart(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    // Données de configuration de l'encadré contenant le graphique
    const background = '#fafafa';
    const background_mini_map = 'rgba(197,197,197,0.9)';
    const width = 800;
    const height = width * 2 / 3;
    const margin = {top: 10, right: 15, bottom: 45, left: 30};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Current number of clusters
    const [currentNbClusters, setCurrentNbClusters] = useState(1);

    // Zoom
    const [showMiniMap, setShowMiniMap] = useState(false)
    ;

    // Options possibles de coloration
    const optionsTypeColoration = [
        {value: 'gradient', label: 'Coloration with automatic gradient'},
        {value: 'indep', label: 'Coloration with selected colors'}
    ];

    // Type de coloration sélectionné
    const [typeSelected, setTypeSelected] = useState(optionsTypeColoration[0].value);

    // Handle change type of coloration
    const handleChangeType = (event) => {
        setTypeSelected(event.target.value);
        forceUpdate();
    }

    // Handle click on a circle
    const handleClickOnCircle = (x, y) => {
        setSelectedX(x);
        setSelectedY(y);
        setSelected(true);
        forceUpdate();
    }

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
    const [tagsGradient, setTagsGradient] = useState([]);
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

    useEffect(() => {
        let currentGroupedPoints = props.allClusters[currentNbClusters];
        setMaxDomain(Math.max(1, currentNbClusters - 1));
        // Màj pour coloration avec choix
        let currentDomainIndep = computeTagsDomainIndep(currentGroupedPoints);
        setDomainsIndep(currentDomainIndep);
        setRange(computeColorsRange(currentDomainIndep, range));
        // Màj pour coloration par gradient
        setTagsGradient(computeTagsDomainGradient(currentGroupedPoints));
        forceUpdate();
    }, [currentNbClusters]);

    // Echelle pour l'axe Ox
    const xScale = scaleLinear({
        range: [margin.left, innerWidth],
        domain: [props.domainsData.x[0], props.domainsData.x[1]],
        round: true,
    });

    // Echelle pour l'axe Oy
    const yScale = scaleLinear({
        range: [innerHeight, margin.top],
        domain: [props.domainsData.y[0], props.domainsData.y[1]],
        round: true,
    });

    // Detecter le premier zoom pour montrer la minimap à ce moment là
    let isFirstZoom = true;

    // Créer les balises de choix des couleurs pour une coloration avec choix
    const RenderInputColorsForIndep = () => {
        let result = [];
        for (let i in range) {
            let tag = domainsIndep[i];
            result.push(
                <View style={{
                    alignItems: "center",
                }}>
                    <input type="color" name={range[i]} id={range[i]} value={range[i]} onChange={e => {
                        let tempRange = range.slice();
                        tempRange[i] = e.target.value;
                        setRange(tempRange);
                    }}/>
                    <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ?
                            {fontsize: INNER_TEXT_SIZE, fontWeight: 'bold', fontStyle: 'italic',
                                textDecorationLine: 'underline'} : {fontsize: INNER_TEXT_SIZE, fontWeight: 'bold'}}>
                        {tag} </Text>
                </View>
            )
        }
        return result;
    }

    const RenderInputColorsForGradient = () => {
        if (currentNbClusters === 1) {
            let tag = '';
            if (props.domainsData.color[0] === props.domainsData.color[1]) {
                tag += props.domainsData.color[0];
            } else {
                tag = "[" + props.domainsData.color[0] + " ; " + props.domainsData.color[1] + "]";
            }
            return (
                <View style={{flex: '1', flexDirection: 'row', alignItems: "center"}}>
                    <input type="color" name="color1" id="color1" value={color1}
                           onChange={e => setColor1(e.target.value)}/>
                    <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ? {fontsize: INNER_TEXT_SIZE, color: color1, fontWeight: 'bold',
                            fontStyle: 'italic', textDecorationLine: 'underline'} : {fontsize: INNER_TEXT_SIZE,
                            color: color1, fontWeight: 'bold'}}>
                        {tag}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    paddingLeft: INNER,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    width: '100%',
                }}>
                    <input type="color" name="color1" id="color1" value={color1}
                           onChange={e => setColor1(e.target.value)}/>
                    {tagsGradient.map((tag, i) => <Text
                        onPress={() => handleOnPressLegend(tag)}
                        style={tag === selectedTag ? {fontsize: INNER_TEXT_SIZE, color: colorsGradient[i],
                                fontWeight: 'bold', fontStyle: 'italic', textDecorationLine: 'underline'} :
                            {fontsize: INNER_TEXT_SIZE, color: colorsGradient[i], fontWeight: 'bold'}}
                        key={`gradient_tag${i}`}>
                        {tag} </Text>)}
                    <input type="color" name="color2" id="color2" value={color2}
                           onChange={e => setColor2(e.target.value)}/>
                </View>
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
        forceUpdate();
    };

    const handleOnChangeNbClusters = (d) => {
        setCurrentNbClusters(d);
        resetStatesofLegend();
        forceUpdate();
    };

    const updateStatesOfLegend = (min, max, tag) => {
        if (min === selectedMin && max === selectedMax) {
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
        if (typeSelected === 'indep') {
            col = range[i];
        }
        return col;
    }

    // Construire la liste qui servira à placer les points
    const constructPoints = () => {
        let result = [];
        props.allClusters[currentNbClusters].forEach((group, i) => {
            colorsGradient.push(colorScale(i));
            group.forEach((currentData, j) => {
                let x = accessors(currentData, "x");
                let y = accessors(currentData, "y");
                let mult = accessors(currentData, "mult");
                let col = accessors(currentData);
                result.push({key: `(x:${x};y:${y};col:${col};index:${j})`, x: x, y: y, r: 3, mult: mult, col: col,
                    fill: selectColorForOnePoint(i)})
            })
        });
        return result;
    }

    const RenderData = () => {
        return (
            <Group left={margin.left} top={margin.top}>
                <AxisLeft scale={yScale} left={margin.left} label={props.invariantY}/>
                <AxisBottom scale={xScale} top={innerHeight} label={props.invariantX}/>
                <GridRows left={margin.left} scale={yScale} width={innerWidth} strokeDasharray="1" stroke={'#464646'}
                          strokeOpacity={0.25} pointerEvents="none"/>
                <GridColumns bottom={margin.bottom} scale={xScale} height={innerHeight} strokeDasharray="1"
                             stroke={'#464646'} strokeOpacity={0.25} pointerEvents="none"/>
                <g>
                    <LinePath stroke="black" strokeWidth={1} data={props.envelope}
                        x={(d) => xScale(accessors(d, "x"))}
                        y={(d) => yScale(accessors(d, "y"))}
                    />
                    {props.allClusters[currentNbClusters] ? constructPoints().map(circle => {
                        return (
                            <Tooltip
                                key={`tooltip-${circle.key}`}
                                title={
                                    props.invariantX.replace('_', ' ') + " = " + circle.x + " | " +
                                    props.invariantY.replace('_', ' ') + " = " + circle.y + " | " +
                                    "mult = " + circle.mult
                            }>
                                <circle
                                    className="circle"
                                    key={circle.key}
                                    onClick={() => handleClickOnCircle(circle.x, circle.y)}
                                    cx={xScale(circle.x)}
                                    cy={yScale(circle.y)}
                                    fillOpacity={0.75}
                                    r={isLegendClicked ?
                                        circle.col >= selectedMin && circle.col <= selectedMax ?
                                            circle.r + 5 :
                                            circle.r :
                                        circle.r}
                                    fill={circle.fill}
                                />
                            </Tooltip>
                        )
                    }) : null}
                </g>
            </Group>
        )
    }

    return (
        <View style={{marginBottom: INNER}}>
            <View style={{
                marginTop: TOP,
                marginLeft: LEFT,
                marginRight: RIGHT,
            }}>
                <SubSubTitleText>Chart:</SubSubTitleText>
                <Zoom width={width} height={height}>
                    {(zoom) => (
                        <View style={{flexDirection: 'row', flex: 1}}>
                            <View style={{
                                width: '90%',
                            }}>
                                <ScaleSVG
                                    width={width} height={height}
                                    style={{cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none'}}
                                    ref={zoom.containerRef}
                                >
                                    <RectClipPath id="zoom-clip" width={width} height={height}/>
                                    <rect width={width} height={height} rx="10" ry="10" stroke="#000000"
                                          strokeWidth="5" fill={background} onTouchStart={zoom.dragStart}
                                          onTouchMove={zoom.dragMove} onTouchEnd={zoom.dragEnd}
                                          onMouseDown={zoom.dragStart} onMouseMove={zoom.dragMove}
                                          onMouseUp={zoom.dragEnd} onMouseLeave={() => {
                                        if (zoom.isDragging) zoom.dragEnd();
                                    }}
                                          onDoubleClick={(event) => {
                                              const point = localPoint(event) || {x: 0, y: 0};
                                              zoom.scale({scaleX: 1.1, scaleY: 1.1, point});
                                          }}
                                    />
                                    <g transform={zoom.toString()}>
                                        <RenderData/>
                                    </g>
                                    {showMiniMap && (
                                        <g
                                            clipPath="url(#zoom-clip)"
                                            transform={`
                                                scale(0.25)
                                                translate(${width * 4 - width - 60}, ${height * 4 - height - 60})
                                            `}
                                        >
                                            <rect width={width} height={height} fill={background_mini_map}/>
                                            <RenderData/>
                                            <rect width={width} height={height} fill="white" fillOpacity={0.75}
                                                stroke="white" strokeWidth={4} transform={zoom.toStringInvert()}/>
                                        </g>
                                    )}
                                </ScaleSVG>
                            </View>
                            <View style={{
                                width: '10%',
                                paddingLeft: INNER,
                            }}>
                                <InnerText>Zoom:</InnerText>
                                <Box m={1}>
                                    <Button variant="contained" color="success" sx={{width: 1}}
                                            onClick={() => {
                                                if (isFirstZoom) {
                                                    setShowMiniMap(true);
                                                    isFirstZoom = false;
                                                }
                                                zoom.scale({scaleX: 1.2, scaleY: 1.2})
                                            }}> + </Button>
                                </Box>
                                <Box m={1}>
                                    <Button variant="contained" color="success" sx={{width: 1}}
                                            onClick={() => zoom.scale({scaleX: 0.8, scaleY: 0.8})}> - </Button>
                                </Box>
                                <Box m={1}>
                                    <Button variant="contained" color="success"  sx={{width: 1}}
                                            onClick={zoom.center}> Center </Button>
                                </Box>
                                <Box m={1}>
                                    <Button variant="contained" color="success" className="btn btn-lg" sx={{width: 1}}
                                            onClick={zoom.reset}> Reset </Button>
                                </Box>
                                <Box m={1}>
                                    <Button variant="contained" color="success" sx={{width: 1}}
                                            onClick={() => setShowMiniMap(!showMiniMap)}>
                                        {showMiniMap ? 'Hide' : 'Show'} Mini Map
                                    </Button>
                                </Box>
                            </View>
                        </View>
                    )}
                </Zoom>
            </View>
            <View>
                {props.invariantColor !== "num_vertices" ?
                    <>
                        <View style={{marginTop: TOP, marginLeft: LEFT, marginRight: RIGHT, paddingBottom: BOTTOM,
                            maxWidth: '100%',}}>
                            <Grid container>
                                <Grid item xs={3}>
                                    <InnerText>Choose type of coloration: </InnerText>
                                </Grid>
                                <Grid item xs={9}>
                                    <Select value={typeSelected} onChange={handleChangeType} sx={{maxHeight: '35px'}}>
                                        <MenuItem value={optionsTypeColoration[0].value}>
                                            {optionsTypeColoration[0].label} </MenuItem>
                                        <MenuItem value={optionsTypeColoration[1].value}>
                                            {optionsTypeColoration[1].label} </MenuItem>
                                    </Select>
                                </Grid>
                            </Grid>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                maxWidth: '100%',
                                marginTop: INNER,
                            }}>
                                <InnerText>Legend (coloration with {props.invariantColor}): </InnerText>
                                {typeSelected === 'indep' ? <RenderInputColorsForIndep/> :
                                    <RenderInputColorsForGradient/>}
                            </View>
                        </View>
                        <View style={{flex: 1, marginLeft: LEFT, marginRight: RIGHT, marginTop: INNER, maxWidth: '100%'}}>
                            <InnerText>Number of clusters to colour the graphs: </InnerText>
                            <br/>
                            <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'}}>
                                {props.clustersList.map((d) => {
                                    if (d === currentNbClusters) {
                                        return (
                                            <Button key={`btn-${d}`} variant="contained" color="success"
                                                    onClick={() => handleOnChangeNbClusters(d)} sx={{width: 20}}>
                                                {d}
                                            </Button>
                                        );
                                    } else {
                                        return (
                                            <Button key={`btn-${d}`} variant="outlined" color="success"
                                                    onClick={() => handleOnChangeNbClusters(d)} sx={{width: 20}}>
                                                {d}
                                            </Button>
                                        );
                                    }
                                })}
                            </View>
                        </View>
                    </> : null
                }
                {selected ?
                    <>
                        <View style={{marginTop: INNER, marginBottom: INNER, paddingLeft: LEFT, paddingRight: RIGHT}}>
                            <InnerText italic>You have selected the next point:</InnerText>
                            <View style={{flexDirection: 'row', textAlign: 'center'}}>
                                <InnerText>x: </InnerText>
                                <InnerText bold>{props.invariantX}= </InnerText>
                                <InnerText bold italic>{selectedX}</InnerText>
                                <InnerText>, y: </InnerText>
                                <InnerText bold>{props.invariantY}= </InnerText>
                                <InnerText bold italic>{selectedY}</InnerText>
                            </View>
                        </View>
                        <GraphsFetch
                            order={props.order}
                            invariantX={props.invariantX}
                            invariantY={props.invariantY}
                            invariantXValue={selectedX}
                            invariantYValue={selectedY}
                            constraints={props.constraints}
                            advancedConstraints={props.advancedConstraints}
                        />
                    </> : null
                }
            </View>
        </View>
    )


}