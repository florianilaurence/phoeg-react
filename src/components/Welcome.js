import {useNavigate} from "react-router-dom";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Welcome() {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate("/home")
    }, 1500)

    return (
        <div className="center-welcome">
            <Box display="flex" alignItems="center" justifyContent="center">
                <img align="center" src={"big.png"} className="app-logo" alt="logo"/>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
                <Typography variant="h3" align="center">
                    Welcome in the new user interface for PHOEG !!!
                </Typography>
            </Box>
        </div>

    )
}
