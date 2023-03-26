import { Box, CircularProgress } from "@mui/material";

interface LoadingProps {
  height: string;
}

const loading = ({ height }: LoadingProps) => {
  return (
    <Box
      sx={{ m: 3, height: height }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <CircularProgress color="success" size="10rem" />
    </Box>
  );
};

export default loading;
