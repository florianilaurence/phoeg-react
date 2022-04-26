import Banner from "../home_and_frame/Banner";
import TitleText from "../styles_and_settings/TitleText";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import {BOTTOM, LEFT, RIGHT} from "../../designVars";

export default function About() {

    return (
        <>
            <Banner isHome={false} />
            <View>
                <TitleText>About</TitleText>
                <View style={{flexWrap: 'wrap', paddingLeft: LEFT, paddingRight: RIGHT, paddingBottom: BOTTOM,
                    justifyItems: 'center', alignItems: 'center', height: '250px'}}>
                    <InnerText>The user interface was designed by <a href={"https://laurencefloriani.github.io/"} target="_blank" >Laurence Floriani</a>.</InnerText>
                    <br/>
                    <InnerText>The API to communicate with the server has been implemented by <a href={"https://lavendthomas.github.io/"} target="_blank" >Thomas Lavend'Homme</a>.</InnerText>
                </View>
            </View>
        </>
    )
}