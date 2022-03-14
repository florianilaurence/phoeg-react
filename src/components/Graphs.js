import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import GraphSlider from "./GraphSlider";
import {API_URL} from "../.env";
import {fetch_api} from "../core/utils";
import "../styles/Graphs.css";

export default function Graphs(props) {
    const [graphlist, setGraphList] = useState([""]); // La liste des graphes correspondant aux critères
    const [computedList, setComputedList] = useState(false);
    const [numberSlider, setNumberSlider] = useState(1);
    const [maxSlider, setMaxSlider] = useState(1);

    useEffect( () => {

        const graphPath = props.graphPath.value.path;
        let graphs_request = new URL(`${API_URL}${graphPath}`)

        graphs_request.searchParams.append("max_graph_size", props.formData.max_graph_size);

        graphs_request.searchParams.append("invariants[0][name]", props.formData.x_invariant);
        graphs_request.searchParams.append("invariants[1][name]", props.formData.y_invariant);

        // Filter for specific invariant values
        graphs_request.searchParams.append("invariants[0][value]", props.invariantXValue);
        graphs_request.searchParams.append("invariants[1][value]", props.invariantYValue);

        fetch_api(graphs_request.toString(), {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(function (response) {
                return response.json();
            })
            .then(function (myJson) {
                let temp = readGraph(myJson, props.formData.x_invariant, props.invariantXValue, props.formData.y_invariant, props.invariantYValue);
                if (temp !== null) {
                    setGraphList(temp);
                    setMaxSlider(temp.length * 2);
                    setComputedList(true);
                } else {
                    setComputedList(false);
                }
            })
    }, [props.invariantXName, props.invariantXValue, props.formData, props.invariantYValue] );

    const RenderGraphSlider = () => {
        if (computedList) {
            let i = 1;
            let result = [];
            while (i <= numberSlider) {
                result.push(renderOneGraphSlider(i));
                i++;
            }
            return result;
        } else {
            return null;
        }
    }

    const renderOneGraphSlider = (num) => {
        return <GraphSlider key={"slider_" + num} graphList={graphlist}/>
    }

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Vous pouvez afficher jusqu'à {maxSlider} containers en même temps : {" "}
                <button type="button" onClick={() =>
                    numberSlider > 1 ?
                        setNumberSlider(numberSlider - 1) : setNumberSlider(1) }> - </button>
                {" " + numberSlider + " "}
                <button type="button" onClick={() =>
                    setNumberSlider((numberSlider+1)%(maxSlider+1) === 0 ?
                        1 : (numberSlider + 1) % (maxSlider + 1))}> + </button> <br/>
                Il y a <b> {graphlist.length} </b> {graphlist.length === 1 ? "graphe pouvant être affiché" : "graphes différents pouvant être affichés"}
            </p>
            <ul className="graph-slider-list">
                <RenderGraphSlider />
            </ul>
        </div>
    );
}