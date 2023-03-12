import "./Home_and_frame.css";
import { Box } from "@mui/material";
import Title from "../styles_and_settings/Title";
import Inner from "../styles_and_settings/Inner";

export const Introduction = () => {
  return (
    <Box>
      <Title title="Introduction" />
      <Inner align="center">
        Welcome to the new user interface. Start using it by filling in the
        following form to view your first polytope.
        <br />
        And enjoy!
      </Inner>
    </Box>
  );
};
