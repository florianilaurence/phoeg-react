import {useNavigate} from "react-router-dom";
import {Text, View} from "react-native-web";
import {TITLE_SIZE} from "../../designVars";

export default function Welcome() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/home")
    }, 1750)

    return (
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1}}>
            <View>
                <img src={"big.png"} className="logo" alt="logo"/>
            </View>
            <View>
                <Text style={{fontSize: TITLE_SIZE}}>Welcome in the new user interface for PHOEG</Text>
            </View>
        </View>
    )
}
