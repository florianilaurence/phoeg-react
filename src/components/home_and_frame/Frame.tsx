import { ReactNode, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import HelpIcon from "@mui/icons-material/Help";
import HomeIcon from "@mui/icons-material/Home";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import TableRowsIcon from "@mui/icons-material/TableRows";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import { Link, Tooltip } from "@mui/material";

interface FrameProps {
  children: ReactNode;
}

const drawerWidthOpen = 230;
const drawerWidthClosed = 60;
const heightToolbar = 75;

const options = [
  { text: "Main app", link: "/main-app", icon: <HomeIcon /> },
  {
    text: "Autoconjectures app",
    link: "/autoconj-app",
    icon: <AutoFixHighIcon />,
  },
  {
    text: "About",
    link: "/about",
    icon: <LightbulbCircleIcon />,
  },
  { text: "Tutorial", link: "/tutorial", icon: <HelpIcon /> },
  {
    text: "Information on invariants",
    link: "/infos",
    icon: <TableRowsIcon />,
  },
];

const Frame = ({ children }: FrameProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const onClickOpen = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: heightToolbar,
          width: "100%",
        }}
        style={{ background: "#000000" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" noWrap component="div">
            Phoeg Web UI
          </Typography>
          <Link onClick={() => navigate("/main-app", { replace: true })}>
            <img
              src={"logo.png"}
              height={heightToolbar}
              alt="logo-phoeg"
              className="link"
            />
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ height: 82 }} />
        <Box
          sx={{
            width: open ? drawerWidthOpen : drawerWidthClosed,
            height: "100%",
            backgroundColor: blueGrey[50],
          }}
        >
          <Tooltip
            title={open ? "Collapse menu" : "Expand menu"}
            placement="top-start"
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: open ? "flex-end" : "center",
                mt: 1,
                height: 45,
              }}
            >
              <IconButton onClick={onClickOpen}>
                {open ? (
                  <KeyboardDoubleArrowLeftIcon />
                ) : (
                  <KeyboardDoubleArrowRightIcon />
                )}
              </IconButton>
            </Box>
          </Tooltip>
          <Divider />
          <List>
            {options.map((option) => (
              <ListItem
                sx={{ mr: 0, display: "block" }}
                key={option.text}
                disablePadding
              >
                <Tooltip title={option.text} placement="top-start">
                  <ListItemButton
                    sx={{
                      height: 45,
                      justifyContent: open ? "initial" : "center",
                    }}
                    onClick={() => navigate(option.link, { replace: true })}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {option.icon}
                    </ListItemIcon>
                    {open ? <ListItemText primary={option.text} /> : null}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, m: 1 }}>
        <Toolbar sx={{ height: heightToolbar }} />
        {children}
      </Box>
    </Box>
  );
};

export default Frame;
