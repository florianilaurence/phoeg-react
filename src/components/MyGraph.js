import React, {useEffect, useState} from "react";
import {computeNodesEdges} from "../core/ParseSignature";
import { DefaultNode, Graph } from '@visx/network';

export default function MyGraph(props) {
    const [graph, setGraph] = useState(computeNodesEdges(props.signature));
    const background = '#949494'

    useEffect( () => {
        setGraph(computeNodesEdges(props.signature))
    }, [props.signature]);

    return (
        <svg width={500} height={500}>
            <rect width={500} height={500} rx={14} fill={background} />
            <Graph
                graph={graph}
                top={20}
                left={100}
                />
        </svg>
    )
}

