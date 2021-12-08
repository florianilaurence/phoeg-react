import React, { useEffect, useState } from "react";
import Graph from "./Graph";

export default function GraphSlider(props) {
    const [currentIndex, setCurrentIndex] = useState(0); // Indice du graphe à afficher
    const [currentSign, setCurrentSign] = useState("@");

    useEffect( () => {
        console.log(props.graphList);
        setCurrentSign(props.graphList[currentIndex]);
        }, [props.graphList, currentSign, currentIndex] );

    return (
        <div className="graphslider">
            <p> Nous avons trouvé {props.graphList.length} graphes différents </p>
            <button
                onClick={() => currentIndex > 0 ? setCurrentIndex(currentIndex - 1) : setCurrentIndex(props.graphList.length - 1)}>
                Précédent
            </button>
            <Graph signature={currentSign}/>
            <button onClick={() => {
                setCurrentIndex((currentIndex + 1) % props.graphList.length);
            }}>
                Suivant
            </button>
        </div>
    );

}
