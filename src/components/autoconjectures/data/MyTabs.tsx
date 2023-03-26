import { Box, Button, Tooltip } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PolytopesContainer from "./PolytopesContainer";
import DataTables from "./DataTables";
import MainConjectures from "./MainConjectures";
import SendTimeExtensionIcon from "@mui/icons-material/SendTimeExtension";
import MainContext from "../../../store/utils/main_context";
import {
  Concave,
  CoordinateAutoconj,
} from "../../../store/reducers/main_reducer";

export interface ConcavesRefactoredProps {
  concavesRefactored: ConcaveRefactored;
}

interface ConcaveRefactored {
  minY: Array<Array<CoordinateAutoconj>>;
  minXminY: Array<Array<CoordinateAutoconj>>;
  minX: Array<Array<CoordinateAutoconj>>;
  minXmaxY: Array<Array<CoordinateAutoconj>>;
  maxY: Array<Array<CoordinateAutoconj>>;
  maxXmaxY: Array<Array<CoordinateAutoconj>>;
  maxX: Array<Array<CoordinateAutoconj>>;
  maxXminY: Array<Array<CoordinateAutoconj>>;
}

const MyTabs = () => {
  const mainContext = useContext(MainContext);
  const [value, setValue] = useState(0);

  const initLists = mainContext.orders.map(
    () => new Array<CoordinateAutoconj>()
  );
  const [concavesRefactored, setConcavesRefactored] =
    useState<ConcaveRefactored>({
      minY: [...initLists], // Not just initLists (else reference problem)
      minXminY: [...initLists],
      minX: [...initLists],
      minXmaxY: [...initLists],
      maxY: [...initLists],
      maxXmaxY: [...initLists],
      maxX: [...initLists],
      maxXminY: [...initLists],
    });

  const keys = Object.keys(concavesRefactored);

  const regroupByDirection = (concaves: Array<Concave>) => {
    const initLists = mainContext.orders.map(
      () => new Array<CoordinateAutoconj>()
    );

    const tempConcavesRefactored: ConcaveRefactored = {
      minY: [...initLists], // Not just initLists (else reference problem)
      minXminY: [...initLists],
      minX: [...initLists],
      minXmaxY: [...initLists],
      maxY: [...initLists],
      maxXmaxY: [...initLists],
      maxX: [...initLists],
      maxXminY: [...initLists],
    };

    for (let key of keys) {
      for (let n = 0; n < concaves.length; n++) {
        tempConcavesRefactored[key][n] = concaves[n][key];
      }
    }
    return tempConcavesRefactored;
  };

  useEffect(() => {
    if (mainContext.concaves.length > 0) {
      setConcavesRefactored(regroupByDirection(mainContext.concaves));
    }
  }, [mainContext.concaves]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmit = () => {
    mainContext.setSubmitAutoconj(true);
    console.log("Submit");
    console.log(mainContext.pointsClicked);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Polytopes" />
          <Tab label="Data" />
          <Tab label="Main conjectures" />
        </Tabs>
      </Box>
      <Box hidden={value !== 0}>
        <PolytopesContainer />
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Tooltip title="Generate autoconojectures with selected points">
            <Button
              variant="contained"
              color="success"
              endIcon={<SendTimeExtensionIcon />}
              onClick={handleSubmit}
            >
              Autoconjectures
            </Button>
          </Tooltip>
        </Box>
      </Box>
      <Box hidden={value !== 1}>
        <DataTables concavesRefactored={concavesRefactored} />
      </Box>
      <Box hidden={value !== 2}>
        <MainConjectures concavesRefactored={concavesRefactored} />
      </Box>
    </>
  );
};

export default MyTabs;
