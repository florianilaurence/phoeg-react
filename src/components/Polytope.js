import React from "react";
import Select from 'react-select';
import PolytopeGraph from "./PolytopeGraph"

// List of invariants possible
const INVARIANTS = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
];

// List of number vertices possible
const NUMBERS = [
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
const OPTIONS = [
    {value: "m", label: "m"},
    {value: "chi", label: "chi"}
];

// Component's core
export default class Polytope extends React.Component {
    constructor(props) {
        super(props);
        this.selectedInvariant = INVARIANTS[0];
        this.selectedNumber = NUMBERS[0];
        this.selectedOption = OPTIONS[0];

    }

    handleChangeInvariant(selectedInvariantNew) {
        this.selectedInvariant = selectedInvariantNew;
    }

    handleChangeNumber(selectedNumberNew) {
        this.selectedNumber = selectedNumberNew;
    }

    handleChangeOption(selectedOptionNew) {
        this.selectedOption = selectedOptionNew;
    }

    isCompleted() {
        return this.selectedInvariant != null
            && this.selectedNumber != null
            && this.selectedOption != null
    }

    renderPolytope() {
        return (
            <PolytopeGraph
                invariant={this.selectedInvariant.value}
                number={this.selectedNumber.value}
                option={this.selectedOption.value}/>
        );
    }

    render () {
        return (
            <div>
                <h3> Polytope {this.props.num}</h3>
                <form>
                    <label>
                        Quel invariant souhaitez-vous étudier ?
                        <Select
                            defaultValue={this.selectedInvariant}
                            onChange ={this.handleChangeInvariant(this.selectedInvariant)}
                            options = {INVARIANTS}
                        />
                    </label>
                    <br/>
                    <label>
                        Combien de sommet souhaitez-vous pour les graphes ?
                        <Select
                            defaultValue={this.selectedNumber}
                            onChange={this.handleChangeNumber(this.selectedNumber)}
                            options={NUMBERS}
                        />
                    </label>
                    <br/>
                    <label>
                        Quelle option voulez-vous utiliser pour colorer les points ?
                        <Select
                            defaultValue={this.selectedOption}
                            onChange={this.handleChangeOption(this.selectedOption)}
                            options={OPTIONS}/>
                    </label>
                    {this.renderPolytope()}
                </form>

            </div>
        )
    }
}