import { Box } from "@mui/material";
import { useState, useContext } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PolytopesContainer from "./PolytopesContainer";
import DataTabs from "./DataTabs";
import MainContext from "../../store/utils/main_context";
import Loading from "../Loading";

const MyTabs = () => {
  const [value, setValue] = useState(0);
  const mainContext = useContext(MainContext);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {mainContext.isSubmit && mainContext.isLoading && (
        <Loading height="1000px" />
      )}
      {mainContext.isSubmit &&
        !mainContext.isLoading &&
        mainContext.concaves.length > 0 &&
        mainContext.minMaxList.length > 0 && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Polytopes" />
                <Tab label="Data" />
              </Tabs>
            </Box>
            <Box hidden={value !== 0}>
              <PolytopesContainer />
            </Box>
            <Box hidden={value !== 1}>
              <DataTabs />
            </Box>
          </>
        )}
    </>
  );
};

export default MyTabs;
