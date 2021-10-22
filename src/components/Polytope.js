import React from "react";
import Select from 'react-select';
import PolytopeGraph from "./PolytopeGraph"

// List of invariants possible
const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

const numbers = [
    {value : "2", label : "2"},
    {value : "3", label : "3"},
    {value : "4", label : "4"},
    {value : "5", label : "5"},
    {value : "6", label : "6"},
    {value : "7", label : "7"},
    {value : "8", label : "8"},
    {value : "9", label : "9"},
]

const options = [
    {value: "m", label: "m"},
    {value: "chi", label: "chi"}
];

// Init selectedOption
let selectedInvariant = invariants["avcol"];
let selectedNumber = numbers["deux"];
let selectedOption = options["chi"];

// Method called when select other invariant
function handleChangeInvariant(selectedInvariantNew) {
    selectedInvariant = selectedInvariantNew;
}

function handleChangeNumber(selectedNumberNew) {
    selectedNumber = selectedNumberNew;
}

function handleChangeOption(selectedOptionNew) {
    selectedOption = selectedOptionNew;
}

function handleClick() {
    return (<PolytopeGraph />)
}

// Component's core
function Polytope (props) {
        return (
            <div>
                <h3> Polytope {props.num}</h3>
                <p>Quel invariant souhaitez-vous étudier ?
                    <Select
                        onChange = {handleChangeInvariant(selectedInvariant)}
                        value = {selectedInvariant}
                        options = {invariants}
                    />
                </p>
                <p> Combien de sommet souhaitez-vous pour les graphes ?
                    <Select
                        onChange = {handleChangeNumber(selectedNumber)}
                        value = {selectedNumber}
                        options = {numbers}
                    />
                </p>
                <p> Quelle option voulez-vous utiliser pour colorer les points ?
                    <Select
                        onChange = {handleChangeOption(selectedOption)}
                        value = {selectedOption}
                        options = {options}
                    />
                </p>
                <button onClick={() => handleClick()}>
                    Lancer la recherche ?
                </button>
            </div>
        )
}

export default Polytope;