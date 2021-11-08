import Select from 'react-select';
import React, {useState} from "react";
import {VictoryChart, VictoryLine, VictoryTheme} from "victory";
import $ from "jquery";
import { Bubble } from 'react-chartjs-2';
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
    const [invariant, setInvariant] = useState(INVARIANTS[0]);
    const [number, setNumber] = useState(NUMBERS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}]);

    let currentInvariant = invariant.value;
    let currentNumber = number.value;
    let currentColor = color.value;

    const update = () => {
        let pathEnv = "https://florianilaurence.github.io/assets/data_" + currentInvariant
            + "/enveloppes/enveloppe-" + currentNumber + ".csv";
        let pathPoi = "https://florianilaurence.github.io/assets/data_" + currentInvariant
            + "/points/points-" + currentNumber + ".csv";
        $.get(pathEnv, function(dataEnvelope) {
            let env = readEnvelope(dataEnvelope, currentInvariant);
            $.get(pathPoi, function (dataPoints) {
                let points = readPoints(dataPoints);
                setEnvelope(env);
            });
        });
    }

    const handleChangeInvariant = (newInvariant) => {
        setInvariant(newInvariant);
        currentInvariant = newInvariant.value;
        update();
        return true;
    }

    const handleChangeNumber = (newNumber) => {
        setNumber(newNumber);
        currentNumber = newNumber.value;
        update();
        return true;
    }

    const handleChangeMeasure = (newColor) => {
        setColor(newColor);
        currentColor = newColor.value;
        update();
        return true;
    }

    return (
        <div>
            <h3> Polytope {props.num}</h3>
            {update()}
            <form>
                <label>
                    Quel invariant souhaitez-vous étudier ?
                    <Select
                        defaultValue={invariant}
                        onChange={handleChangeInvariant}
                        options={INVARIANTS}
                    />
                </label>
                <br/>
                <label>
                    Combien de sommet souhaitez-vous pour les graphes ?
                    <Select
                        defaultValue={number}
                        onChange={handleChangeNumber}
                        options={NUMBERS}
                    />
                </label>
                <br/>
                <label>
                    Quelle mesure voulez-vous employer pour colorer les points ?
                    <Select
                        defaultValue={color}
                        onChange={handleChangeMeasure}
                        options={COLORS}/>
                </label>
                <VictoryChart
                    width={150}
                    height={150}
                    theme={VictoryTheme.material}>
                    <VictoryLine style={{
                        data: {stroke: "#62100d"},
                        parent: {border: "1px solid #ccc"}}}
                                 data={envelope}/>
                </VictoryChart>
            </form>
        </div>
    )
}