import Select from 'react-select';
import React, {useEffect, useState} from "react";
import { MuiForm5 as Form } from '@rjsf/material-ui';
import PolytopeChart from "./PolytopeChart";
import {API_URL} from "../../.env";
import {fetch_api} from "../../core/utils";
import {View} from "react-native-web";
import SubTitleText from "../styles_and_settings/SubTitleText";
import InnerText from "../styles_and_settings/InnerText";
import "./Polytopes.css"
import {PADDING_LEFT, PADDING_RIGHT} from "../../designVars";

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

// Component's core
export default function Polytope(props) {
    let first_run = true;

    const [endpoints, setEndpoints] = useState([]); // No endpoints by default, then query from API
    const [endpoint, setEndpoint] = useState(null);

    const [formResults, setFormResults] = useState(null);
    const [submit, setSubmit] = useState(false);

    useEffect(() => {
        if (!first_run) return;
        first_run = false;
        get_endpoints()
            .then((endpoints) => {
                setEndpoints(endpoints);
                setEndpoint(endpoints[0])
            })
    }, [])


    const RenderPolytopeChart = () => {
        if (submit && formResults) {
            const max_graph_size = formResults.max_graph_size;
            return <PolytopeChart graphPath={endpoint} max_graph_size={max_graph_size} invariants={formResults.invariants} formData={formResults}/>;
        } else {
            return null;
        }
    }

    function onFormSubmit(event) {
        event.formData.add_colouring["Add colouring?"] = event.formData.add_colouring["Add colouring?"] === "Yes" ? true : false;
        setFormResults(event.formData);
        setSubmit(true);
    }

    const uiSchema = {
        "max_graph_size": {
            "ui:widget": "range"
        },
    }

    return (
        <View style={{flexDirection: 'column', alignItems: 'left', flexGrow: 1}}>
            <View>
                <SubTitleText>Polytope {props.num}</SubTitleText>
            </View>
            <View style={{paddingLeft: PADDING_LEFT, paddingRight: PADDING_RIGHT}}>
                {!!endpoint &&
                    <Form
                        formData={formResults}
                        schema={endpoint.value.params}
                        uiSchema={uiSchema}
                        onSubmit={onFormSubmit}
                        onError={console.error}/>
                }
            </View>
            <RenderPolytopeChart/>
        </View>

    )
}