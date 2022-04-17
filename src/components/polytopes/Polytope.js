import React, {useEffect, useState} from "react";
import {API_URL} from "../../.env";
import {fetch_api} from "../../core/utils";
import {View} from "react-native-web";
import SubTitleText from "../styles_and_settings/SubTitleText";
import "./Polytopes.css"
import PolytopeForm from "./PolytopeForm";
import {LEFT, RIGHT} from "../../designVars";
const API_URL_ENDPOINTS = `${API_URL}/endpoints`;

async function get_endpoints() {
    return await fetch_api(API_URL_ENDPOINTS, {method: "GET"})
        .then(response => response.json())
        .then(data => {
            const endpoints = [];
            for (const endpt in data.endpoints) {
                if (data.endpoints.hasOwnProperty(endpt)) {
                    endpoints.push(data.endpoints[endpt]);
                }
            }
            return endpoints.map(endpt => ({value: endpt, label: endpt.name}));
        })
}

export default function Polytope(props) {
    let first_run = true;

    const [endpoints, setEndpoints] = useState([]); // No endpoints by default, then query from API
    const [endpoint, setEndpoint] = useState(null);

    useEffect(() => {
        if (!first_run) return;
        first_run = false;
        get_endpoints()
            .then((endpoints) => {
                setEndpoints(endpoints);
                setEndpoint(endpoints[0])
            })
    }, [])

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'left',
            flexGrow: 1
        }}>
            <View style={{
                paddingLeft: LEFT,
                paddingRight: RIGHT
            }}>
                <SubTitleText>{"Polytope " + props.num}</SubTitleText>
            </View>
            <View>
                <br/>
                {!!endpoint ?
                    <PolytopeForm
                        invariants={endpoint.value.params.properties.x_invariant.enum}
                        params={endpoint.value.params}
                        endpoint={endpoint}
                        graphPath={endpoint}
                    />: null}
            </View>
        </View>
    )
}