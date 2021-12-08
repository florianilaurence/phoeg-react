import {RandomizeNodePositions, RelativeSize, Sigma} from "react-sigma";
import React, {useEffect, useState} from "react";
import {computeNodesEdges} from "../core/ParseSignature";

export default function Graph(props) {
    const [graph, setGraph] = useState(computeNodesEdges(props.signature));

    useEffect( () => {
        setGraph(computeNodesEdges(props.signature))
    }, [props.signature]);

    return (
        <Sigma graph={graph}
               settings={{drawEdges:true}}>
            <RelativeSize initialSize={15}/>
            <RandomizeNodePositions/>
        </Sigma>
    )
}

