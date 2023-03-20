import Frame from "../annex_pages/Frame";
import { OpenProps } from "../polytopes/PhoegApp";
import Inner from "../styles_and_settings/Inner";
import Title from "../styles_and_settings/Title";

// Main component of Autoconjectures application
const AutoconjecturesApp = ({ isOpenMenu, setIsOpenMenu }: OpenProps) => {
  return (
    <Frame isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu}>
      <Title title="Autoconjectures" />
      <Inner align="center">Work in progress, please wait and be patient</Inner>
    </Frame>
  );
};

export default AutoconjecturesApp;
