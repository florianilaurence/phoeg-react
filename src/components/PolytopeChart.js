import { readEnvelope } from '../core/ParseFiles'
import React from "react";
import { VictoryTheme, VictoryChart, VictoryLine } from 'victory';

export default function PolytopeChart(props) {
    const update = () => {
        let envelope = readEnvelope(props.invariant, props.coloration, props.number);
        return (
            <VictoryChart theme={VictoryTheme.material}>
                <VictoryLine style={{
                    data: {stroke: "#b12520"},
                    parent: {border: "1px solid #ccc"}}}
                             data={envelope}/>
            </VictoryChart>
        )
    }

    return (
        <div>
            <h4>invariant : {props.invariant} number : {props.number} coloration : {props.coloration}</h4>
            {update()}
        </div>
    )
}