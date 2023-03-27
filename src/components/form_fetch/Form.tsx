import {
  Autocomplete,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  Modal,
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
import Title from "../styles_and_settings/Title";
import MainContext from "../../store/utils/main_context";
import CalculateIcon from "@mui/icons-material/Calculate";
import { blueGrey } from "@mui/material/colors";

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
  withConcave?: boolean;
  setWithConcave?: (value: boolean) => void;
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
  max: 9,
  step: 1,
  field: "",
};

const parseOrders = (orders: string): Array<number> => {
  const orders_array = orders.split(",");
  const orders_int = orders_array.map((order) => parseInt(order));
  return orders_int;
};

const Form = ({
  invariants,
  withOrders,
  withConcave,
  setWithConcave,
}: FormProps) => {
  const HEIGHTCARD = withOrders ? 125 : 100;
  const HEIGHTCARDCONSTRAINT = 200;

  const mainContext = useContext(MainContext);

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
    mainContext.reset();
    dispatchOrders({ type: OrdersAction.MIN, min: event.target.value });
  };

  const handleOrdersMax = (event: any) => {
    mainContext.reset();
    dispatchOrders({ type: OrdersAction.MAX, max: event.target.value });
  };

  const handleOrdersStep = (event: any) => {
    mainContext.reset();
    dispatchOrders({ type: OrdersAction.STEP, step: event.target.value });
  };

  const handleOrdersField = (event: any) => {
    mainContext.reset();
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

  // Main controllers (axis, coloration and concave hull)
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

  const handleChangeWithConcave = (value: boolean) => {
    mainContext.reset();
    if (setWithConcave) setWithConcave(value);
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

    if (withOrders && stateOrders.field === "") {
      alert("Please complete all the required fields");
      return;
    }

    if (withOrders) {
      const orders = parseOrders(stateOrders.field);
      mainContext.setOrders(orders);
    }
    setShowForm(false);
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
    if (withOrders) {
      problemDefinition += " (orders: ";
      problemDefinition += stateOrders.field;
      problemDefinition += ")";
    }
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
          <Typography variant="body1">
            {showForm ? "Hide problem definition" : "Show problem definition"}
          </Typography>
          {mainContext.isSubmit && !showForm && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body1" fontStyle="italic" fontSize={12}>
                {constructProblemDefinition()}
              </Typography>
            </Box>
          )}
        </Stack>
        <Collapse in={showForm} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            {/* X CARD */}
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
                  size="small"
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
            {/* Y CARD */}
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
                  size="small"
                />
              </Paper>
            </Grid>
            {/* COLOR CARD (phoeg app) OR ORDERS CARD (autoconjecture app) */}
            <Grid item xs={3.9}>
              {withOrders ? (
                <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
                  <Box sx={{ height: 40 }}>
                    <Typography variant="h6" align="center">
                      Orders*
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      sx={{ m: 1, width: "90%" }}
                      id="list"
                      label="Orders list"
                      value={stateOrders.field}
                      onChange={handleOrdersField}
                      size="small"
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button onClick={handleOpen}>
                      <Typography
                        variant="body1"
                        fontSize={10}
                        color={blueGrey[800]}
                      >
                        Generate automatically
                      </Typography>
                    </Button>
                  </Box>
                  <Modal
                    open={openModal}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        width: 500,
                        bgcolor: "whitesmoke",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        p: 2,
                        borderRadius: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ textAlign: "center" }}
                      >
                        Fill the fields to generate the orders automatically and
                        change this if necessary
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
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
                          size="small"
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
                          size="small"
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
                          size="small"
                        />
                        <Button
                          sx={{ m: 1, width: "25px" }}
                          variant="contained"
                          onClick={submitOrders}
                          color="success"
                          size="small"
                        >
                          <CalculateIcon />
                        </Button>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          sx={{ m: 1, width: "410px" }}
                          id="list"
                          label="Orders list"
                          value={stateOrders.field}
                          onChange={handleOrdersField}
                        />
                      </Box>
                    </Box>
                  </Modal>
                </Paper>
              ) : (
                <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
                  <Box sx={{ height: 40 }}>
                    <Typography
                      variant="h6"
                      align="center"
                      sx={{
                        color: showColoration
                          ? "text.primary"
                          : "text.disabled",
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
                    size="small"
                  />
                </Paper>
              )}
            </Grid>
          </Grid>

          {/* Concave hull option */}
          {withConcave !== undefined && setWithConcave !== undefined && (
            <Box sx={{ mt: 1, display: "flex", justifyContent: "center" }}>
              <Typography variant="body1">
                Do you want compute and show concave hull on your polytope ?
              </Typography>
              <Switch
                checked={withConcave}
                onChange={(event) => {
                  handleChangeWithConcave(event.target.checked);
                }}
                color="success"
                size="small"
                sx={{ ml: 1 }}
              />
            </Box>
          )}

          {/* CONSTRAINTS SUB FORM */}
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
                <Tooltip title="Warning! Reset constraints" placement="top">
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
                </Tooltip>
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
                          <Typography variant="body1" fontSize={10}>
                            Change to{" "}
                            {constraint.advancedMode ? "simple " : "advanced "}
                          </Typography>
                        </Button>
                      </Box>
                      {constraint.advancedMode ? (
                        // Advanced mode
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
                            size="small"
                          />
                        </Box>
                      ) : (
                        // Simple mode
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
                            size="small"
                          />
                          {constraint.type !== ConstraintTypes.NONE ? (
                            constraint.type === ConstraintTypes.BOOL ? (
                              // Bool constraint
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
                                  size="small"
                                />
                              </Box>
                            ) : (
                              // Number constraint
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
                                  size="small"
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
                                  size="small"
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
            // Submit mode
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
    </>
  );
};

export default Form;
