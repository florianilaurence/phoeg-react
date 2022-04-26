import Polytope from "./Polytope";
import {useState} from "react";
import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import InnerText from "../styles_and_settings/InnerText";
import {Slider} from "@mui/material";
import {
    DEFAULT_NUMBER_OF_POLYTOPES,
    MAX_NUMBER_OF_POLYTOPES,
    MIN_NUMBER_OF_POLYTOPES,
    BOTTOM,
    LEFT,
    RIGHT,
    TOP
} from "../../designVars";

export default function Polytopes() {
    const [count, setCount] = useState(DEFAULT_NUMBER_OF_POLYTOPES);

    const RenderMultiPolytopes = () => {
        let i = 1;
        let result = [];
        while (i <= count) {
            result.push(renderOnePolytope(i));
            i++;
        }
        return result;
    }

    const renderOnePolytope = (num) => {
        return <Polytope key={"pol_" + num} num={num}/>
    }

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'left',
            flexGrow: 1,
        }}>
            <TitleText>Polytopes</TitleText>
            <View
                style={{
                    paddingLeft: LEFT,
                    paddingTop: TOP,
                    paddingRight: RIGHT,
                    paddingBottom: BOTTOM
                }}>
                <InnerText>Please select number of polytopes that you want analyse in parallel</InnerText>
                <br/>
                <View style={{
                    alignItems: 'center',
                    paddingBottom: BOTTOM,
                }}>
                    <Slider
                        aria-label="PolytopesNumber"
                        defaultValue={DEFAULT_NUMBER_OF_POLYTOPES}
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={MIN_NUMBER_OF_POLYTOPES}
                        max={MAX_NUMBER_OF_POLYTOPES}
                        sx={{
                            color: 'success.main',
                            '& .MuiSlider-thumb': {
                                borderRadius: '1px',
                            },
                        }}
                        style={{
                            width: '75%',
                        }}
                        onChange={(event) => {setCount(event.target.value)}}
                    />
                </View>
            </View>
            <RenderMultiPolytopes />
        </View>
    );
}