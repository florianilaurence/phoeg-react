import Polytopes from "./Polytopes.js";
import Menu from "./Menu.js";
import "react-banner/dist/style.css";
import {AppBar, Box, IconButton, Toolbar} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { faInfo } from '@fortawesome/free-solid-svg-icons/faInfo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Component's core
export default function App() {
    return (
        <div className="app">
            <Box sx={{flexGrow: 1}}>
                <AppBar position="static" style={{ background: '#000000'}}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{mr: 2}}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            News
                        </Typography>
                        <Button color="inherit">Login</Button>
                    </Toolbar>
                </AppBar>
            </Box>
            TODO : Ajouter Titre + Logo !!!
            <Button variant="contained" startIcon={<FontAwesomeIcon icon={faInfo} />} >
                Tuto
            </Button>
            <Polytopes/>
        </div>
    )
}