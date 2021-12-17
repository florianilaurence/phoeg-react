import React, {useMemo} from "react";
import {Axis, GlyphSeries, LineSeries, XYChart} from "@visx/xychart";

export default function PolytopeChart(props) {
    const points = [
        { x: 1, y: 1, r: 5},
        { x: 2, y: 2, r: 10},
        { x: 1, y: 2, r: 2}
    ];

    const lines = [
        { x: 1, y: 1 },
        { x: 1, y: 5 },
        { x: 5, y: 5 },
        { x: 5, y: 1 },
        { x: 1, y: 1 }
    ]

    const xScale = {type: 'linear'}
    const yScale = {type: 'linear'}

    const accessors = (data, param) => {
        if (data !== undefined) {
            switch (param) {
                case 'x':
                    return data.x;
                case 'y':
                    return data.y;
                case 'r':
                    return data.r;
                default:
                    console.log("Houston, on a un problème !")
            }
        }
    }

    return (
        <XYChart
            height={300}
            xScale={xScale}
            yScale={yScale}>
            <Axis orientation="bottom" />
            <Axis orientation="left" />
            <LineSeries
                dataKey="Enveloppe"
                data={lines}
                xAccessor={data => accessors(data, 'x')}
                yAccessor={data => accessors(data, 'y')} />
            <GlyphSeries
                dataKey="Points"
                data={points}
                xAccessor={data => accessors(data, 'x')}
                yAccessor={data => accessors(data, 'y')}
                renderGlyphs={data => accessors(data, 'r')} />
        </XYChart>
    );
}


