import { Box, CircularProgress } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";

interface LoadingProps {
  height: string;
}

const loading = ({ height }: LoadingProps) => {
  return (
    <Box
      sx={{ ml: LEFT, mr: RIGHT, height: height }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="success" size="10rem" />
    </Box>
  );
};

export default loading;
