import CottageRoundedIcon from '@mui/icons-material/CottageRounded';
import {IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";

export default function About() {
    const navigate = useNavigate();

    return (
        <div>
            <p>
                Coming soon !
            </p>
            <IconButton
                aria-label="more"
                id="home-button"
                color='inherit'
                fontSize="large"
                onClick={() => (navigate("/home"))}
            >
                <CottageRoundedIcon />
            </IconButton>
        </div>
    )
}