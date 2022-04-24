import React, {useCallback, useEffect, useState} from "react";
import GraphSlider from "./GraphSlider";
import {API_URL} from "../../.env";
import "./Graphs.css";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import SubTitleText from "../styles_and_settings/SubTitleText";
import {LEFT, RIGHT, TOP} from "../../designVars";
import {fetch_api} from "../../core/utils";
import {readGraph} from "../../core/ParseFiles";
import {Slider} from "@mui/material";

export default function GraphsFetch(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [data, setData] = useState(null); // La liste des graphs correspondant aux critères
    const [currentNbOfSlider, setCurrentNbOfSlider] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect( () => {
        let graphs_request = new URL(`${API_URL}${props.graphPath}`)

        graphs_request.searchParams.append("order", props.order);
        graphs_request.searchParams.append("invariants[0][name]", props.invariantX);
        graphs_request.searchParams.append("invariants[1][name]", props.invariantY);
        // Filter for specific invariant values
        graphs_request.searchParams.append("invariants[0][value]", props.invariantXValue);
        graphs_request.searchParams.append("invariants[1][value]", props.invariantYValue);

        fetchData(graphs_request);
        forceUpdate();
    }, [props.order, props.invariantX, props.invariantXValue, props.invariantY, props.invariantYValue] );

    const fetchData = (request) => {
        return fetch_api(request.toString(), {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then((response) => {
                return response.json();
            }).then((data) => {
                let temp = readGraph(data, props.invariantX, props.invariantXValue, props.invariantY, props.invariantYValue);
                setData(temp);
                setLoading(false);
            }).catch((error) => {
                setError(true);
                setLoading(false);
            });
    }

    if (loading || data === null) {
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
    if (error) return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
        }}>
            <InnerText>An error occurred while loading your data</InnerText>
        </View>
    );

    const handleChangeNbOfSliders = (event) => {
        setCurrentNbOfSlider(event.target.value);
        forceUpdate();
    }

    return (
        <View style={{
            paddingLeft: LEFT,
            paddingRight: RIGHT,
            paddingTop: TOP
        }}>
            <SubTitleText>Graphs</SubTitleText>
            {data &&
                <View style={{
                    alignItems: 'center',
                }}>
                    <InnerText>You can display up to {data.length} graph{data.length===1 ? "":"s"} in same time: </InnerText>
                    <Slider
                        defaultValue={currentNbOfSlider}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={data.length}
                        sx={{
                            color: 'success.main',
                            '& .MuiSlider-thumb': {
                                borderRadius: '1px',
                            },
                        }}
                        style={{
                            width: '75%',
                        }}
                        onChange={handleChangeNbOfSliders}
                    />
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: TOP,
                    }}>
                        {
                            Array.from(Array(currentNbOfSlider).keys()).map((num) =>{
                                return <GraphSlider key={"slider_" + num} graphList={data} firstGraphToShow={num}/>
                        })}
                    </View>
                </View>
            }
        </View>
    );
}