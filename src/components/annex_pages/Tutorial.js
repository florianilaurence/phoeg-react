import Banner from "../home_and_frame/Banner";
import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import {TOP} from "../../designVars";
import YouTube from 'react-youtube';
import InnerText from "../styles_and_settings/InnerText";

export default function Tutorial() {
    const opts = {
        height: '585',
        width: '960',
        playerVars: {autoplay: 0},
    };

    return (
        <>
            <Banner isHome={false} />
            <View>
                <TitleText>Tutorial</TitleText>
                <View style={{ paddingTop: TOP, alignItems: 'center', textAlign: 'center'}}>
                    <InnerText bold italic>
                        This is a demo video for interface.
                    </InnerText>
                    <View style={{ paddingTop: TOP }}>
                        <YouTube videoId="5D5k5Z5iyL0" opts={opts} />
                    </View>
                </View>
            </View>
        </>
    )
}