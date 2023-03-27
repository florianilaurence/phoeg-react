import Frame from "./Frame";
import Title from "../styles_and_settings/Title";
import { OpenProps } from "../phoeg_app/PhoegApp";
import { Typography } from "@mui/material";

const Infos = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Title title="Informations on invariants" />
      <Typography variant="body1" align="center">
        Work in progress, please wait and be patient
      </Typography>
    </Frame>
  );
};

export default Infos;
