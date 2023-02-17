import { Box, CircularProgress, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";

const loading: React.FC = () => {
  return (
    <Box
      sx={{ ml: LEFT, mr: RIGHT, height: "400px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="success" size="10rem" />
    </Box>
  );
};

export default loading;
