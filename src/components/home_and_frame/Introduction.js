import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import InnerText from "../styles_and_settings/InnerText";
import {useNavigate} from "react-router-dom";
import { FaInfo } from 'react-icons/fa';
import './Home_and_frame.css'
import {PADDING_BOTTOM, PADDING_LEFT, PADDING_RIGHT, PADDING_TOP} from "../../designVars";

export default function Introduction () {
    let navigate = useNavigate();

    return (
        <View style={{
            flexDirection: 'column',
            alignItems: 'left',
            flexGrow: 1
        }}>
            <TitleText>Introduction</TitleText>
            <View style={{
                paddingTop: PADDING_TOP,
                paddingBottom: PADDING_BOTTOM,
                paddingLeft: PADDING_LEFT,
                paddingRight: PADDING_RIGHT,
            }}>
                <InnerText>
                    Click on the following button for more information about the developers behind this user interface.
                    <a onClick={() => navigate("/about", {replace: true})}> <FaInfo className="link"/> </a>
                    <br />
                    Click on the next button if you want to learn how to use this interface.
                    <a onClick={() => navigate("/tutorial", {replace: true})}> <FaInfo className="link"/> </a>
                </InnerText>
            </View>
        </View>
    )
}