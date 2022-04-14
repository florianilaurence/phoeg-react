import {Text, View} from "react-native-web";
import {
    PADDING_BOTTOM, PADDING_LEFT, PADDING_RIGHT,
    PADDING_TOP
} from "../../designVars";
import {Autocomplete, Slider, Switch, TextField} from "@mui/material";
import InnerText from "../styles_and_settings/InnerText";
import React, {useCallback, useEffect, useState} from "react";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SendIcon from '@mui/icons-material/Send';
import PolytopeChart from "../polytopes/PolytopeChart";

export default function PolytopeForm(props) {
    const [invariants, setInvariants] = useState([]);
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [checked, setChecked] = useState(false);
    const [formData, setFormData] = useState({
        order: props.params.properties.max_graph_size.default,
        invariantX: null,
        invariantY: null,
        invariantColor: "num_vertices", // Default coloration, all points are the same color because number of vertices is selected
        others: null,
    })
    const [otherInvariants, setOtherInvariants] = useState([]);
    const [submitted, setSubmitted] = useState(false);

    const handleChangeChecked = (event) => {
        if (!event.target.checked) {
            setFormData({
                order: formData.order,
                invariantX: formData.invariantX,
                invariantY: formData.invariantY,
                invariantColor: "num_vertices",
                others: formData.others
            });
        }
        setChecked(event.target.checked);
        setSubmitted(false);
        forceUpdate();
    };

    const handleChangeOrder = (event) => {
        setFormData({
            order: event.target.value,
            invariantX: formData.invariantX,
            invariantY: formData.invariantY,
            invariantColor: formData.invariantColor,
            others: formData.others,
        });
        setSubmitted(false);
        forceUpdate();
    }

    const handleChangeX = (event) => {
        setFormData({
            invariantX: event.target.innerText,
            invariantY: formData.invariantY,
            invariantColor: formData.invariantColor,
            others: formData.others
        });
        setSubmitted(false);
        forceUpdate();
    };

    const handleChangeY = (event) => {
        setFormData({
            invariantX: formData.invariantX,
            invariantY: event.target.innerText,
            invariantColor: formData.invariantColor,
            others: formData.others
        });
        setSubmitted(false);
        forceUpdate();
    };

    const handleChangeColor = (event) => {
        setFormData({
            invariantX: formData.invariantX,
            invariantY: formData.invariantY,
            invariantColor: event.target.innerText,
            others: formData.others
        });
        setSubmitted(false);
        forceUpdate();
    }

    const handleAddClick = () => {
        if (checked) {
            let num = otherInvariants.length + 1;
            let list = otherInvariants;
            list.push("Invariant_" + num);
            setOtherInvariants(list);
            setSubmitted(false);
            forceUpdate();
        } else {
            alert("Please add a color before add another invariant");
        }
    };

    const handleChangeOther = (event, keyName) => {
        let newOthers = formData.others;
        if (newOthers === null) {
            newOthers = {}; // Dictionnaire pour éviter qu'un questionnaire puisse ajouter plusieurs fois des invariants
        }
        newOthers[keyName] = event.target.innerText;
        setFormData({
            invariantX: formData.invariantX,
            invariantY: formData.invariantY,
            invariantColor: formData.invariantColor,
            others: newOthers
        });
        setSubmitted(false);
        forceUpdate();
    };

    const handleSubmit = (event) => {
        if (formData.invariantX === null || formData.invariantX === undefined
                || formData.invariantY === null || formData.invariantY === undefined
                || (checked && (formData.invariantColor === null || formData.invariantColor === undefined))) {
            alert("Please fill in all fields");
            return;
        }
        setSubmitted(true);
    };

    const RenderPolytopeChart = () => {
        if (submitted) {
            const invariantX = formData.invariantX.replace(' ', '_');
            const invariantY = formData.invariantY.replace(' ', '_');
            let invariantColor = formData.invariantColor;
            if (checked) {
                invariantColor = formData.invariantColor.replace(' ', '_');
            }
            let others = formData.others;
            if (others !== null) {
                others = Object.values(others).map((value) => value.replace(' ', '_'));
            } else {
                others = [];
            }
            return <PolytopeChart
                graphPath={props.graphPath}
                endpoint={props.endpoint}
                order={formData.order}
                invariantX={invariantX}
                invariantY={invariantY}
                constraints={others.unshift(invariantColor)}
            />;
        } else {
            return null;
        }
    };

    useEffect(() => {
        let result = [];
        props.invariants.map(invariant => {
            result.push({
                label: invariant.replace('_', ' '),
                value: invariant
            })
        });
        setInvariants(result);
        forceUpdate();
    }, []);

    const constructOtherViews = () => {
        let result = [];
        for (let index = 0; index < otherInvariants.length; index += 3) {
            let temp = [];
            for (let j = index; j < index+3 && j < otherInvariants.length; j++) {
                let inv = otherInvariants[j];
                temp.push(
                    <View
                        key={`inv${index}-${j}`}
                        style={{
                        marginRight: '5%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '5%',
                        paddingBottom: PADDING_BOTTOM,
                        paddingTop: PADDING_TOP,
                        background: '#eaeaea',
                        width: '30%'
                    }}>
                        <Text style={{
                            fontSize: '25px'
                        }}>{inv.replace('_', ' ')}</Text>
                        <br/>
                        <Autocomplete
                            disablePortal
                            id={`select${j}`}
                            clearIcon={null}
                            options={invariants}
                            onChange={(event) => handleChangeOther(event, inv)}
                            sx={{width: '90%'}}
                            renderInput={(params) =>
                                <TextField {...params} label={inv.replace('_', ' ')}/>}
                        />

                    </View>)
                if (j === index+2) {
                    result.push(temp);
                    temp = [];
                }
            }
            if (temp.length > 0) {
                result.push(temp);
            }
        }
        return result;
    }

    return (
        <View>
            <View
                style={{
                    paddingLeft: PADDING_LEFT,
                    paddingRight: PADDING_RIGHT,
                }}>
                    <form>
                        <View
                            style={{
                            alignItems: 'center',
                            paddingBottom: PADDING_BOTTOM
                        }}>
                            <Text style={{
                                fontSize: '25px'
                            }}>Please complete your request</Text>
                        </View>
                        <InnerText>Please select number of vertices by graph (order)</InnerText>
                        <View
                            style={{
                            alignItems: 'center',
                            paddingBottom: PADDING_BOTTOM,
                            paddingTop: PADDING_TOP,
                        }}>
                            <Slider
                                aria-label="GraphOrder"
                                defaultValue={props.params.properties.max_graph_size.default}
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={props.params.properties.max_graph_size.minimum}
                                max={props.params.properties.max_graph_size.maximum}
                                sx={{
                                    color: 'success.main',
                                    '& .MuiSlider-thumb': {
                                        borderRadius: '1px',
                                    },
                                }}
                                style={{
                                    width: '75%',
                                }}
                                onChange={handleChangeOrder}
                            />
                        </View>
                        <View
                            style={{
                            flexDirection: 'row',
                            flex: 1,
                            width: '100%'
                        }}>
                            <View
                                style={{
                                marginRight: '5%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingBottom: PADDING_BOTTOM,
                                paddingTop: PADDING_TOP,
                                background: '#eaeaea',
                                width: '30%'
                            }}>
                                <Text style={{
                                    fontSize: '25px',
                                }}>X axis</Text>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box"
                                    options={invariants}
                                    onChange={handleChangeX}
                                    sx={{ width: '90%' }}
                                    clearIcon={null}
                                    renderInput={(params) =>
                                        <TextField {...params} label="Invariant for X axis" />}
                                />

                            </View>
                            <View
                                style={{
                                marginRight: '5%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                paddingBottom: PADDING_BOTTOM,
                                paddingTop: PADDING_TOP,
                                background: '#eaeaea',
                                width: '30%'
                            }}>
                                <Text style={{
                                    fontSize: '25px'
                                }}>Y axis</Text>
                                <br/>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box"
                                    options={invariants}
                                    clearIcon={null}
                                    onChange={handleChangeY}
                                    sx={{ width: '90%' }}
                                    renderInput={(params) =>
                                        <TextField {...params} label="Invariant for Y axis" />}
                                />
                            </View>
                            {checked?
                                <View
                                    style={{
                                    marginRight: '5%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: PADDING_BOTTOM,
                                    paddingTop: PADDING_TOP,
                                    background: '#eaeaea',
                                    width: '30%'
                                }}>
                                    <View
                                        style={{
                                        flewDirection: 'row',
                                    }}>
                                        <Text style={{
                                            fontSize: '25px'
                                        }}><Switch checked={checked} onChange={handleChangeChecked}/> Color points</Text>
                                    </View>
                                    <br/>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box"
                                        clearIcon={null}
                                        options={invariants}
                                        onChange={handleChangeColor}
                                        sx={{ width: '90%' }}
                                        renderInput={(params) =>
                                            <TextField {...params} label="Invariant for Color points" />}
                                    />
                                </View>
                                :
                                <View
                                    style={{
                                    marginRight: '5%',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    paddingBottom: PADDING_BOTTOM,
                                    paddingTop: PADDING_TOP,
                                    background: '#ffffff',
                                    width: '30%'
                                }}>
                                    <View
                                        style={{
                                        flewDirection: 'row',
                                    }}>

                                        <Text style={{
                                            fontSize: '25px',
                                            color: '#8f8f8f'
                                        }}><Switch checked={checked} onChange={handleChangeChecked}/> Color points</Text>
                                    </View>
                                    <br/>
                                    <Autocomplete
                                        clearIcon={null}
                                        disablePortal
                                        disabled={true}
                                        id="combo-box"
                                        options={invariants}
                                        sx={{ width: '90%' }}
                                        renderInput={(params) =>
                                            <TextField {...params} label="Invariant for Color points" />}
                                    />
                                </View>
                            }
                        </View>
                        {otherInvariants.length > 0 ?
                            constructOtherViews().map((group, i) => {
                                return (
                                    <View
                                        key={`view${i}`}
                                        style={{
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%'
                                    }}>
                                        {group}
                                    </View>)
                                }) : null}
                        <View
                            key="AddInvariant"
                            style={{
                            paddingTop: PADDING_TOP,
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-between',
                            alignItems: 'flex-end',
                        }}>
                            <Button variant="outlined" onClick={handleAddClick} color="success" startIcon={<AddCircleOutlineIcon />}>
                                Add other invariant?
                            </Button>
                            <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<SendIcon />}>
                                Submit
                            </Button>
                        </View>
                    </form>
            </View>
            <RenderPolytopeChart/>
        </View>
    )
}