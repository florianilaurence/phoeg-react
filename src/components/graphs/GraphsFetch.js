import React, {useCallback, useEffect, useState} from "react";
import { readGraph } from "../../core/ParseFiles";
import GraphSlider from "./GraphSlider";
import {API_URL} from "../../.env";
import "./Graphs.css";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import axios from "axios";
import SubTitleText from "../styles_and_settings/SubTitleText";
import Button from "@mui/material/Button";
import {PADDING_LEFT, PADDING_RIGHT} from "../../designVars";

export default function GraphsFetch(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [graphList, setGraphList] = useState(null); // La liste des graphs correspondant aux critères
    const [currentNbOfSlider, setCurrentNbOfSlider] = useState(1);
    const [maxSlider, setMaxSlider] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect( () => {
        let graphs_request = new URL(`${API_URL}${props.graphPath}`)

        graphs_request.searchParams.append("max_graph_size", props.order);
        graphs_request.searchParams.append("invariants[0][name]", props.invariantX);
        graphs_request.searchParams.append("invariants[1][name]", props.invariantY);
        // Filter for specific invariant values
        graphs_request.searchParams.append("invariants[0][value]", props.invariantXValue);
        graphs_request.searchParams.append("invariants[1][value]", props.invariantYValue);
        console.log(graphs_request);
        const temp = fetchData(graphs_request);
        console.log(temp);
        setGraphList(temp);
        setMaxSlider(temp.length * 2);
        forceUpdate();
    }, [] );

    const fetchData = (request) => {
        return axios.get(request)
            .then(response => {
                return readGraph(response.data);
            }).catch(error => {
                setError(error);
            }).finally(() => {
                setLoading(false);
            });
    }

    if (loading || graphList === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>Please wait, your data are loading for graphs</InnerText>
            </View>
        );
    }
    if (error) return <div>Error: {error}</div>;

    const RenderGraphSlider = () => {
        let i = 1;
        let result = [];
        while (i <= currentNbOfSlider) {
            result.push(renderOneGraphSlider(i));
            i++;
        }
        return result;
    }

    const renderOneGraphSlider = (num) => {
        return <GraphSlider key={"slider_" + num} graphList={graphList} firstGraphToChow={currentNbOfSlider-1}/>
    }

    return (
        <View style={{
            paddingLeft: PADDING_LEFT,
            paddingRight: PADDING_RIGHT,
        }}>
            <SubTitleText>Graphs</SubTitleText>
            <InnerText>You can display up to {maxSlider} containers in same time: </InnerText>
            <View style={{
                flex: 1,
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Button variant="contained" color="success" onClick={() => setCurrentNbOfSlider(currentNbOfSlider > 1 ? currentNbOfSlider - 1 : 1)}> - </Button>
                <InnerText>{currentNbOfSlider}</InnerText>
                <Button variant="contained" color="success" onClick={() => setCurrentNbOfSlider((currentNbOfSlider+1)%(maxSlider+1) === 0 ?
                    1 : (currentNbOfSlider + 1) % (maxSlider + 1))}> + </Button>
            </View>
            <InnerText>There are {graphList.length} graphe{graphList.length === 1? "":"s différents"} to show.</InnerText>
            <RenderGraphSlider />
        </View>
    );
}