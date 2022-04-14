import {View} from "react-native";
import {Text} from "react-native-web";
import {
    COLOR_TITLES,
    PADDING_BOTTOM,
    PADDING_INNER,
    SUBSUBTITLE_SIZE,
} from "../../designVars";

export default function SubSubTitleText(props) {
    return (
        <View>
            <Text
                style={{
                    fontSize: SUBSUBTITLE_SIZE,
                    fontWeight: 'bold',
                    paddingRight: PADDING_INNER,
                    paddingBottom: PADDING_BOTTOM,
                    color: COLOR_TITLES,
                    minWidth: '150px',
                    align: 'center'
            }}>
                {props.children}
            </Text>
        </View>
    );
}