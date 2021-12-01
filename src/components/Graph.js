import {RandomizeNodePositions, RelativeSize, Sigma} from "react-sigma";
import React, {useEffect, useState} from "react";


export default function Graph(props) {
    const [graph, setGraph] = useState({nodes: props.nodes, edges: props.edges});

    useEffect( () => {
        setGraph({nodes: props.nodes, edges: props.edges});
    }, [props.nodes, props.edges]);

    return (
        <div className="graph">
            <Sigma graph={graph} settings={{ drawEdges: true, clone: false }}>
                <RelativeSize initialSize={15} />
                <RandomizeNodePositions />
            </Sigma>
        </div>
    )
}