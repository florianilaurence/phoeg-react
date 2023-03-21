import {
  Autocomplete,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useReducer, useState } from "react";
import { Invariant } from "../polytopes/PolytopesSlider";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";
import Inner from "../styles_and_settings/Inner";
import Title from "../styles_and_settings/Title";
import Fetch from "./Fetch";
import MainContext from "../../store/utils/main_context";
import CalculateIcon from "@mui/icons-material/Calculate";

enum ConstraintTypes {
  NUMBER = "number",
  BOOL = "bool",
  SPECIAL = "special",
  ADVANCED = "advanced",
  NONE = "none",
}

export const getType = (id: number): string => {
  if (id >= 2 && id <= 4) return ConstraintTypes.NUMBER;
  if (id === 5) return ConstraintTypes.BOOL;
  return ConstraintTypes.SPECIAL;
};

export interface FormProps {
  invariants: Array<Invariant>;
  withOrders: boolean;
}

enum ConstraintAction {
  ADD_CONSTRAINT,
  REMOVE_CONSTRAINT,
  CHANGE_NAME,
  CHANGE_MIN,
  CHANGE_MAX,
  CHANGE_ADVANCED_MODE,
  CHANGE_ADVANCED_FIELD,
  RESET_CONSTRAINTS,
}

export interface Constraint {
  id: number;
  name: string;
  tablename: string;
  min: number;
  max: number;
  type: string;
  advancedMode: boolean;
  advancedField: string;
}

const initialConstraint = (id: number): Constraint => {
  return {
    id: id,
    name: "",
    tablename: "",
    min: 0,
    max: 0,
    type: ConstraintTypes.NONE,
    advancedMode: false,
    advancedField: "",
  };
};

enum OrdersAction {
  MIN,
  MAX,
  STEP,
  FIELD,
}

interface Orders {
  min: number;
  max: number;
  step: number;
  field: string;
}

const initialOrders = {
  min: 1,
  max: 1,
  step: 1,
  field: "",
};

const HEIGHTCARD = 125;
const HEIGHTCARDCONSTRAINT = 250;

const Form = ({ invariants, withOrders }: FormProps) => {
  const mainContext = useContext(MainContext);

  const [currentId, setCurrentId] = useState(1); // Unique id for each item (not change if add or remove item)
  const [showForm, setShowForm] = useState(true);
  const [showColoration, setShowColoration] = useState(false);
  const [showConstrSubForm, setShowConstrSubForm] = useState(false);

  const constraintInvariant: Array<Invariant> = invariants.filter(
    (inv: Invariant) =>
      getType(inv.datatype) === ConstraintTypes.NUMBER ||
      getType(inv.datatype) === ConstraintTypes.BOOL ||
      getType(inv.datatype) === ConstraintTypes.SPECIAL
  );

  const getConstraintFromName = (name: string): Invariant => {
    return constraintInvariant.find((inv) => inv.name === name) as Invariant;
  };

  // Orders reducer
  const ordersReducer = (state: Orders, action: any) => {
    switch (action.type) {
      case OrdersAction.MIN:
        return { ...state, min: +action.min }; // +action.min to convert string to number (if not, it's maybe a string)
      case OrdersAction.MAX:
        return { ...state, max: +action.max };
      case OrdersAction.STEP:
        return { ...state, step: +action.step };
      case OrdersAction.FIELD:
        return { ...state, field: action.field };
      default:
        return state;
    }
  };

  const [stateOrders, dispatchOrders] = useReducer(
    ordersReducer,
    initialOrders
  );

  // Orders controllers

  const handleOrdersMin = (event: any) => {
    dispatchOrders({ type: OrdersAction.MIN, min: event.target.value });
  };

  const handleOrdersMax = (event: any) => {
    dispatchOrders({ type: OrdersAction.MAX, max: event.target.value });
  };

  const handleOrdersStep = (event: any) => {
    dispatchOrders({ type: OrdersAction.STEP, step: event.target.value });
  };

  const handleOrdersField = (event: any) => {
    dispatchOrders({ type: OrdersAction.FIELD, field: event.target.value });
  };

  const submitOrders = () => {
    const orders: Array<number> = [];
    for (let i = stateOrders.min; i <= stateOrders.max; i += stateOrders.step) {
      orders.push(i);
    }
    dispatchOrders({ type: OrdersAction.FIELD, field: orders.join(", ") });
  };

  // Constraints reducer
  const constraintsReducer = (state: any, action: any) => {
    switch (action.type) {
      case ConstraintAction.REMOVE_CONSTRAINT:
        const new_state = state.filter(
          (item: Constraint) => item.id !== action.id
        );
        return new_state;

      case ConstraintAction.ADD_CONSTRAINT:
        let previous = state;
        previous.push(initialConstraint(currentId));
        return previous;

      case ConstraintAction.CHANGE_NAME:
        const new_constraint = getConstraintFromName(action.name as string);
        const new_state_name = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.name = new_constraint.name;
            item.tablename = new_constraint.tablename;
            item.type = getType(new_constraint.datatype);
            item.min = item.type === ConstraintTypes.BOOL ? 1 : 0;
            item.max = 1;
          }
          return item;
        });
        return new_state_name;

      case ConstraintAction.CHANGE_MIN:
        const new_state_min = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.min = parseFloat(action.min);
          }
          return item;
        });
        return new_state_min;

      case ConstraintAction.CHANGE_MAX:
        const new_state_max = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.max = parseFloat(action.max);
          }
          return item;
        });
        return new_state_max;

      case ConstraintAction.CHANGE_ADVANCED_MODE:
        const new_state_advanced_mode = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.advancedMode = action.advancedMode;
            item.type = action.newType;
          }
          return item;
        });
        return new_state_advanced_mode;

      case ConstraintAction.CHANGE_ADVANCED_FIELD:
        const new_state_advanced = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.advancedField = action.advancedField;
          }
          return item;
        });
        return new_state_advanced;

      case ConstraintAction.RESET_CONSTRAINTS:
        setCurrentId(1);
        return [initialConstraint(1)];

      default:
        throw new Error();
    }
  };

  const [constraints, dispatchConstraints] = useReducer(constraintsReducer, [
    initialConstraint(1),
  ]);

  // Constraints controllers
  const handleChangeName = (id: number, name: string) => {
    mainContext.reset();
    dispatchConstraints({ type: ConstraintAction.CHANGE_NAME, id, name });
  };

  const handleChangeMin = (id: number, min: string) => {
    mainContext.reset();
    dispatchConstraints({ type: ConstraintAction.CHANGE_MIN, id, min });
  };

  const handleChangeMax = (id: number, max: string) => {
    mainContext.reset();
    dispatchConstraints({ type: ConstraintAction.CHANGE_MAX, id, max });
  };

  const handleActiveConstraint = (id: number, previous: number) => {
    mainContext.reset();
    dispatchConstraints({
      type: ConstraintAction.CHANGE_MIN,
      id,
      min: previous === 0 ? 1 : 0,
    });
    dispatchConstraints({
      type: ConstraintAction.CHANGE_MAX,
      id,
      max: previous === 0 ? 1 : 0,
    });
  };

  const handleAddConstraint = () => {
    mainContext.reset();
    setCurrentId((prev) => prev + 1);
    dispatchConstraints({ type: ConstraintAction.ADD_CONSTRAINT });
  };

  const handleRemoveConstraint = (id: number) => {
    mainContext.reset();
    dispatchConstraints({ type: ConstraintAction.REMOVE_CONSTRAINT, id });
  };

  const resetConstraints = () => {
    mainContext.reset();
    dispatchConstraints({ type: ConstraintAction.RESET_CONSTRAINTS });
  };

  const handleAdvancedMode = (id: number, previousMode: boolean) => {
    mainContext.reset();
    dispatchConstraints({
      type: ConstraintAction.CHANGE_ADVANCED_MODE,
      id: id,
      advancedMode: !previousMode,
      newType: previousMode ? ConstraintTypes.NONE : ConstraintTypes.ADVANCED,
    });
  };

  const handleChangeAdvancedField = (id: number, field: string) => {
    mainContext.reset();
    dispatchConstraints({
      type: ConstraintAction.CHANGE_ADVANCED_FIELD,
      id,
      advancedField: field,
    });
  };

  // Axis and coloration controllers
  const handleChangeX = (value: string) => {
    mainContext.reset();
    mainContext.setLabelX(value);
  };

  const handleChangeY = (value: string) => {
    mainContext.reset();
    mainContext.setLabelY(value);
  };

  const handleChangeColoration = (value: string) => {
    mainContext.reset();
    mainContext.setLabelColor(value);
  };

  const handleExchangeXY = () => {
    mainContext.reset();
    const labelY = mainContext.labelY;
    mainContext.setLabelY(mainContext.labelX);
    mainContext.setLabelX(labelY);
  };

  const handleShowColoration = (value: boolean) => {
    mainContext.reset();
    setShowColoration(value);
  };

  // Submit controllers and annex functions
  const handleSubmit = () => {
    if (
      mainContext.labelX === null ||
      mainContext.labelY === null ||
      mainContext.labelX === "" ||
      mainContext.labelY === ""
    ) {
      alert("Please complete all the required fields");
      return;
    }
    const messageError = checkMainDifferent();
    if (messageError !== "") {
      alert(messageError);
      return;
    }

    setShowForm(false);
    mainContext.setIsLoading(true);
    let { encodedConstraints, encodedAdvanced } = encodeConstraints();
    mainContext.setConstraints(encodedConstraints);
    mainContext.setAdvancedConstraints(encodedAdvanced);
    mainContext.setIsSubmit(true);
  };

  // TODO: add a check for the advanced mode and separete the advanced mode from the normal mode **
  const encodeConstraints = () => {
    let encodedConstraints = "";
    let encodedAdvanced = "";

    constraints.forEach((constraint: Constraint) => {
      if (
        constraint.type !== ConstraintTypes.NONE &&
        constraint.type !== ConstraintTypes.ADVANCED &&
        constraint.name !== ""
      ) {
        encodedConstraints += constraint.tablename + " ";
        encodedConstraints += constraint.min + " ";
        encodedConstraints += constraint.max + ";";
      } else if (constraint.advancedMode) {
        encodedAdvanced += constraint.advancedField + ";";
      }
    });
    return { encodedConstraints, encodedAdvanced };
  };

  const checkMainDifferent = () => {
    if (mainContext.labelX === mainContext.labelY) {
      return "The main labels must be different (X and Y)";
    } else if (showColoration) {
      if (mainContext.labelX === mainContext.labelColor) {
        return "The main labels must be different (X and Color)";
      } else if (mainContext.labelY === mainContext.labelColor) {
        return "The main labels must be different (Y and Color)";
      }
    }
    return "";
  };

  // Syntax for the problem definition
  const constructProblemDefinition = () => {
    let problemDefinition = "";
    problemDefinition += mainContext.labelX;
    problemDefinition += " ╳ ";
    problemDefinition += mainContext.labelY;
    if (showColoration) {
      problemDefinition += " (";
      problemDefinition += mainContext.labelColor;
      problemDefinition += ")";
    }
    if (mainContext.constraints !== "") {
      problemDefinition += " || ";
      problemDefinition += mainContext.constraints;
    }
    if (mainContext.advancedConstraints !== "") {
      problemDefinition += " // ";
      problemDefinition += mainContext.advancedConstraints;
    }
    return problemDefinition;
  };

  // Render
  return (
    <>
      <form>
        <Title title="Problem definition" />
        <Stack
          sx={{ mt: 1, mb: 1 }}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={1}
        >
          <Button
            variant={showForm ? "contained" : "outlined"}
            onClick={() => {
              setShowForm((prev) => !prev);
            }}
            color="success"
          >
            {showForm ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </Button>
          <Inner>
            {showForm ? "Hide problem definition" : "Show problem definition"}
          </Inner>
          {mainContext.isSubmit && (
            <Box sx={{ ml: 2 }}>
              <Inner italic size={12}>
                {constructProblemDefinition()}
              </Inner>
            </Box>
          )}
        </Stack>
        <Collapse in={showForm} sx={{ mb: 2 }}>
          {withOrders && (
            <>
              <Paper elevation={5}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" align="center">
                    Orders
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      direction: "row",
                      justifyContent: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: 1, width: "100px" }}
                      id="min"
                      label="Min"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                      }}
                      value={stateOrders.min}
                      onChange={handleOrdersMin}
                    />
                    <TextField
                      sx={{ m: 1, width: "100px" }}
                      id="max"
                      label="Max"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                      }}
                      value={stateOrders.max}
                      onChange={handleOrdersMax}
                    />
                    <TextField
                      sx={{ m: 1, width: "100px" }}
                      id="step"
                      label="Step"
                      type="number"
                      InputProps={{
                        inputProps: { min: 1, max: 10 },
                      }}
                      value={stateOrders.step}
                      onChange={handleOrdersStep}
                    />
                    <Button
                      sx={{ m: 1 }}
                      variant="contained"
                      onClick={submitOrders}
                      color="success"
                    >
                      <CalculateIcon />
                    </Button>
                    <TextField
                      sx={{ m: 1, width: "250px" }}
                      id="list"
                      label="Orders list"
                      value={stateOrders.field}
                      onChange={handleOrdersField}
                    />
                  </Box>
                </Box>
              </Paper>
              <Divider sx={{ mt: 2, mb: 2 }} />
            </>
          )}
          <Grid container spacing={2}>
            <Grid item xs={3.9}>
              <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
                <Box sx={{ height: 40 }}>
                  <Typography variant="h6" align="center">
                    X-Axis*
                  </Typography>
                </Box>
                <Autocomplete
                  id="combo-box-demo"
                  sx={{ m: 1 }}
                  value={mainContext.labelX}
                  onChange={(event, newValue) =>
                    handleChangeX(newValue as string)
                  }
                  options={invariants
                    .filter((inv) => getType(inv.datatype) === "number")
                    .map((inv) => inv.name)}
                  renderInput={(params) => (
                    <TextField {...params} label="Invariant X" />
                  )}
                />
              </Paper>
            </Grid>
            <Grid item xs={0.3}>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height={HEIGHTCARD}
                onClick={handleExchangeXY}
                sx={{ cursor: "pointer" }}
              >
                <SyncAltIcon />
              </Box>
            </Grid>
            <Grid item xs={3.9}>
              <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
                <Box sx={{ height: 40 }}>
                  <Typography variant="h6" align="center">
                    Y-Axis*
                  </Typography>
                </Box>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  value={mainContext.labelY}
                  onChange={(event, newValue) =>
                    handleChangeY(newValue as string)
                  }
                  options={invariants
                    .filter((inv) => getType(inv.datatype) === "number")
                    .map((inv) => inv.name)}
                  sx={{ m: 1 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Invariant Y" />
                  )}
                />
              </Paper>
            </Grid>
            <Grid item xs={3.9}>
              <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
                <Box sx={{ height: 40 }}>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      color: showColoration ? "text.primary" : "text.disabled",
                      cursor: "pointer",
                    }}
                    onClick={() => handleShowColoration(!showColoration)}
                  >
                    <Checkbox
                      checked={showColoration}
                      size="small"
                      color="success"
                    />
                    Coloration
                  </Typography>
                </Box>
                <Autocomplete
                  disabled={!showColoration}
                  disablePortal
                  id="combo-box-demo"
                  value={mainContext.labelColor}
                  onChange={(event, newValue) =>
                    handleChangeColoration(newValue as string)
                  }
                  options={invariants
                    .filter(
                      (inv) =>
                        getType(inv.datatype) === "number" ||
                        getType(inv.datatype) === "bool" ||
                        getType(inv.datatype) === "special"
                    )
                    .map((inv) => inv.name)}
                  sx={{ m: 1 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Invariant color" />
                  )}
                />
              </Paper>
            </Grid>
          </Grid>

          {showConstrSubForm ? (
            <Box>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={
                    showConstrSubForm ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  onClick={() => {
                    resetConstraints();
                    setShowConstrSubForm(!showConstrSubForm);
                  }}
                >
                  {showConstrSubForm ? "Hide" : "Show"} constraints
                </Button>
                <Button
                  variant="outlined"
                  color="success"
                  endIcon={<AddCircleOutlineIcon />}
                  onClick={handleAddConstraint}
                >
                  Add constraint
                </Button>
              </Box>

              <Grid container spacing={2}>
                {constraints.map((constraint: Constraint, index: number) => (
                  <Grid item xs={4} key={constraint.id}>
                    <Paper
                      elevation={1}
                      sx={{ p: 1, height: HEIGHTCARDCONSTRAINT }}
                    >
                      <Box
                        sx={{
                          height: 40,
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <Typography variant="h6" align="center">
                          {constraint.advancedMode ? "Advanced" : "Simple"}{" "}
                          constraint #{index + 1}
                        </Typography>
                        <Tooltip title="Remove this constraint">
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleRemoveConstraint(constraint.id)
                            }
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Divider sx={{ mt: 1, mb: 1 }} />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleAdvancedMode(
                              constraint.id,
                              constraint.advancedMode
                            )
                          }
                        >
                          <Inner size={10}>
                            Change to{" "}
                            {constraint.advancedMode ? "simple " : "advanced "}
                          </Inner>
                        </Button>
                      </Box>
                      {constraint.advancedMode ? (
                        <Box>
                          <TextField
                            sx={{ ml: 1, mr: 1, mt: 1, width: "95%" }}
                            label="Enter your expression"
                            multiline
                            rows="4"
                            onChange={(event) =>
                              handleChangeAdvancedField(
                                constraint.id,
                                event.target.value
                              )
                            }
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            value={constraint.name}
                            onChange={(event, newValue) =>
                              handleChangeName(
                                constraint.id,
                                newValue === null ? "" : newValue
                              )
                            }
                            options={constraintInvariant.map((inv) => inv.name)}
                            sx={{ m: 1 }}
                            renderInput={(params) => (
                              <TextField {...params} label="Invariant" />
                            )}
                          />
                          {constraint.type !== ConstraintTypes.NONE ? (
                            constraint.type === ConstraintTypes.BOOL ? (
                              <Box
                                sx={{
                                  mt: 2,
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <Switch
                                  checked={constraint.min === 1}
                                  onChange={() => {
                                    handleActiveConstraint(
                                      constraint.id,
                                      constraint.min
                                    );
                                  }}
                                  color="success"
                                />
                              </Box>
                            ) : (
                              <Box
                                sx={{
                                  m: 1,
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                <TextField
                                  sx={{ m: 1, width: "50%" }}
                                  id="min"
                                  label="Min"
                                  type="number"
                                  InputProps={{
                                    inputProps: { min: 0, max: constraint.max },
                                  }}
                                  value={constraint.min}
                                  onChange={(e) =>
                                    handleChangeMin(
                                      constraint.id,
                                      e.target.value
                                    )
                                  }
                                />
                                <TextField
                                  sx={{ m: 1, width: "50%" }}
                                  id="max"
                                  label="Max"
                                  type="number"
                                  InputProps={{
                                    inputProps: { min: constraint.min },
                                  }}
                                  value={constraint.max}
                                  onChange={(e) =>
                                    handleChangeMax(
                                      constraint.id,
                                      e.target.value
                                    )
                                  }
                                />
                              </Box>
                            )
                          ) : null}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Divider sx={{ mt: 2, mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={
                    showConstrSubForm ? (
                      <KeyboardArrowUpIcon />
                    ) : (
                      <KeyboardArrowDownIcon />
                    )
                  }
                  onClick={() => setShowConstrSubForm(!showConstrSubForm)}
                >
                  {showConstrSubForm ? "Hide" : "Show"} constraints
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
        </Collapse>
      </form>
      {mainContext.isSubmit && <Fetch invariants={invariants} />}
    </>
  );
};

export default Form;
