import Select from 'react-select';
import React, {useState} from "react";
import {VictoryChart, VictoryLine, VictoryTheme} from "victory";
import $ from "jquery";
import {readEnvelope, readPoints} from "../core/ParseFiles";

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

// List of possible colors
const COLORS = [
    {value: "mult", label: "mult"},
    {value: "chi", label: "chi"}
];

// Component's core
export default function Polytope(props) {

    const [pol, setPol] = useState({
        selectedInvariant : INVARIANTS[0],
        selectedNumber : NUMBERS[0],
        selectedColor : COLORS[0],
        envelope: [{x: 0, y: 0}]
    });

    const update = () => {
        alert("update est appelé")
        let pathEnv = "https://florianilaurence.github.io/assets/data_" + pol.selectedInvariant
            + "/enveloppes/enveloppe-" + pol.selectedNumber + ".csv";
        let pathPoi = "https://florianilaurence.github.io/assets/data_" + pol.selectedInvariant
            + "/points/points-" + pol.selectedNumber + ".csv";
        $.get(pathEnv, function(dataEnvelope) {
            let env = readEnvelope(dataEnvelope, pol.selectedInvariant);
            $.get(pathPoi, function (dataPoints) {
                let points = readPoints(dataPoints)
                setPol({
                    selectedInvariant: pol.selectedInvariant,
                    selectedNumber: pol.selectedNumber,
                    selectedColor: pol.selectedColor,
                    envelope: env
                })
            })
        });
    }

    const handleChangeInvariant = (newSelectedInvariant) => {
        setPol({
            selectedInvariant: newSelectedInvariant,
            selectedNumber: pol.selectedNumber,
            selectedColor: pol.selectedColor,
            envelope: pol.envelope
        })
        update();
        return true;
    }

    const handleChangeNumber = (newSelectedNumber) => {
        setPol({
            selectedInvariant: pol.selectedInvariant,
            selectedNumber: newSelectedNumber,
            selectedColor: pol.selectedColor,
            envelope: pol.envelope
        })
        update();
        return true;
    }

    const handleChangeMeasure = (newSelectedColor) => {
        setPol({
            selectedInvariant: pol.selectedInvariant,
            selectedNumber: pol.selectedNumber,
            selectedColor: newSelectedColor,
            envelope: pol.envelope
        })
        update();
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
                    Quelle mesure voulez-vous employer pour colorer les points ?
                    <Select
                        defaultValue={pol.selectedColor}
                        onChange={handleChangeMeasure}
                        options={COLORS}/>
                </label>
                <VictoryChart
                    theme={VictoryTheme.material}>
                    <VictoryLine style={{
                        data: {stroke: "#62100d"},
                        parent: {border: "1px solid #ccc"}}}
                                 data={pol.envelope}/>
                </VictoryChart>
            </form>
        </div>
    )
}