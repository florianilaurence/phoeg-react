import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import InnerText from "../styles_and_settings/InnerText";
import {useNavigate} from "react-router-dom";
import { FaInfo } from 'react-icons/fa';
import './Home_and_frame.css'
import {BOTTOM, LEFT, RIGHT, TOP} from "../../designVars";
import {GrInfo} from "react-icons/gr";

export default function Introduction () {
    let navigate = useNavigate();

    return (
        <View style={{flexDirection: 'column', alignItems: 'left', flexGrow: 1}}>
            <TitleText>Introduction</TitleText>
            <View style={{paddingTop: TOP, paddingBottom: BOTTOM, paddingLeft: LEFT, paddingRight: RIGHT}}>
                <InnerText>
                    Click on the following button for more information about the developers behind this user interface.
                    <a onClick={() => navigate("/about", {replace: true})}> <FaInfo className="link"/> </a>
                    <br />
                    Click on the next button if you want to learn how to use this interface.
                    <a onClick={() => navigate("/tutorial", {replace: true})}> <GrInfo className="link"/> </a>
                    <br />
                    Could you give me your opinion by completing the following google forms? Please click on: <a href={"https://forms.gle/bn1YqfqsGGrt4t1z6"} target="_blank" >Feedback</a>
                </InnerText>
            </View>
        </View>
    )
}