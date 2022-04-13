import CytoscapeComponent from 'react-cytoscapejs';
import {PADDING_BOTTOM, PADDING_LEFT, PADDING_RIGHT, PADDING_TOP} from "../../designVars";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {computeNodesEdges} from "../../core/ParseSignature";
import CoseBilkent from 'cytoscape-cose-bilkent';
import fcose from 'cytoscape-fcose';
import cola from 'cytoscape-cola';
import dagre from 'cytoscape-dagre';
import Cytoscape from "cytoscape";
import {Text, View} from "react-native-web";
import {Autocomplete, Switch, TextField} from "@mui/material";

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

const options = Object.keys(layouts).map(layout => ({label: layout, value: layout}));

export default function NewGraph() {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [edgesComplement, setEdgesComplement] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const elements = [...nodes, ...edges];
    const elementsComplement = [...nodes, ...edgesComplement];
    const [layout, setLayout] = useState(layouts.Random);
    const [isComplement, setIsComplement] = useState(false);
    const cyRef = useRef();
    const sign = "GPV@}{";
    const side = 400;
    const margin = 20;

    useEffect(() => {
        let nodesEdges = computeNodesEdges(sign);
        setNodes(nodesEdges.nodes);
        setEdges(nodesEdges.edges);
        setEdgesComplement(nodesEdges.edgesComplement);
        forceUpdate();
    }, []);

    const handleChangeChecked = (event) => {
        setIsComplement(event.target.checked);
        forceUpdate();
    };

    const handleChangeLayout = (event) => {
        setLayout(layouts[event.target.innerText]);
        forceUpdate();
    };
    // TODO Remonter d'un niveau la checkbox qui permet d'afficher ou non le complément du graphe
    const renderCytoscape = (elmts, color) => {
        return (<CytoscapeComponent elements={elmts}
                            minZoom={0.5}
                            maxZoom={2}
                            pan={{x: 200, y: 200}}
                            stylesheet={[
                                {selector: 'node', style: {width: 35, height: 35, 'background-color': color, 'border-color': '#000', 'border-width': 2}},
                                {selector: 'edge', style: {width: 5, 'line-color' : '#000'}}]}
                            style={{
                                marginTop: PADDING_TOP, marginBottom: PADDING_BOTTOM,
                                marginLeft: PADDING_LEFT, marginRight: PADDING_RIGHT,
                                width: side, height: side, border: "1px solid black"
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
            <Text style={{
                fontSize: '25px'
            }}><Switch checked={isComplement} onChange={handleChangeChecked}/> View complement of graph</Text>
            <Autocomplete
                clearIcon={null}
                disablePortal
                id="combo-box"
                options={options}
                onChange={handleChangeLayout}
                sx={{ width: '90%' }}
                renderInput={(params) =>
                    <TextField {...params} label="Layout" />}
            />
            {isComplement ? renderCytoscape(elementsComplement, '#00ff00') : renderCytoscape(elements, '#444444')}
        </View>
    )

}