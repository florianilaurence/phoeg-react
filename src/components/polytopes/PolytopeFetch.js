import axios from 'axios';
import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../.env";
import {stringify} from "qs";
import {readEnvelope, readPoints} from "../../core/ParseFiles";
import PolytopeCalc from "./PolytopeCalc";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";

export default function PolytopeFetch(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let envelope_request = new URL(`${API_URL}/graphs/polytope`);
        envelope_request += "?" + stringify({
            order: props.order,
            x_invariant: props.invariantX,
            y_invariant: props.invariantY,
            constraints: props.constraints,
        })
        let points_request = new URL(`${API_URL}/graphs/points`);
        points_request += "?" + stringify({
                    order: props.order,
                    x_invariant: props.invariantX,
                    y_invariant: props.invariantY,
                    colour: props.invariantColor === "num_vertices" || props.invariantColor === "mult" ? null : props.invariantColor,
                    constraints: props.constraints
        });
        const advancedConstraits = {
            query: props.advancedConstraints,
        }

        fetchData(envelope_request, points_request, advancedConstraits).then(
            (d) => {
                setData(d);
                setLoading(false);
            }
        ).catch(
            (error) => {
                setError(error);
                setLoading(false);
            }
        );
        forceUpdate();
    }, []);

    const fetchData = (requestEnvelope, requestPoints, body) => {
        return axios.all([
            axios.post(requestEnvelope, body),
            axios.post(requestPoints, body)
        ]).then(axios.spread((envelope, points) => {
            if (points.data[props.invariantX] === null || points.data[props.invariantY] === null || points.data[props.invariantColor] === null
                || envelope.data[props.invariantX] === null || envelope.data[props.invariantY] === null || points.data === {} || envelope.data === {}) {
                return {
                    envelope: null,
                    points: null,
                };
            }
            return {
                envelope: readEnvelope(envelope.data),
                points: readPoints(points.data, props.invariantColor),
            }
        }));
    };

    if (error) return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
        }}>
            <InnerText>An error occurred while loading your data for polytope</InnerText>
        </View>
    );
    if (loading || data === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>Please wait, your data is being loaded</InnerText>
            </View>
        );
    }

    if (data.points === null || data.envelope === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>No data found, please check if selected constraints are too tight</InnerText>
            </View>
        );    }

    return (
        <>
            {data.points && data.envelope &&
                <PolytopeCalc
                    order={props.order}
                    invariantX={props.invariantX}
                    invariantY={props.invariantY}
                    invariantColor={props.invariantColor}
                    constraints={props.constraints}
                    advancedConstraints={props.advancedConstraints}
                    envelope={data.envelope}
                    points={data.points}
                />
            }
        </>
    );
}
