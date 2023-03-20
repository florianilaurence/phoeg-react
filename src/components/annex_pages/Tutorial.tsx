import YouTube from "react-youtube";
import Title from "../styles_and_settings/Title";
import Inner from "../styles_and_settings/Inner";
import { Box } from "@mui/material";
import Frame from "./Frame";
import { OpenProps } from "../polytopes/PhoegApp";

export default function Tutorial({ isOpenMenu, setIsOpenMenu }: OpenProps) {
  const opts = {
    height: "585",
    width: "960",
    playerVars: { autoplay: 0 },
  };

  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Title title="Tutorial" />
      <Inner bold italic align="center">
        This is a demo video for interface.
      </Inner>
      <br />
      <Box display="flex" justifyContent="center" sx={{ mb: 5 }}>
        <YouTube videoId="5D5k5Z5iyL0" opts={opts} />
      </Box>
    </Frame>
  );
}
