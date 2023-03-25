import { Box } from "@mui/material";
import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PolytopesContainer from "./PolytopesContainer";
import DataTables from "./DataTables";

const MyTabs = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
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
        <DataTables />
      </Box>
    </>
  );
};

export default MyTabs;
