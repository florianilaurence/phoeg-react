import CytoscapeComponent from 'react-cytoscapejs';
import {BOTTOM, LEFT, RIGHT, TOP} from "../../designVars";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {computeNodesEdges} from "../../core/ParseSignature";
import CoseBilkent from 'cytoscape-cose-bilkent';
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import Cytoscape from "cytoscape";
import {Text, View} from "react-native-web";
import {Autocomplete, Box, Switch, TextField} from "@mui/material";
import InnerText from "../styles_and_settings/InnerText";

Cytoscape.use( CoseBilkent );
Cytoscape.use( fcose);
Cytoscape.use( cola );
Cytoscape.use( dagre );

const layouts = {
    Random: {
        name: "random",
        animate: true
    },
    Circle: {
        name: "circle",
        animate: true
    },
    Cose: {
        name: "cose",
        animate: true
    },
    Grid: {
        name: "grid",
        animate: true
    },
    Breadthfirst: {
        name: "breadthfirst",
        animate: true
    },
    Fcose: {
        name: "fcose",
        animate: true
    },
    Cola: {
        name: "cola",
        animate: true,
        maxSimulationTime: 40000
    },
    Dagre: {
        name: "dagre",
        animate: true
    }
}

const options = Object.keys(layouts);

export default function NewGraph(props) {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [edgesComplement, setEdgesComplement] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const elements = [...nodes, ...edges];
    const elementsComplement = [...nodes, ...edgesComplement];
    const [layout, setLayout] = useState(layouts.Circle);
    const [inputLayout, setInputLayout] = useState("");
    const [isComplement, setIsComplement] = useState(false);
    const cyRef = useRef();
    const side = 380;
    const margin = 5;

    useEffect(() => {
        let nodesEdges = computeNodesEdges(props.signature);
        setNodes(nodesEdges.nodes);
        setEdges(nodesEdges.edges);
        setEdgesComplement(nodesEdges.edgesComplement);
        forceUpdate();
    }, [props.signature]);

    const handleChangeChecked = (event) => {
        setIsComplement(event.target.checked);
        forceUpdate();
    };

    const renderCytoscape = (elmts, color) => {
        return (<CytoscapeComponent elements={elmts}
                            minZoom={0.5}
                            maxZoom={2}
                            pan={{x: side/2, y: side/2}}
                            stylesheet={[
                                {selector: 'node', style: {width: 35, height: 35, 'background-color': '#000', 'border-color': '#000', 'border-width': 2}},
                                {selector: 'edge', style: {width: 5, 'line-color' : color}}]}
                            style={{
                                marginTop: TOP,
                                marginBottom: BOTTOM,
                                marginLeft: LEFT,
                                marginRight: RIGHT,
                                width: side,
                                height: side,
                                border: "1px solid black"
        }}
                            cy={(cy) => {
                                cyRef.current = cy;
                                cy.layout(layout).run();
                                cy.fit();
                            }}
        />);
    }

    return (
        <View style={{
            width: side+2*margin,
            alignItems: 'center',
        }}>
            <InnerText>
                View complement of graph? <Switch checked={isComplement} onChange={handleChangeChecked} color="success"/> <br/>
                Choose a layout for nodes placement:
            </InnerText>
            <Box m={2}
                 sx={{ width: 0.75 }}>
                <Autocomplete
                    value={layout.name}
                    onChange={(event, value) => setLayout(layouts[value])}
                    inputValue={inputLayout}
                    onInputChange={(event, value) => setInputLayout(value)}
                    id="graph-layout-select"
                    options={options}
                    clearIcon={null}
                    renderInput={(params) =>
                        <TextField {...params} label="Layout" />}
                />
            </Box>
            {isComplement ?
                <>
                    <Text style={{color: '#00ff00', fontWeight: 'bold'}}>Graph complement </Text>
                    {renderCytoscape(elementsComplement, '#00ff00')}
                </> : <>
                    <Text style={{color: '#444444', fontWeight: 'bold'}}>Graph</Text>
                    {renderCytoscape(elements, '#444444')}
                </>
            }
        </View>
    )

}