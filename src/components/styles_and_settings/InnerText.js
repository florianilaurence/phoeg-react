import {Text} from "react-native-web";
import {
    INNER_TEXT_SIZE,
    PADDING_BOTTOM,
    PADDING_LEFT,
    PADDING_RIGHT,
    PADDING_TOP
} from "../../designVars";

export default function InnerText (props) {

    return (
        <Text
            style={{
                fontSize: INNER_TEXT_SIZE,
                paddingLeft: PADDING_LEFT,
                paddingRight: PADDING_RIGHT,
                paddingTop: PADDING_TOP,
                paddingBottom: PADDING_BOTTOM
            }}>
            {props.children}
        </Text>
    )
}