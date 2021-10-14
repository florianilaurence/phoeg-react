import React from "react";
import CreatableSelect from 'react-select/creatable';
import Polytope from "./Polytope";

const options = [
    {value: 1, label:'1'},
    {value: 2, label:'2'},
    {value: 3, label:'3'}
];

class Polytopes extends React.Component {
    selectedOption = null;

    handleChange = (selectedOption) => {
        this.selectedOption = selectedOption.value;
        return <Polytope dataFromParent={this.selectedOption} />
    }

    render() {
        return (
            <div>
                <h2 className="polytope-title">Polytope(s)</h2>
                <form>
                    <label>
                        Combien de poyltopes souhaitez-vous comparer (jusque 3 maximum) ?
                        <CreatableSelect
                            options={options}
                            onChange={this.handleChange}
                            onInputChange={this.handleInputChange}
                        />
                        
                    </label>
                </form>
            </div>
        )
    }
}

export default Polytopes;