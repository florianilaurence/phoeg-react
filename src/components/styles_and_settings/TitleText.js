import {View} from "react-native";
import {Text} from "react-native-web";
import {
    COLOR_TITLES,
    DIVIDING_LINE_STYLE,
    PADDING_LEFT,
    PADDING_RIGHT,
    TITLE_SIZE
} from "../../designVars";

export default function TitleText(props) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'right'}}>
            <View style={DIVIDING_LINE_STYLE} />
            <View style={{paddingRight: PADDING_RIGHT, paddingLeft: PADDING_LEFT}}>
                <Text style={{ fontSize: TITLE_SIZE, fontWeight: 'bold', color: COLOR_TITLES}}>
                    {props.children}
                </Text>
            </View>
        </View>
    );
}