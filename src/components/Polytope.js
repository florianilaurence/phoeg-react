import Select from 'react-select';
import PolytopeGraph from "./PolytopeGraph"
import {useState} from "react";

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
const MEASURES = [
    {value: "m", label: "m"},
    {value: "chi", label: "chi"}
];

// Component's core
export default function Polytope(props) {

    const renderPolytope = () => {
        return (
            <PolytopeGraph
                invariant={pol.selectedInvariant.value}
                number={pol.selectedNumber.value}
                measure={pol.selectedMeasure.value}/>
        )
    }

    const [pol, setPol] = useState({
        selectedInvariant : INVARIANTS[0],
        selectedNumber : NUMBERS[0],
        selectedMeasure : MEASURES[0]
    });

    const handleChangeInvariant = (newSelectedInvariant) => {
        setPol({
            selectedInvariant: newSelectedInvariant,
            selectedNumber: pol.selectedNumber,
            selectedMeasure: pol.selectedMeasure
        })
        return true;
    }

    const handleChangeNumber = (newSelectedNumber) => {
        setPol({
            selectedInvariant: pol.selectedInvariant,
            selectedNumber: newSelectedNumber,
            selectedMeasure: pol.selectedMeasure
        })
        return true;
    }

    const handleChangeMeasure = (newSelectedMeasure) => {
        setPol({
            selectedInvariant: pol.selectedInvariant,
            selectedNumber: pol.selectedNumber,
            selectedMeasure: newSelectedMeasure
        })
        return true;
    }

    return (
        <div>
            <h3> Polytope {props.num}</h3>
            <form>
                <label>
                    Quel invariant souhaitez-vous étudier ?
                    <Select
                        defaultValue={pol.selectedInvariant}
                        onChange={handleChangeInvariant}
                        options={INVARIANTS}
                    />
                </label>
                <br/>
                <label>
                    Combien de sommet souhaitez-vous pour les graphes ?
                    <Select
                        defaultValue={pol.selectedNumber}
                        onChange={handleChangeNumber}
                        options={NUMBERS}
                    />
                </label>
                <br/>
                <label>
                    Quelle mesures voulez-vous utiliser pour colorer les points ?
                    <Select
                        defaultValue={pol.selectedMeasure}
                        onChange={handleChangeMeasure}
                        options={MEASURES}/>
                </label>
                {renderPolytope()}
            </form>
        </div>
    )
}