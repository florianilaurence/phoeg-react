import Polytopes from "./Polytopes.js";
import "react-banner/dist/style.css";
import {AppBar, Box, IconButton, Menu, MenuItem, Toolbar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const options = [
    'Tutorial',
    'About',
];

const ITEM_HEIGHT = 48;

// Component's core
export default function App() {
    let navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        if(event.target.innerText === "Tutorial") {
            navigate("/tutorial", {replace: true});
        } else if (event.target.innerText === "About") {
            navigate("/about");
        }
        setAnchorEl(null);
    };

    return (
        <div className="app">
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static" style={{ background: '#000000'}}>
                    <Toolbar>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            color='inherit'
                            aria-controls={open ? 'long-menu' : undefined}
                            aria-expanded={open ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={handleClick}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="long-menu"
                            MenuListProps={{
                                'aria-labelledby': 'long-button',
                            }}
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            PaperProps={{
                                style: {
                                    maxHeight: ITEM_HEIGHT * 4.5,
                                    width: '20ch',
                                },
                            }}
                        >
                            {options.map((option) => (
                                <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Menu>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Phoeg UI
                        </Typography>
                    </Toolbar>
                </AppBar>
            </Box>
            <Button variant="contained" startIcon={<FontAwesomeIcon icon={faInfo} />} >
                Tuto
            </Button>
            <Polytopes/>
        </div>
    )
}