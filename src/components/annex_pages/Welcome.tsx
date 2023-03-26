import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../routes";

const Welcome = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate(AppRoutes.PHOEG, { state: { open: true } });
  }, 1750);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <img src={"big.png"} className="logo" alt="logo" />
      <br />
      <Typography
        variant="body1"
        fontWeight="bold"
        fontSize={75}
        align="center"
      >
        Welcome in the new user interface for PHOEG
      </Typography>
    </Box>
  );
};

export default Welcome;
