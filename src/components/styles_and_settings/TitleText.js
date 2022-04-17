import {View} from "react-native";
import {Text} from "react-native-web";
import {
    COLOR_TITLES,
    DIVIDING_LINE_STYLE,
    INNER,
    TITLE_SIZE
} from "../../designVars";

export default function TitleText(props) {
    return (
        <View style={{flexDirection: 'row', alignItems: 'right'}}>
            <View style={DIVIDING_LINE_STYLE} />
            <View style={{
                paddingLeft: INNER,
                paddingRight: INNER
            }}>
                <Text style={{
                    fontSize: TITLE_SIZE,
                    fontWeight: 'bold',
                    color: COLOR_TITLES
                }}>
                    {props.children}
                </Text>
            </View>
        </View>
    );
}