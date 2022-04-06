import {View} from "react-native";
import {Text} from "react-native-web";
import {
    COLOR_TITLES,
    DIVIDING_LINE_STYLE,
    PADDING_BOTTOM,
    PADDING_INNER,
    PADDING_LEFT,
    SUBTITLE_SIZE
} from "../../designVars";

export default function SubTitleText(props) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'left'}}>
            <View>
                <Text
                    style={{
                        fontSize: SUBTITLE_SIZE,
                        fontStyle: "italic",
                        paddingRight: PADDING_INNER,
                        paddingBottom: PADDING_BOTTOM,
                        color: COLOR_TITLES,
                        minWidth: '150px'
                }}>
                    {props.children}
                </Text>
            </View>
            <View style={DIVIDING_LINE_STYLE} />
        </View>
    );
}