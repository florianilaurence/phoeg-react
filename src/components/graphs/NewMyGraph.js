import React, {useEffect, useState} from "react";
import {Drag, raise} from "@visx/drag";
import {DefaultNode, Graph} from "@visx/network";

export default function NewMyGraph(props) {
    let side = 400;
    let margin = 20;
    const [nodes, setNodes] = useState([
        {x: 20, y: 20, r: 15},
        {x: 20, y: 380, r: 15},
        {x: 380, y: 20, r: 15},
        {x: 380, y: 380, r: 15}
    ]);

    let links = [
        {x1: 20, y1: 20, x2: 20, y2: 380},
        {x1: 380, y1: 20, x2: 20, y2: 380},
    ];

    const [graph, setGraph] = useState({
        nodes,
        links: links
    });

    return (
        <div className="Drag-network" style={{ touchAction: 'none' }}>
            <svg width={side} height={side}>
                <rect fill="#ffffff" width={side-margin} height={side-margin} rx={14} />
                {nodes.map((node, i) => (
                    <Drag key={`drag-${i}`} width={side-margin} height={side-margin} x={node.x}  y={node.y} onDragStart={() =>
                    {setNodes(raise(nodes, i))}} >
                        {({ dragStart, dragEnd, dragMove, isDragging, x, y, dx, dy }) => (
                            <circle
                                key={`circle-${i}`}
                                cx={x}
                                cy={y}
                                r={isDragging ? node.r + 5: node.r}
                                fill='#000000'
                                transform={`translate(${dx}, ${dy})`}
                                onMouseMove={dragMove}
                                onMouseUp={dragEnd}
                                onMouseDown={dragStart}
                                onTouchStart={dragStart}
                                onTouchMove={dragMove}
                                onTouchEnd={dragEnd}
                            />
                        )}
                    </Drag>
                ))}
                <Graph
                    key={`graph_${props.signature}`}
                    left={margin}
                    top={margin}
                    right={margin}
                    bottom={margin}
                    graph={graph}
                    linkComponent={({ link: { source, target } }) => (
                        <line
                            x1={source.x}
                            y1={source.y}
                            x2={target.x}
                            y2={target.y}
                            strokeWidth={3}
                            stroke="#000000"
                            strokeOpacity={0.5}
                        />
                    )}
                    nodeComponent={() => <DefaultNode fill='#000000' />} />
            </svg>
        </div>
    )

}