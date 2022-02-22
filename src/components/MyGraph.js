import React, {useEffect, useState} from "react";
import {computeNodesEdges} from "../core/ParseSignature";
import { Graph, DefaultLink, DefaultNode } from '@visx/network';

export default function MyGraph(props) {
    let nodes = [];
    let links = [];
    const [graph, setGraph] = useState({
        nodes,
        links: links
    });
    const side = 500;
    const margin = 25;
    const background = '#fafafa'

    useEffect( () => {
        let nodesEdges = computeNodesEdges(props.signature);
        nodes = computeCirclePositionOfNodes(nodesEdges.number_nodes);
        links = connectLinksToNodes(nodesEdges.links);
        setGraph({
            nodes,
            links: links
        })
    }, [props.signature]);

    const computeCirclePositionOfNodes = (n) => {
        const range = 2*Math.PI/n;
        let result = [];
        if(n === 1) {
            result.push({
                x: (side/2),
                y: (side/2)
            });
        } else {
            let i = 0;
            while (i < n) {
                let x = (Math.cos(i*range)+1)*((side/2)); // +1 pour décaler le cercle en positif
                let y = (Math.sin(i*range)+1)*((side/2)); // *(side/2) pour mettre à l'échelle dans le rectangle
                result.push({
                    x: x,
                    y: y
                });
                i++;
            }
        }
        return result;
    }
    
    const connectLinksToNodes = (links) => {
        let result = [];
        for (let link of links) { // link = { source: <indice noeud source>, target: <indice noeud cible> }
            result.push({
                source: nodes[link.source],
                target: nodes[link.target]
            });
        }
        return result;
    }

    return (
        <svg width={side+2*margin} height={side+2*margin}>
            <rect width={side+2*margin} height={side+2*margin} fill={background} rx="15" ry="15" />
            <Graph
                left={margin}
                top={margin}
                right={margin}
                bottom={margin}
                graph={graph}
                linkComponent={DefaultLink}
                nodeComponent={() => <DefaultNode fill='#000000' />} />
        </svg>
    )
}

