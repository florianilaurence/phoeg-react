import { Box, CircularProgress } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";

const loading = () => {
  return (
    <Box
      sx={{ ml: LEFT, mr: RIGHT, height: "1000px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="success" size="10rem" />
    </Box>
  );
};

export default loading;
