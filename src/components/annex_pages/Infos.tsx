import Frame from "./Frame";
import Inner from "../styles_and_settings/Inner";
import Title from "../styles_and_settings/Title";
import { OpenProps } from "../polytopes/PhoegApp";

const Infos = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Title title="Informations on invariants" />
      <Inner align="center">Work in progress, please wait and be patient</Inner>
    </Frame>
  );
};

export default Infos;
