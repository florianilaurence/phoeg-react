import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Inner from "../styles_and_settings/Inner";

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/home");
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
      <Inner bold size={75} align="center">
        Welcome in the new user interface for PHOEG
      </Inner>
    </Box>
  );
};

export default Welcome;
