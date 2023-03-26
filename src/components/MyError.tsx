import { Box, Stack, Typography } from "@mui/material";

interface ErrorProps {
  message: string;
}

const MyError: React.FC<ErrorProps> = ({ message }: ErrorProps) => {
  return (
    <Box
      sx={{ m: 3, height: "300px" }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        variant="body1"
        fontSize={50}
        fontWeight="bold"
        fontStyle="italic"
      >
        Error
      </Typography>
      <br />
      <Typography variant="body1">
        Something went wrong with {message}. Please try again later.
      </Typography>
    </Box>
  );
};

export default MyError;
