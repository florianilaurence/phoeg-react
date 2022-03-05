import React, { useEffect, useState } from "react";
import MyGraph from "./MyGraph";
import Select from "react-select";
import {Text} from "react-native";

export default function GraphSlider(props) {
    const [currentIndex, setCurrentIndex] = useState(0); // Indice du graphe à afficher
    const [currentSign, setCurrentSign] = useState(props.graphList[currentIndex]);

    const OPTIONS = [
        {value: 1, label: "non"},
        {value: 2, label: "oui, seul"},
        {value: 3, label: "oui, les deux"}
    ];
    const [option, setOption] = useState(OPTIONS[0]);
    let currentOption = option.value;

    useEffect( () => {
        setCurrentSign(props.graphList[currentIndex]);
        }, [props.graphList, currentSign, currentIndex] );

    const handleClickPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(props.graphList.length - 1);
        }
        return null;
    }

    const handleClickNext = () => {
        setCurrentIndex((currentIndex + 1) % props.graphList.length);
        return null;
    }

    const handleChangeOption = (newOption) => {
        setOption(newOption);
        currentOption = newOption.value;
        return true;
    }

    const RenderGraphs = () => {
        if (props.graphList.length === 1) {
            return <MyGraph signature={currentSign} displayOprion={currentOption} />
        } else {
            return (
                <div>
                    <button onClick={handleClickPrevious}> Précédent </button>
                    <MyGraph signature={currentSign} displayOption={currentOption} />
                    <button onClick={handleClickNext}> Suivant </button>
                </div>
            );
        }
    }

    return (
        <div className="graphslider">
            <p> Nous avons trouvé {props.graphList.length} graphe(s) différent(s) </p>
            <h3> Graphe dont la signature est : {currentSign} </h3>
            <form>
                <label>
                    Souhaitez-vous afficher le complément du graphe ?
                    <Select
                        defaultValue={option}
                        onChange={handleChangeOption}
                        options={OPTIONS}
                    />
                </label>
            </form>
            {currentOption === 1 ?
                <Text style={{fontWeight: 'bold'}} > Graphe d'origine  </Text> :
                currentOption === 2 ?
                    <Text style={{color: '#00ff00', fontWeight: 'bold'}} > Complément du graphe </Text> :
                    <>
                        <Text style={{fontWeight: 'bold'}} > Graphe d'origine  </Text>
                        <Text style={{color: '#00ff00', fontWeight: 'bold'}} > Complément du graphe </Text>
                    </>
            }
            <RenderGraphs />
        </div>
    );

}
