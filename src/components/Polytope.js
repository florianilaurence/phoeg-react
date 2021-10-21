import React from "react";
import Select from 'react-select';

// List of invariants possible
const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

// Init selectedOption
let selectedOption = invariants["avcol"];

// Method called when select other invariant
function handleChange (selectedOptionNew) {
    selectedOption = selectedOptionNew;
}

// Component's core
function Polytope (props) {
        return (
            <div>
                <h3> Polytope {props.num}</h3>
                <p>Quel invariant souhaitez-vous utiliser ?
                    <Select
                        isClearable
                        onChange = {handleChange(selectedOption)}
                        value = {selectedOption}
                        options = {invariants}
                    />
                </p>
            </div>
        )
}

export default Polytope;