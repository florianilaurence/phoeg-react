import { Box, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";

const MyError: React.FC<ErrorProps> = ({ message }: ErrorProps) => {
  return (
    <Box
      sx={{ ml: LEFT, mr: RIGHT, height: "250px" }}
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h4" component="div" gutterBottom>
        Error
      </Typography>
      <Typography variant="body1" gutterBottom>
        Something went wrong with {message}. Please try again later.
      </Typography>
    </Box>
  );
};

export default MyError;

interface ErrorProps {
  message: string;
}
