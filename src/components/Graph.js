import {DragNodes, NodeShapes, RandomizeNodePositions, RelativeSize, Sigma} from "react-sigma";
import React, {useEffect, useState} from "react";
import {computeNodesEdges} from "../core/ParseSignature";

export default function Graph(props) {
    const [graph, setGraph] = useState(computeNodesEdges(props.signature));

    useEffect( () => {
        setGraph(computeNodesEdges(props.signature))
    }, [props.signature]);

    return (
        <Sigma renderer="webgl"
               graph={graph}
               settings={{drawEdges:true}}
               onOverNode={e => console.log("Mouse over node " + e.data.label)}
        >
            <DragNodes />
            <NodeShapes default="pacman"/>
            <RandomizeNodePositions/>
        </Sigma>
    )
}

