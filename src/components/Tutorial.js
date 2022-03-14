import {IconButton} from "@mui/material";
import CottageRoundedIcon from '@mui/icons-material/CottageRounded';
import {useNavigate} from "react-router-dom";

export default function Tutorial() {
    const navigate = useNavigate();

    return (
        <div>
            <p>
                Coming soon !
            </p>
            <IconButton
                aria-label="more"
                id="home-button"
                sx={{ fontSize: 40 }}
                onClick={() => (navigate("/home"))}
            >
                <CottageRoundedIcon />
            </IconButton>
        </div>
    )
}