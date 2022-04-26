import axios from 'axios';
import {useCallback, useEffect, useState} from "react";
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
            colour: props.invariantColor,
            constraints: props.constraints,
        });
        fetchData(envelope_request, points_request).then(
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

    const fetchData = (requestEnvelope, requestPoints) => {
        return axios.all([
            axios.get(requestEnvelope),
            axios.get(requestPoints)
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
                points: readPoints(points.data)
            }
        }));
    };

    if (loading || data === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>Please wait, your data are loading</InnerText>
            </View>
        );
    }
    if (error) return <div>Error: {error}</div>;

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
                    envelope={data.envelope}
                    points={data.points}
                />
            }
        </>
    );
}
