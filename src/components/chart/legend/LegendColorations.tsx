import {
  Box,
  Typography,
  Button,
  Popper,
  Grid,
  ClickAwayListener,
} from "@mui/material";
import { ColorationObject } from "../../../store/reducers/colorations_reducer";
import ColorationsContext from "../../../store/contexts/colorations_context";
import { useContext, useReducer, useRef } from "react";
import SendIcon from "@mui/icons-material/Send";
import MainContext from "../../../store/contexts/main_context";

const defaultColorations = [
  "#FFCCCC",
  "#FFE6CC",
  "#FFFFCC",
  "#CCFFCC",
  "#CCCCFF",
  "#E5CCFF",
  "#FFCCFF",
  "#FFCCE6",
  "#E6E6E6",

  "#FF0000",
  "#FF8000",
  "#FFFF00",
  "#00FF00",
  "#0000FF",
  "#7F00FF",
  "#FF00FF",
  "#FF0080",
  "#666666",

  "#990000",
  "#994C00",
  "#999900",
  "#009900",
  "#000099",
  "#4C0099",
  "#990099",
  "#99004D",
  "#000000",
];

interface LegendColorationsProps {
  colorScale: any;
}

const pickARandomColor = () => {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  let randColor = randomNumber.toString(16).padStart(6, "0");
  return `#${randColor.toUpperCase()}`;
};

interface PopperIndElements {
  anchorEl: HTMLElement | null;
  open: boolean;
  averageClicked: number;
}

const initialPopperIndElements = {
  anchorEl: null,
  open: false,
  averageClicked: -1,
};

enum PopperIndElementsAction {
  OPEN,
  CLOSE,
}

interface PopperGradientElements {
  minAnchorEl: HTMLElement | null;
  minOpen: boolean;
  maxAnchorEl: HTMLElement | null;
  maxOpen: boolean;
  hasChanged: boolean;
}

const initialPopperGradientElements = {
  minAnchorEl: null,
  minOpen: false,
  maxAnchorEl: null,
  maxOpen: false,
  hasChanged: false,
};

enum PopperGradientElementsAction {
  MIN_OPEN,
  MIN_CLOSE,
  MAX_OPEN,
  MAX_CLOSE,
  HAS_CHANGED,
}

const LegendColorations = ({ colorScale }: LegendColorationsProps) => {
  const colorationsContext = useContext(ColorationsContext);
  const mainContext = useContext(MainContext);
  const windowSize = useRef([window.innerWidth, window.innerHeight]);

  // _____________ For individual colorations _____________
  const popperIndElementsReducer = (state: PopperIndElements, action: any) => {
    switch (action.type) {
      case PopperIndElementsAction.OPEN:
        return {
          ...state,
          anchorEl: action.anchorEl,
          open: true,
          averageClicked: action.averageClicked,
        };
      case PopperIndElementsAction.CLOSE:
        return {
          ...state,
          anchorEl: null,
          open: false,
          averageClicked: -1,
        };
      default:
        return state;
    }
  };

  const [statePopperIndElements, dispatchPopperIndElements] = useReducer(
    popperIndElementsReducer,
    initialPopperIndElements
  );

  const handleClickInd = (
    event: React.MouseEvent<HTMLElement>,
    colorationObject: ColorationObject
  ) => {
    dispatchPopperIndElements({
      type: PopperIndElementsAction.OPEN,
      anchorEl: event.currentTarget,
      averageClicked: colorationObject.average,
    });
  };

  const handleClickAwayInd = (isCancel: boolean, newColoration: string) => {
    if (!isCancel) {
      colorationsContext.updateAColoration(
        statePopperIndElements.averageClicked,
        newColoration
      );
    }
    dispatchPopperIndElements({
      type: PopperIndElementsAction.CLOSE,
    });
  };

  const idInd = statePopperIndElements.open ? "simple-popper" : null;

  // _____________ For gradient colorations _____________
  const popperGradientElementsReducer = (
    state: PopperGradientElements,
    action: any
  ) => {
    switch (action.type) {
      case PopperGradientElementsAction.MIN_OPEN:
        return {
          ...state,
          minAnchorEl: action.minAnchorEl,
          minOpen: true,
        };
      case PopperGradientElementsAction.MIN_CLOSE:
        return {
          ...state,
          minAnchorEl: null,
          minOpen: false,
        };
      case PopperGradientElementsAction.MAX_OPEN:
        return {
          ...state,
          maxAnchorEl: action.maxAnchorEl,
          maxOpen: true,
        };
      case PopperGradientElementsAction.MAX_CLOSE:
        return {
          ...state,
          maxAnchorEl: null,
          maxOpen: false,
        };
      case PopperGradientElementsAction.HAS_CHANGED:
        return {
          ...state,
          hasChanged: action.hasChanged,
        };
      default:
        return state;
    }
  };

  const [statePopperGradientElements, dispatchPopperGradientElements] =
    useReducer(popperGradientElementsReducer, initialPopperGradientElements);

  // --------------------- Min value ---------------------
  const handleClickMin = (event: React.MouseEvent<HTMLElement>) => {
    dispatchPopperGradientElements({
      type: PopperGradientElementsAction.MIN_OPEN,
      minAnchorEl: event.currentTarget,
    });
  };

  const handleClickAwayMin = (isCancel: boolean, newColoration: string) => {
    if (!isCancel) {
      colorationsContext.changeMinColoration(newColoration);
    }
    dispatchPopperGradientElements({
      type: PopperGradientElementsAction.MIN_CLOSE,
    });
  };

  // --------------------- Max value ---------------------
  const handleClickMax = (event: React.MouseEvent<HTMLElement>) => {
    dispatchPopperGradientElements({
      type: PopperGradientElementsAction.MAX_OPEN,
      maxAnchorEl: event.currentTarget,
    });
  };

  const handleClickAwayMax = (isCancel: boolean, newColoration: string) => {
    if (!isCancel) {
      colorationsContext.changeMaxColoration(newColoration);
    }
    dispatchPopperGradientElements({
      type: PopperGradientElementsAction.MAX_CLOSE,
    });
  };

  const idMin = statePopperGradientElements.minOpen ? "simple-popper" : null;
  const idMax = statePopperGradientElements.maxOpen ? "simple-popper" : null;

  // _____________ For random colorations _____________
  const generateRandomColorations = () => {
    const objects: Array<ColorationObject> = colorationsContext.objects;
    const newObjects: Array<ColorationObject> = [];
    const viewedColorations: Array<string> = ["#FFFFFF"]; // No coloration for white
    for (const obj of objects) {
      let randomColoration = pickARandomColor();

      while (viewedColorations.includes(randomColoration)) {
        randomColoration = pickARandomColor();
      }
      newObjects.push({
        ...obj,
        coloration: randomColoration,
      });
      viewedColorations.push(randomColoration);
    }
    colorationsContext.setDataCols(newObjects);
  };

  // _____________ For gradient colorations _____________
  const generateGradientColorations = () => {
    const objects: Array<ColorationObject> = colorationsContext.objects;
    colorationsContext.setDataCols(
      objects.map((obj: ColorationObject) => {
        return {
          ...obj,
          coloration: colorScale(obj.indexInAveragesViewed),
        };
      })
    );
    colorationsContext.resetHasChanged();
  };

  return (
    <Box
      sx={{
        mt: 1,
      }}
    >
      <Typography variant="body1" fontSize={12} fontStyle="italic">
        Color legend calculated from the average colour of a point (click on to
        change a coloration):
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        {/* ---------------------------------- BUTTON GENERATE RANDOM COLORATIONS ---------------------------------- */}
        <Button
          variant="outlined"
          onClick={() => generateRandomColorations()}
          color="success"
          size="small"
        >
          <Typography variant="body1" fontSize={10}>
            Generate random colorations
          </Typography>
        </Button>
        <Box
          sx={{
            display: "flex",
            direction: "row",
          }}
        >
          {/* ---------------------------------- MINIMUM VALUE GRADIENT ---------------------------------- */}
          <Box
            className="box-coloration"
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
            }}
            onClick={(event) => handleClickMin(event)}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 1,
                backgroundColor: colorationsContext.minColoration,
                border: "1px solid black",
                m: 1,
              }}
            >
              <Popper
                sx={{
                  position: "absolute",
                  zIndex: 100,
                }}
                id={idMin ? idMin : ""}
                open={statePopperGradientElements.minOpen}
                placement="bottom-start"
                anchorEl={statePopperGradientElements.minAnchorEl}
              >
                <ClickAwayListener
                  onClickAway={() => handleClickAwayMin(true, "")}
                >
                  <Box
                    className="box-coloration"
                    sx={{
                      width: 210,
                      bgcolor: "whitesmoke",
                      p: 1,
                      border: "1px solid black",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontSize={12}
                      fontStyle="italic"
                    >
                      Choose color for minimum value:
                    </Typography>
                    <Grid container spacing={0.2}>
                      {defaultColorations.map((color, i) => {
                        return (
                          <Grid item key={`color-${i}-${color}`} xs={1.3}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: 1,
                                backgroundColor: color,
                                border: "1px solid black",
                              }}
                              onClick={() => {
                                handleClickAwayMin(false, color);
                              }}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </ClickAwayListener>
              </Popper>
            </Box>
            <Typography variant="body1" fontSize={12}>
              Min value
            </Typography>
          </Box>
          {/* ---------------------------------- MAXIMUM VALUE GRADIENT ---------------------------------- */}
          <Box
            className="box-coloration"
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 1,
            }}
            onClick={(event) => handleClickMax(event)}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 1,
                backgroundColor: colorationsContext.maxColoration,
                border: "1px solid black",
                m: 1,
              }}
            >
              <Popper
                sx={{
                  position: "absolute",
                  zIndex: 100,
                }}
                id={idMax ? idMax : ""}
                open={statePopperGradientElements.maxOpen}
                placement="bottom-start"
                anchorEl={statePopperGradientElements.maxAnchorEl}
              >
                <ClickAwayListener
                  onClickAway={() => handleClickAwayMax(true, "")}
                >
                  <Box
                    className="box-coloration"
                    sx={{
                      width: 210,
                      bgcolor: "whitesmoke",
                      p: 1,
                      border: "1px solid black",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontSize={12}
                      fontStyle="italic"
                    >
                      Choose color for maximum value:
                    </Typography>
                    <Grid container spacing={0.2}>
                      {defaultColorations.map((color, i) => {
                        return (
                          <Grid item key={`color-${i}-${color}`} xs={1.3}>
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: 1,
                                backgroundColor: color,
                                border: "1px solid black",
                              }}
                              onClick={() => handleClickAwayMax(false, color)}
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </ClickAwayListener>
              </Popper>
            </Box>
            <Typography variant="body1" fontSize={12}>
              Max value
            </Typography>
          </Box>
          {/* ---------------------------------- BUTTON TO COMPUTE GRADIENT COLORATIONS ---------------------------------- */}
          <Button
            variant={colorationsContext.hasChanged ? "contained" : "outlined"}
            color="success"
            endIcon={<SendIcon />}
            onClick={() => generateGradientColorations()}
          >
            <Typography variant="body1" fontSize={10}>
              Compute gradient colorations
            </Typography>
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 1,
          maxHeight: windowSize.current[1] * 0.1,
        }}
        style={{
          overflow: "hidden",
          overflowY: "scroll", // added scroll
        }}
        flexWrap="wrap"
      >
        {colorationsContext.objects.map((object, i) => {
          return (
            <Box
              className="box-coloration"
              key={`leg-mean-${i}-${object.average}`}
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 2,
              }}
              onClick={(event) => handleClickInd(event, object)}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: 1,
                  backgroundColor: object.coloration,
                  border: "1px solid black",
                  m: 1,
                }}
              >
                <Popper
                  sx={{
                    position: "absolute",
                    zIndex: 100,
                  }}
                  id={idInd ? idInd : ""}
                  open={statePopperIndElements.open}
                  placement="bottom-start"
                  anchorEl={statePopperIndElements.anchorEl}
                >
                  <ClickAwayListener
                    onClickAway={() => handleClickAwayInd(true, "")}
                  >
                    <Box
                      className="box-coloration"
                      sx={{
                        width: 210,
                        bgcolor: "whitesmoke",
                        p: 1,
                        border: "1px solid black",
                      }}
                    >
                      <Typography
                        variant="body1"
                        fontSize={12}
                        fontStyle="italic"
                      >
                        Choose color for average{" "}
                        {statePopperIndElements.averageClicked}:
                      </Typography>
                      <Grid container spacing={0.2}>
                        {defaultColorations.map((color, i) => {
                          return (
                            <Grid item key={`color-${i}-${color}`} xs={1.3}>
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 1,
                                  backgroundColor: color,
                                  border: "1px solid black",
                                }}
                                onClick={() => handleClickAwayInd(false, color)}
                              />
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </ClickAwayListener>
                </Popper>
              </Box>
              <Typography variant="body1" fontSize={12}>
                {object.average}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LegendColorations;
