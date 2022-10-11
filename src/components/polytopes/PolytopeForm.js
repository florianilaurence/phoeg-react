import {Text, View} from "react-native-web";
import {BOTTOM, DEFAULT_ORDER, INNER, INNER_TEXT_SIZE, LEFT, MAX_ORDER, MIN_ORDER, RIGHT, TOP} from "../../designVars";
import {Autocomplete, Box, IconButton, Slider, Switch, TextField} from "@mui/material";
import InnerText from "../styles_and_settings/InnerText";
import React, {useCallback, useState, useRef} from "react";
import Button from '@mui/material/Button';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SendIcon from '@mui/icons-material/Send';
import PolytopeFetch from "./PolytopeFetch";
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

export default function PolytopeForm(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [checked, setChecked] = useState(false);
    const [formData, setFormData] = useState({
        order: DEFAULT_ORDER,
        invariantX: props.invariantsAxis[0],
        invariantY: props.invariantsAxis[1],
        invariantColor: {label: "Number of Vertices", value: "num_vertices"}, // Default coloration, all points are the same color because order is fixed
        constraints: [],
        advancedConstraints: "",
    });
    const [inputValues, setInputValues] = useState({
        invariantX: "",
        invariantY: "",
        invariantColor: "",
        constraints: [],
        advancedConstraints: "",
    })
    const [submitted, setSubmitted] = useState(false);
    const [numberConstraints, setNumberConstraints] = useState(0);
    const advancedConstraintsRef = useRef(null);

    const getTypeFromName = (name) => {
        let type = "";
        for (let i = 0; i < props.invariantsConstraint.length; i++) {
            if (props.invariantsConstraint[i].label === name) {
                type = props.types[i];
                break;
            }
        }
        return type;
    }

    const handleChange = (name, newValue) => {
        setFormData({...formData, [name]: newValue});
        setSubmitted(false);
        forceUpdate();
    };

    const handleInputChange = (name, newValue) => {
        setInputValues({...inputValues, [name]: newValue});
        setSubmitted(false);
        forceUpdate();
    };

    const handleChangeChecked = (event) => {
        if (!event.target.checked) {
            setFormData({...formData, invariantColor: {label: "Number of Vertices", value: "num_vertices"}});
        }
        setChecked(event.target.checked);
        setSubmitted(false);
        forceUpdate();
    };

    const handleAddConstraint = () => {
        formData.constraints.push({
            name: props.invariantsConstraint[2],
            minimum_bound: 1,
            maximum_bound: 1,
        })
        inputValues.constraints.push({
            name: "",
            minimum_bound: "",
            maximum_bound: "",
        })
        setNumberConstraints(numberConstraints + 1);
        setSubmitted(false);
        forceUpdate();
    };

    const handleRemoveConstraint = (index) => {
        formData.constraints.splice(index, 1);
        inputValues.constraints.splice(index, 1);
        setNumberConstraints(numberConstraints - 1);
        setSubmitted(false);
        forceUpdate();
    };

    const handleChangeConstraint = (name, index, newValue) => {
        let newConstraints = formData.constraints;
        newConstraints[index][name] = newValue;
        setFormData({...formData, constraints: newConstraints});
        setSubmitted(false);
        forceUpdate();
    };

    const handleInputChangeConstraint = (name, index, newValue) => {
        let newConstraints = inputValues.constraints;
        newConstraints[index][name] = newValue;
        setInputValues({...inputValues, constraints: newConstraints});
        setSubmitted(false);
        forceUpdate();
    };

    const handlePermute = () => {
        let x = formData.invariantX;
        let y = formData.invariantY;
        setFormData({...formData, invariantX: y, invariantY: x});
    }

    const handleSubmit = () => {
        if (formData.invariantX === null || formData.invariantX === undefined
            || formData.invariantY === null || formData.invariantY === undefined
            || (checked && (formData.invariantColor === null || formData.invariantColor === undefined))) {
            alert("Please fill in all fields");
            return;
        }
        for (let i = 0; i < formData.constraints.length; i++) {
            if (formData.constraints[i].minimum_bound === null || formData.constraints[i].minimum_bound === undefined
                || formData.constraints[i].maximum_bound === null || formData.constraints[i].maximum_bound === undefined) {
                alert("Please fill in all fields");
                return;
            }
            if (parseFloat(formData.constraints[i].minimum_bound) > parseFloat(formData.constraints[i].maximum_bound)) {
                alert("Minimum bound must be less than maximum bound for constraint " + (i + 1));
                return;
            }
        }
        //TODO check if advanced constraints are valid
        // if (nearley.parse(advancedConstraints).results.length === 0) {
        //     alert("Advanced constraints are not valid");
        //     return;
        // }
        setSubmitted(true);
    };

    const hasNullConstraint = () => {
        for (let i = 0; i < formData.constraints.length; i++) {
            if (formData.constraints[i].name === null) {
                return i;
            }
        }
        return -1;
    }

    const RenderPolytopeFetch = () => {
        if (submitted) {
            let nullConstraint = hasNullConstraint();
            if (formData.invariantX.value === formData.invariantY.value
                || (checked && (formData.invariantX.value === formData.invariantColor.value))
                || (checked && (formData.invariantY.value === formData.invariantColor.value))) {
                return (
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '200px'
                    }}>
                        <InnerText>Sorry, all main invariant must be different</InnerText>
                        <InnerText>Please try again with another request</InnerText>
                    </View>
                );
            } else if (nullConstraint !== -1) {
                return (
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '200px'
                    }}>
                        <InnerText>All constraints must be filled</InnerText>
                        <InnerText>Please fill or delete constraint {nullConstraint+1} </InnerText>
                    </View>
                );
            } else {
                return <PolytopeFetch
                    order={formData.order}
                    invariantX={formData.invariantX.value}
                    invariantY={formData.invariantY.value}
                    invariantColor={formData.invariantColor.value}
                    constraints={formData.constraints.map(constraint => {
                        return {
                            name: constraint.name.value,
                            minimum_bound: constraint.minimum_bound,
                            maximum_bound: constraint.maximum_bound
                        }
                    })}
                    advancedConstraints={formData.advancedConstraints}
                />;
            }
        } else {
            return null;
        }
    };

    const RenderXView = () => {
        return (
            <Box height='125px' m={1} pt={1} sx={{
                justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaeaea', width: '30%'
            }}>
                <Box sx={{width: '100%', textAlign: 'center'}}>
                    <Text style={{fontSize: '25px',}}>X axis</Text>
                </Box>
                <Box m={2}>
                    <Autocomplete
                        value={formData.invariantX}
                        onChange={(event, newValue) =>
                            handleChange("invariantX", newValue)}
                        inputValue={inputValues.invariantX}
                        onInputChange={(event, newValue) =>
                            handleInputChange("invariantX", newValue)}
                        id="auto-complete-x"
                        options={props.invariantsAxis}
                        sx={{width: '90%'}}
                        clearIcon={null}
                        renderInput={(params) =>
                            <TextField {...params} label="Invariant for X axis"/>}
                    />
                </Box>
            </Box>
        )
    }

    const RenderYView = () => {
        return (
            <Box height='125px' m={1} pt={1} sx={{
                justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaeaea', width: '30%'
            }}>
                <Box sx={{width: '100%', textAlign: 'center'}}>
                    <Text style={{fontSize: '25px',}}>Y axis</Text>
                </Box>
                <Box m={2}>
                    <Autocomplete
                        id="auto-complete-y"
                        value={formData.invariantY}
                        onChange={(event, newValue) =>
                            handleChange("invariantY", newValue)}
                        inputValue={inputValues.invariantY}
                        onInputChange={(event, newValue) =>
                            handleInputChange("invariantY", newValue)}
                        options={props.invariantsAxis}
                        clearIcon={null}
                        sx={{width: '90%'}}
                        renderInput={(params) =>
                            <TextField {...params} label="Invariant for Y axis"/>}
                    />
                </Box>
            </Box>
        )
    }

    const RenderColorView = () => {
        return (
            <Box height='125px' m={1} pt={1} sx={{
                justifyContent: 'center', alignItems: 'center', backgroundColor: checked ? '#eaeaea' : '#f5f5f5',
                width: '30%'
            }}>
                <Box sx={{
                    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%',
                    textAlign: 'center'
                }}>
                    <Switch size='small' color='success' checked={checked} onChange={handleChangeChecked}/>
                    <Text style={{fontSize: '25px', color: checked ? '#000000' : '#bdbdbd'}}>Color points</Text>
                </Box>
                <Box m={2}>
                    <Autocomplete
                        value={formData.invariantColor}
                        onChange={(event, newValue) =>
                            handleChange("invariantColor", newValue)}
                        inputValue={inputValues.invariantColor}
                        onInputChange={(event, newValue) =>
                            handleInputChange("invariantColor", newValue)}
                        id="auto-complete-color"
                        options={props.invariantsColoration}
                        sx={{width: '90%'}}
                        clearIcon={null}
                        disabled={!checked}
                        renderInput={(params) =>
                            <TextField {...params} label="Invariant for color of points"/>}
                    />
                </Box>
            </Box>)
    }

    const constructConstraintsView = () => {
        let result = [];
        for (let index = 0; index < numberConstraints; index += 3) {
            let temp = [];
            for (let j = index; j < index + 3 && j < numberConstraints; j++) {
                temp.push(
                    <Box
                        key={`constraint-${j}`} m={1} pt={1} sx={{
                        justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaeaea', width: '30%'
                    }}>
                        <Box m={1} pt={1} sx={{
                            flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%',
                            textAlign: 'center'
                        }}>
                            <Text style={{fontSize: '25px'}}>{"Constraint " + (j + 1)}</Text>
                            <IconButton onClick={() => handleRemoveConstraint(j)}>
                                <DeleteOutlineIcon/>
                            </IconButton>
                        </Box>
                        <Box m={2}>
                            <Autocomplete
                                value={formData.constraints[j].name}
                                onChange={(event, newValue) =>
                                    handleChangeConstraint("name", j, newValue)}
                                inputValue={inputValues.constraints[j].name}
                                onInputChange={(event, newValue) =>
                                    handleInputChangeConstraint("name", j, newValue)}
                                id={`auto-complete-constraint-${j}`}
                                options={props.invariantsConstraint}
                                clearIcon={null}
                                renderInput={(params) =>
                                    <TextField {...params} label="Invariant name"/>}
                            />
                        </Box>
                        {formData.constraints[j].name !== null ? getTypeFromName(formData.constraints[j].name.label) === 5 ? // if it is a boolean invariant so change the view
                            <Box sx={{textAlign: 'center'}}>
                                <Switch checked={formData.constraints[j].minimum_bound === 1} onChange={
                                    (event) => {
                                        handleChangeConstraint("minimum_bound", j, event.target.checked ? 1 : 0)
                                        handleChangeConstraint("maximum_bound", j, event.target.checked ? 1 : 0)
                                    }} color="success"/>
                            </Box>
                            :
                            <Box m={2} sx={{flexDirection: 'row', justifyContent: 'space-between', display: 'flex'}}>
                                <Box width='45%'>
                                    <TextField
                                        value={formData.constraints[j].minimum_bound}
                                        onChange={(event) =>
                                            handleChangeConstraint('minimum_bound', j, event.target.value)}
                                        id="minimum-bound" label="Minimum" type="number"
                                        InputLabelProps={{shrink: true,}}
                                        variant="outlined"
                                    />
                                </Box>
                                <Box width='45%'>
                                    <TextField
                                        value={formData.constraints[j].maximum_bound}
                                        onChange={(event) =>
                                            handleChangeConstraint('maximum_bound', j, event.target.value)}
                                        id="maximum-bound" label="Maximum" type="number"
                                        InputLabelProps={{shrink: true,}}
                                        variant="outlined"
                                    />
                                </Box>
                            </Box> : null
                        }
                    </Box>)
                if (j === index + 2) {
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

    const AdvancedConstraintsInput = useCallback(({ ref, text, onChange }) => {
        return <TextField ref={ref} value={text} onChange={onChange} type='text' fullWidth variant="outlined" />;
      }, [formData]);

    const handleChangeAdvancedConstraint = (event) => {
        const newConstraints = event.target.value;
        console.debug("handleChangeAdvancedConstraint", newConstraints);
        setFormData({...formData, advancedConstraints: newConstraints});
        setInputValues({...inputValues, advancedConstraints: newConstraints});
        setSubmitted(false);
        forceUpdate();
        // TODO dont lose focus
    }
    
    const RenderAdvancedConstaints = () => {
        return (
            <Box  height='125px' m={1} pt={1} sx={{
                justifyContent: 'center', alignItems: 'center', backgroundColor: '#eaeaea', width: '30%'
            }}>
                <Box m={1} pt={1} sx={{
                            flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '100%',
                            textAlign: 'center'
                        }}>
                    <Text style={{fontSize: '25px',}}>Advanced Constraints</Text>
                </Box>
                <Box m={1} pt={1} sx={{
                            flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: '95%',
                            textAlign: 'center'
                        }}>
                    <AdvancedConstraintsInput ref={advancedConstraintsRef} text={formData.advancedConstraints} onChange={handleChangeAdvancedConstraint}/>
                </Box>
            </Box>
        )
    };
    
    return (
        <View style={{width: '100%', marginBottom: INNER}}>
            <View style={{paddingLeft: LEFT, paddingRight: RIGHT,}}>
                <form>
                    <InnerText>Please select number of vertices by graph (order) </InnerText>
                    <Text style={{fontSize: INNER_TEXT_SIZE, fontWeight: 'bold'}}>n = {formData.order}</Text>
                    <View style={{alignItems: 'center', paddingBottom: BOTTOM, paddingTop: TOP,}}>
                        <Slider aria-label="GraphOrder" defaultValue={formData.order} valueLabelDisplay="auto" step={1}
                                marks min={MIN_ORDER} max={MAX_ORDER} sx={{
                            color: 'success.main',
                            '& .MuiSlider-thumb': {borderRadius: '1px',},
                        }} style={{width: '75%',}}
                                onChange={(event, newValue) => {
                                    handleChange("order", newValue);
                                    setSubmitted(false);
                                }}
                        />
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, width: '100%'}}>
                        <RenderXView/>
                        <IconButton variant="contained" color="success" onClick={handlePermute}>
                            <CompareArrowsIcon />
                        </IconButton>
                        <RenderYView/>
                        <RenderColorView/>
                    </View>
                    {constructConstraintsView().map((group, i) => {
                        return (
                            <View key={`view${i}`} style={{flexDirection: 'row', flex: 1, width: '100%'}}>
                                {group}
                            </View>)
                    })}
                    <View style={{flexDirection: 'row', flex: 1, width: '100%'}}>
                        <RenderAdvancedConstaints/>
                    </View>
                    <View key="AddConstraint" style={{
                        paddingTop: TOP, flexDirection: 'row', width: '100%',
                        justifyContent: 'space-between', alignItems: 'flex-end',
                    }}>
                        <Button variant="outlined" onClick={handleAddConstraint} color="success"
                                startIcon={<AddCircleOutlineIcon/>}>
                            Do you want add a constraint?
                        </Button>
                        <Button variant="contained" color="success" onClick={handleSubmit} endIcon={<SendIcon/>}>
                            Submit
                        </Button>
                    </View>
                </form>
            </View>
            <RenderPolytopeFetch/>
        </View>
    )
}