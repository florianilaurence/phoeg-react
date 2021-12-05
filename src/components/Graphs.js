import React, { useEffect, useState } from "react";
import { readGraph } from "../core/ParseFiles";
import AwesomeSlider from 'react-awesome-slider';
import Graph from "./Graph";

export default function Graphs(props) {
    const [graphsList, setGraphsList] = useState([]); // La liste des graphes correspondant aux critères

    useEffect( () => {
        let pathGraph = "assets/data_" + props.name + "/graphes/graphes-" + props.n + ".json";
        fetch(pathGraph, {headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}})
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        setGraphsList(readGraph(myJson, props.m, props.invariantVal, props.name));
                    })
        }, [props.m, props.n, props.name, props.invariantVal]
    )

    const renderMultiGraph = () => { // TODO Ajouter contrôle de la taille de la liste (>= 1)
        let i = 1;
        let result = [];
        while (i <= graphsList.length) {
            result.push(renderOneGraph(i));
            i++;
        }
        return result;
    }

    const renderOneGraph = (num) => {
        return <div> <Graph key={"graph_" + num} signature={graphsList[num-1]["sig"]}/> </div>
    }

    return (
        <div className="graphs">
            <h2 className="graphs-title">Graphe(s)</h2>
            <p> Nom de l'invariant : {props.name} Nombre d'arêtes : {props.m} Valeur de l'invariant : {props.invariantVal}</p>
            <p> Nous avons trouvé {graphsList.length} graphe(s) différent(s) </p>
            <AwesomeSlider animation="cubeAnimation">
                {renderMultiGraph()}
            </AwesomeSlider>
        </div>
    );
    /*
            <label>
                Nous avons trouvé {graphsList.length} graphe(s) différent(s) :
                <Select
                    defaultValue={currentGraphSelect}
                    onChange={handleChangeGraph}
                    options={graphsList}
                />
            </label>
            <Graph nodes={nodes} edges={edges}/>
     */
}