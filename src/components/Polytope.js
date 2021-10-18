import React, {useState} from "react";
import Select from 'react-select';

const invariants = [
    {value: "avcol", label: "avcol"},
    {value: "eci", label: "eci"},
    {value: "numcol", label: "numcol"}
]

class Polytope extends React.Component {
    state = {
        selectedOption: null,
    };

    handleChange = selectedOption => {
        this.setState(
            {selectedOption},
            () => console.log(' !! ',this.state.selectedOption)
        );
    };

    render() {
        const {selectedOption} = this.state;

        return (
            <div>
                <h3> Polytope</h3>
                <p>Quel invariant souhaitez-vous utiliser ?
                    <Select
                        value = {selectedOption}
                        onChange = {this.handleChange}
                        options = {invariants}
                    />
                </p>
            </div>
        )
    }
}

export default Polytope;