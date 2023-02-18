import { Box, Stack, Typography } from "@mui/material";
import { LEFT, RIGHT } from "../designVars";
import Inner from "./styles_and_settings/Inner";

interface ErrorProps {
  message: string;
}

const MyError: React.FC<ErrorProps> = ({ message }: ErrorProps) => {
  return (
    <Stack
      sx={{ ml: LEFT, mr: RIGHT, height: "300px" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Inner size={50} bold italic>
        Error
      </Inner>
      <br />
      <Inner>
        Something went wrong with {message}. Please try again later.
      </Inner>
    </Stack>
  );
};

export default MyError;
