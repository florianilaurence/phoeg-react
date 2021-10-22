import React from "react";
import Select from 'react-select';

// List of invariants possible
const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

const options = [
    {value : "m", label : "m"},
    {value : "n", label : "n"}
]

// Init selectedOption
let selectedInvariant = invariants["avcol"];
let selectedOption = options["m"]

// Method called when select other invariant
function handleChangeInvariant(selectedInvariantNew) {
    selectedInvariant = selectedInvariantNew;
}

function handleChangeOption(selectedOptionNew) {
    selectedOption = selectedOptionNew
}

// Component's core
function Polytope (props) {
        return (
            <div>
                <h3> Polytope {props.num}</h3>
                <p>Quel invariant souhaitez-vous utiliser ?
                    <Select
                        isClearable
                        onChange = {handleChangeInvariant(selectedInvariant)}
                        value = {selectedInvariant}
                        options = {invariants}
                    />
                    <Select
                        isClearable
                        onChange = {handleChangeOption(selectedOption)}
                        value = {selectedOption}
                        options = {options}
                    />
                </p>
            </div>
        )
}

export default Polytope;