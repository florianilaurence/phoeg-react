import {
  Box,
  Button,
  Checkbox,
  List,
  ListItem,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
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
import ConjContext from "../../../store/utils/conj_context";
import { blueGrey } from "@mui/material/colors";

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
  const conjContext = useContext(ConjContext);

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

  const handleActiveChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    mainContext.setSubmitAutoconj(false);
    conjContext.setActive(event.target.checked, i);
  };

  const handleFChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    mainContext.setSubmitAutoconj(false);
    conjContext.setIsFYSearched(event.target.checked, i);
  };

  const handleMoreChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    i: number
  ) => {
    mainContext.setSubmitAutoconj(false);
    conjContext.setIsMore(event.target.checked, i);
  };

  useEffect(() => {
    if (mainContext.concaves.length > 0) {
      setConcavesRefactored(regroupByDirection(mainContext.concaves));
    }
  }, [mainContext.concaves]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleSubmitAutoconj = () => {
    if (!minimumOneClicked()) {
      alert("Please select at least one point");
      return;
    }
    mainContext.setSubmitAutoconj(true);
  };

  const minimumOneClicked = () => {
    let res = false;
    mainContext.pointsClicked.forEach((points) => {
      if (points.length > 0) {
        res = true;
      }
    });
    return res;
  };

  const renderALine = (i: number) => {
    return (
      <ListItem>
        <Checkbox
          size="small"
          checked={conjContext.Fs[i].active}
          onChange={(event) => handleActiveChange(event, i)}
          color="success"
        />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ mr: 4, display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              fontWeight={conjContext.Fs[i].isFYSearched ? "" : "bold"}
              color={conjContext.Fs[i].active ? blueGrey[800] : blueGrey[100]}
            >
              f(x)
            </Typography>
            <Switch
              checked={conjContext.Fs[i].isFYSearched}
              onChange={(event) => handleFChange(event, i)}
              size="small"
              sx={{ ml: 2, mr: 2 }}
              color="success"
              disabled={!conjContext.Fs[i].active}
            />
            <Typography
              variant="body1"
              fontWeight={conjContext.Fs[i].isFYSearched ? "bold" : ""}
              color={conjContext.Fs[i].active ? blueGrey[800] : blueGrey[100]}
            >
              f(y)
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body1"
              fontWeight={conjContext.Fs[i].isMore ? "" : "bold"}
              color={conjContext.Fs[i].active ? blueGrey[800] : blueGrey[100]}
            >
              Less than
            </Typography>
            <Switch
              checked={conjContext.Fs[i].isMore}
              onChange={(event) => handleMoreChange(event, i)}
              size="small"
              sx={{ ml: 2, mr: 2 }}
              color="success"
              disabled={!conjContext.Fs[i].active}
            />
            <Typography
              variant="body1"
              fontWeight={conjContext.Fs[i].isMore ? "bold" : ""}
              color={conjContext.Fs[i].active ? blueGrey[800] : blueGrey[100]}
            >
              More than
            </Typography>
          </Box>
        </Box>
      </ListItem>
    );
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
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <List>
            {renderALine(0)}
            {renderALine(1)}
          </List>

          <Box sx={{ mr: 4, display: "flex", alignItems: "center" }}>
            <Tooltip title="Generate autoconjectures with selected points">
              <Button
                variant="contained"
                color="success"
                endIcon={<SendTimeExtensionIcon />}
                onClick={handleSubmitAutoconj}
                sx={{ height: 40 }}
              >
                Autoconjectures
              </Button>
            </Tooltip>
          </Box>
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
