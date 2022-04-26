import React, { useEffect, useState } from "react";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./Graphs.css";
import NewGraph from "./NewGraph";
import {View} from "react-native-web";
import {IconButton} from "@mui/material";
import SubSubTitleText from "../styles_and_settings/SubSubTitleText";

export default function GraphSlider(props) {
    const [currentIndex, setCurrentIndex] = useState(props.firstGraphToShow); // Indice du graphe à afficher
    const [currentSignature, setCurrentSignature] = useState(props.graphList[currentIndex]);

    useEffect( () => {
        setCurrentSignature(props.graphList[currentIndex]);
        }, [props.firstGraphToShow, props.graphList, currentSignature, currentIndex] );

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

    return (
        <View style={{alignItems: 'center', justifyItems: 'center', backgroundColor: '#eeeeee', borderRadius: '10px',
            marginLeft: '5px', marginBottom: '5px'}}>
            <SubSubTitleText>{currentSignature}</SubSubTitleText>
            {props.graphList.length === 1 ?
                <NewGraph signature={currentSignature}/>
                :
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                }}>
                    <IconButton color="success" onClick={handleClickPrevious} fontSize="large">
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                    <NewGraph signature={currentSignature}/>
                    <IconButton color="success" onClick={handleClickNext} fontSize="large">
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </View>
            }
        </View>
    );

}
