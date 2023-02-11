import { Box, CircularProgress, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";

const loading: React.FC = () => {
  return (
    <Box
      sx={{ ml: LEFT, mr: RIGHT, height: "250px" }}
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="success" size="50" />
    </Box>
  );
};

export default loading;
