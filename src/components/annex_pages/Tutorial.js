import Banner from "../home_and_frame/Banner";
import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import {TOP} from "../../designVars";
import VideoPlayer from 'react-video-markers';
import {useState} from "react";
import InnerText from "../styles_and_settings/InnerText";

export default function Tutorial() {
    const controls = [
        'play',
        'time',
        'progress',
        'volume',
    ];

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);

    const handlePause = () => {
        setIsPlaying(false);
    };

    const handlePlay = () => {
        setIsPlaying(true);
    };

    const handleVolume = value => {
        setVolume(value);
    };

    return (
        <>
            <Banner isHome={false} />
            <View>
                <TitleText>Tutorial</TitleText>
                <View style={{ paddingTop: TOP, alignItems: 'center'}}>
                    <InnerText>
                        This is a demo video for interface.
                    </InnerText>
                    <br />
                    <VideoPlayer
                        url={"demo.webm"}
                        controls={controls}
                        volume={volume}
                        isPlaying={isPlaying}
                        onPlay={handlePlay}
                        onPause={handlePause}
                        onVolume={handleVolume}
                        width='75%'
                        height='75%'
                    />
                </View>
            </View>
        </>
    )
}