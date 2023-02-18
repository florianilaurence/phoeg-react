import { View } from "react-native-web";
import { useNavigate } from "react-router-dom";
import LightbulbCircleIcon from "@mui/icons-material/LightbulbCircle";
import "./Home_and_frame.css";
import { BOTTOM, INNER, LEFT, RIGHT, TOP } from "../../designVars";
import HelpIcon from "@mui/icons-material/Help";
import { Box, Stack, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import InnerText from "../styles_and_settings/InnerText";
import Title from "../styles_and_settings/Title";
import Inner from "../styles_and_settings/Inner";

export const Introduction: React.FC = () => {
  let navigate = useNavigate();

  return (
    <>
      <Title>Introduction</Title>
      <Box sx={{ ml: LEFT, mr: RIGHT }}>
        <Stack justifyContent="space-between" direction="row">
          <Tooltip
            title="More informations about PHOEG and developers"
            placement="top"
          >
            <Button
              onClick={() => navigate("/about", { replace: true })}
              color="success"
              size="large"
              variant="contained"
              startIcon={<LightbulbCircleIcon />}
            >
              About
            </Button>
          </Tooltip>
          <Tooltip title="View tutorial video" placement="top">
            <Button
              onClick={() => navigate("/tutorial", { replace: true })}
              color="success"
              size="large"
              variant="contained"
              endIcon={<HelpIcon />}
            >
              Tutorial
            </Button>
          </Tooltip>
        </Stack>
        <br />
        <Inner>
          Welcome to the new user interface. Start using it by filling in the
          following form to view your first polytope.
          <br />
          And enjoy!
        </Inner>
      </Box>
    </>
  );
};
