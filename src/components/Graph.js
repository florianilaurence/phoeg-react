import {RandomizeNodePositions, RelativeSize, Sigma} from "react-sigma";
import React, {useEffect, useState} from "react";
import {computeNodesEdges} from "../core/ParseSignature";


export default function Graph(props) {
    const [graph, setGraph] = useState({nodes: [], edges: []});


    useEffect( () => {
        setGraph(computeNodesEdges(props.signature))
    }, [props.signature]);

    return (
        <div className="graph">
            <h4> Graphe dont la signature est : {props.signature} </h4>
            <Sigma graph={graph} settings={{ drawEdges: true, clone: false }}>
                <RelativeSize initialSize={15} />
                <RandomizeNodePositions />
            </Sigma>
        </div>
    )
}