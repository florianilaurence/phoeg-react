import React from "react";
import Select from 'react-select';
import PolytopeGraph from "./PolytopeGraph"

// List of invariants possible
const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

// List of number vertices possible
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

// List of options
const options = [
    {value: "m", label: "m"},
    {value: "chi", label: "chi"}
];

// Init selected options
let selectedInvariant = invariants[0];
let selectedNumber = numbers[0];
let selectedOption = options[0];

/**
 * Method called when select other invariant
 *
 * @param selectedInvariantNew
 */
function handleChangeInvariant(selectedInvariantNew) {
    selectedInvariant = selectedInvariantNew;
}

/**
 * Method called when select other vertices number
 *
 * @param selectedNumberNew
 */
function handleChangeNumber(selectedNumberNew) {
    selectedNumber = selectedNumberNew;
}

/**
 * Method called when select other option
 *
 * @param selectedOptionNew
 */
function handleChangeOption(selectedOptionNew) {
    selectedOption = selectedOptionNew;
}

function isCompleted() {
    return selectedInvariant != null
        && selectedNumber != null
        && selectedOption != null
}

// Component's core
function Polytope (props) {
        return (
            <div>
                <h3> Polytope {props.num}</h3>
                <form>
                    <label>
                        Quel invariant souhaitez-vous étudier ?
                        <Select
                            defaultValue={selectedInvariant}
                            onChange ={handleChangeInvariant(selectedInvariant)}
                            options = {invariants}
                        />
                    </label>
                    <br/>
                    <label>
                        Combien de sommet souhaitez-vous pour les graphes ?
                        <Select
                            defaultValue={selectedNumber}
                            onChange={handleChangeNumber(selectedNumber)}
                            options={numbers}
                        />
                    </label>
                    <br/>
                    <label>
                        Quelle option voulez-vous utiliser pour colorer les points ?
                        <Select
                            defaultValue={selectedOption}
                            onChange={handleChangeOption(selectedOption)}
                            options={options}/>
                    </label>
                    <br/>
                </form>
                <PolytopeGraph invariant={selectedInvariant.value} number={selectedNumber.value} option={selectedOption.value}/>
            </div>
        )
}

export default Polytope;