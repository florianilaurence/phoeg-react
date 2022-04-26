import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../.env";
import {View} from "react-native-web";
import SubTitleText from "../styles_and_settings/SubTitleText";
import "./Polytopes.css"
import PolytopeForm from "./PolytopeForm";
import axios from "axios";
import InnerText from "../styles_and_settings/InnerText";

export default function Polytope(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        let requestNum = new URL(`${API_URL}/invariants?type=numbers`);
        let requestBool = new URL(`${API_URL}/invariants?type=booleans`);

        fetchData(requestNum, requestBool).then(d => {
            setData(d);
            setLoading(false);
        });
        forceUpdate();
    }, [])

    const fetchData = (requestNum, requestBool) => {
        return axios.all([
            axios.get(requestNum),
            axios.get(requestBool)
        ]).then(axios.spread((num, bool) => {
            setLoading(false);
            let types = [];
            bool.data.forEach(() => {
                types.push("bool")
            });

            num.data.forEach(() => {
                types.push("num")
            });

            return {
                invariantsNum: num.data,
                invariantsName: bool.data.concat(num.data),
                invariantsTypes: types
            }
        })).catch(error => {
            setError(error);
            setLoading(false);
        });
    }

    if (error) return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '200px'
        }}>
            <InnerText>An error occurred while loading invariants list</InnerText>
        </View>
    );

    if (loading || data === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>Please wait, we are contacting the server</InnerText>
            </View>
        );
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyItems: 'center',
            flexGrow: 1,
            width: '100%'
        }}>
            <SubTitleText>{"Polytope " + props.num}</SubTitleText>
            <PolytopeForm
                invariantsNum={data.invariantsNum}
                invariantsName={data.invariantsName}
                invariantsTypes={data.invariantsTypes}
            />
        </View>
    )
}