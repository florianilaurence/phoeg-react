import Banner from "../home_and_frame/Banner";
import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import {BOTTOM, LEFT, RIGHT} from "../../designVars";
import InnerText from "../styles_and_settings/InnerText";

export default function Tutorial() {
    
    return (
        <>
            <Banner isHome={false} />
            <View>
                <TitleText>Tutorial</TitleText>
                <View style={{flexWrap: 'wrap', paddingLeft: LEFT, paddingRight: RIGHT, paddingBottom: BOTTOM,
                    justifyItems: 'center', alignItems: 'center', height: '250px'}}>
                    <InnerText>
                        This is the tutorial page.
                    </InnerText>
                </View>
            </View>
        </>
    )
}