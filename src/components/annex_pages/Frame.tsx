import { ReactNode } from "react";
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
import { useLocation, useNavigate } from "react-router-dom";
import { blueGrey } from "@mui/material/colors";
import { Link, Tooltip } from "@mui/material";
import AppRoutes from "../../routes";

interface FrameProps {
  children: ReactNode;
  isOpenMenu: boolean;
  setIsOpenMenu: (isOpenMenu: boolean) => void;
}

const drawerWidthOpen = 230;
const drawerWidthClosed = 60;
const heightToolbar = 75;

const options = [
  { text: "PHOEG", link: AppRoutes.PHOEG, icon: <HomeIcon /> },
  {
    text: "Autoconjectures",
    link: AppRoutes.AUTOCONJECTURES,
    icon: <AutoFixHighIcon />,
  },
  {
    text: "Informations on invariants",
    link: AppRoutes.INFORMATIONS,
    icon: <TableRowsIcon />,
  },
  { text: "Tutorial", link: AppRoutes.TUTORIAL, icon: <HelpIcon /> },
  {
    text: "About",
    link: AppRoutes.ABOUT,
    icon: <LightbulbCircleIcon />,
  },
];

const Frame = ({ children, isOpenMenu, setIsOpenMenu }: FrameProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onClickOpen = () => {
    setIsOpenMenu(!isOpenMenu);
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
          <Link
            onClick={() => navigate("/phoeg", { replace: true })}
            style={{ cursor: "pointer" }}
          >
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
          width: isOpenMenu ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
        }}
      >
        <Toolbar sx={{ height: 82 }} />
        <Box
          sx={{
            width: isOpenMenu ? drawerWidthOpen : drawerWidthClosed,
            height: "100%",
            backgroundColor: blueGrey[50],
          }}
        >
          <Tooltip
            title={isOpenMenu ? "Collapse menu" : "Expand menu"}
            placement={isOpenMenu ? "top-end" : "right"}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isOpenMenu ? "flex-end" : "center",
                mt: 1,
                height: 45,
              }}
            >
              <IconButton onClick={onClickOpen}>
                {isOpenMenu ? (
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
                <ListItemButton
                  sx={{
                    height: 45,
                    justifyContent: isOpenMenu ? "initial" : "center",
                    backgroundColor:
                      location.pathname === option.link
                        ? blueGrey[100]
                        : "transparent",
                  }}
                  onClick={() => navigate(option.link, { replace: true })}
                >
                  <Tooltip
                    title={option.text}
                    placement={isOpenMenu ? "top" : "right"}
                  >
                    <ListItemIcon
                      sx={{
                        mr: isOpenMenu ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {option.icon}
                    </ListItemIcon>
                  </Tooltip>
                  {isOpenMenu ? <ListItemText primary={option.text} /> : null}
                </ListItemButton>
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
