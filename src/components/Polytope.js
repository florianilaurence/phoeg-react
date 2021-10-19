import React, {useState} from "react";
import Select from 'react-select';

const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

let selectedOption = invariants["avcol"];

function handleChange (selectedOptionNew) {
    selectedOption = selectedOptionNew;
}

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