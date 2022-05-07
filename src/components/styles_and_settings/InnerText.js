import {Text} from "react-native-web";
import {INNER_TEXT_SIZE} from "../../designVars";

export default function InnerText (props) {

    if (props.bold && !props.italic) {
        return <Text
            style={{
                fontSize: INNER_TEXT_SIZE,
                fontWeight: 'bold',
                flexShrink: 1,
            }}>
            {props.children}
        </Text>
    }

    if (props.italic && !props.bold) {
        return <Text
            style={{
                fontSize: INNER_TEXT_SIZE,
                fontStyle: 'italic',
                flexShrink: 1,
            }}>
            {props.children}
        </Text>
    }

    if (props.bold && props.italic) {
        return <Text
            style={{
                fontSize: INNER_TEXT_SIZE,
                fontWeight: 'bold',
                fontStyle: 'italic',
                flexShrink: 1,
            }}>
            {props.children}
        </Text>
    }

    return (
        <Text
            style={{
                fontSize: INNER_TEXT_SIZE,
                flexShrink: 1,
            }}>
            {props.children}
        </Text>
    )
}