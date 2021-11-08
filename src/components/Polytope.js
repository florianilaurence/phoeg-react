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
    const [invariant, setInvariant] = useState(INVARIANTS[0]);
    const [number, setNumber] = useState(NUMBERS[0]);
    const [color, setColor] = useState(COLORS[0]);
    const [envelope, setEnvelope] = useState([{x: 0, y: 0}]);

    const update = () => {
        let pathEnv = "https://florianilaurence.github.io/assets/data_" + invariant.value
            + "/enveloppes/enveloppe-" + number.value + ".csv";
        let pathPoi = "https://florianilaurence.github.io/assets/data_" + invariant.value
            + "/points/points-" + number.value + ".csv";
        $.get(pathEnv, function(dataEnvelope) {
            let env = readEnvelope(dataEnvelope, invariant.value);
            console.log("---> " + pathEnv)
            $.get(pathPoi, function (dataPoints) {
                let points = readPoints(dataPoints);
                setEnvelope(env);
            });
        });
    }

    const handleChangeInvariant = (newInvariant) => {
        setInvariant(newInvariant);
        console.log("^^^^^^^^^ invariant "+ invariant.value);
        update();
        return true;
    }

    const handleChangeNumber = (newNumber) => {
        setNumber(newNumber);
        console.log("^^^^^^^^^ number "+ number.value);
        update();
        return true;
    }

    const handleChangeMeasure = (newColor) => {
        setColor(newColor);
        console.log("^^^^^^^^^ color "+ color.value);
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