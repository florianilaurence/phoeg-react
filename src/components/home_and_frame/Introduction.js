import {View} from "react-native-web";
import TitleText from "../styles_and_settings/TitleText";
import {useNavigate} from "react-router-dom";
import LightbulbCircleIcon from '@mui/icons-material/LightbulbCircle';
import './Home_and_frame.css'
import {BOTTOM, INNER, LEFT, RIGHT, TOP} from "../../designVars";
import HelpIcon from '@mui/icons-material/Help';
import {Box, Tooltip} from "@mui/material";
import Button from "@mui/material/Button";
import InnerText from "../styles_and_settings/InnerText";

export default function Introduction () {
    let navigate = useNavigate();

    return (
        <View>
            <TitleText>Introduction</TitleText>
            <View style={{paddingTop: TOP, paddingBottom: BOTTOM, paddingLeft: LEFT, paddingRight: RIGHT}}>
                <Box display="flex" justifyContent="space-between">
                    <Tooltip title="More informations about PHOEG and developers" placement='top'>
                        <Button onClick={() => navigate("/about", {replace: true})} color='success' size='large' variant='contained' startIcon={<LightbulbCircleIcon/>}>About</Button>
                    </Tooltip>
                    <Tooltip title="View tutorial video" placement='top'>
                        <Button onClick={() => navigate("/tutorial", {replace: true})} color='success' size='large' variant='contained' endIcon={<HelpIcon/>}>Tutorial</Button>
                    </Tooltip>
                </Box>
            </View>
            <View style={{textAlign: 'center', paddingBottom: INNER}}>
                <InnerText bold>Could you give me your opinion by completing the following google forms? Please click on: <a href={"https://forms.gle/bn1YqfqsGGrt4t1z6"} target="_blank" rel="noreferrer">Feedback</a>, thanks
                </InnerText>
            </View>
        </View>
    )
}