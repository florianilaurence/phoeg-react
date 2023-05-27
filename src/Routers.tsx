import { Routes, Route } from "react-router-dom";
import About from "./components/annex_pages/About";
import Infos from "./components/annex_pages/Infos";
import Tutorial from "./components/annex_pages/Tutorial";
import Welcome from "./components/annex_pages/Welcome";
import AutoconjecturesApp from "./components/autoconjectures/AutoconjecturesApp";
import NewWindow from "./components/autoconjectures/NewWindow";
import PhoegApp from "./components/phoeg_app/PhoegApp";
import AppRoutes from "./routes";
import { useState } from "react";

const Routers = () => {
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  return (
    <div className="app-root">
      <Routes>
        <Route path={AppRoutes.WELCOME} element={<Welcome />} />
        <Route
          path={AppRoutes.PHOEG}
          element={
            <PhoegApp isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          }
        />
        <Route
          path={AppRoutes.TUTORIAL}
          element={
            <Tutorial isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          }
        />
        <Route
          path={AppRoutes.AUTOCONJECTURES}
          element={
            <AutoconjecturesApp
              isOpenMenu={isOpenMenu}
              setIsOpenMenu={setIsOpenMenu}
            />
          }
        />
        <Route path={AppRoutes.AUTOCONJECTURES_PRINT} element={<NewWindow />} />
        <Route
          path={AppRoutes.INFORMATIONS}
          element={
            <Infos isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          }
        />
        <Route
          path={AppRoutes.ABOUT}
          element={
            <About isOpenMenu={isOpenMenu} setIsOpenMenu={setIsOpenMenu} />
          }
        />
      </Routes>
    </div>
  );
};

export default Routers;
