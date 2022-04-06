import {Text} from "react-native-web";
import {INNER_TEXT_SIZE} from "../../designVars";

export default function InnerText (props) {

    return (
        <Text
            style={{
                fontSize: INNER_TEXT_SIZE
            }}>
            {props.children}
        </Text>
    )
}