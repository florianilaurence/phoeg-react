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
  Typography,
} from "@mui/material";
import React, { useReducer, useState } from "react";
import { Invariant, InvariantsProps } from "./Polytopes";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";
import { Context } from "../context";

type FormValues = {
  invariantX: string;
  invariantY: string;
  invariantColor: string;
  advanced: string;
};

enum ConstraintAction {
  ADD_CONSTRAINT,
  REMOVE_CONSTRAINT,
  CHANGE_NAME,
  CHANGE_MIN,
  CHANGE_MAX,
}

const getType = (id: number): string => {
  if (id >= 2 && id <= 4) return "number";
  if (id === 5) return "bool";
  return "special";
};

const Form: React.FC<InvariantsProps> = ({ invariants }: InvariantsProps) => {
  const context = React.useContext(Context);

  const [show, setShow] = useState(true);
  const [showColoration, setShowColoration] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [currentId, setCurrentId] = useState(0); // Unique id for each item (not change if add or remove item)

  const constraintInvariant: Array<Invariant> = invariants.filter(
    (inv) =>
      getType(inv.datatype) === "number" ||
      getType(inv.datatype) === "bool" ||
      getType(inv.datatype) === "special"
  );

  const getConstraintFromName = (name: string): Invariant => {
    return constraintInvariant.find((inv) => inv.name === name) as Invariant;
  };

  const constraintsReducer = (state: any, action: any) => {
    switch (action.type) {
      case ConstraintAction.REMOVE_CONSTRAINT:
        const new_state = state.filter(
          (item: Constraint) => item.id !== action.id
        );
        return new_state;
      case ConstraintAction.ADD_CONSTRAINT:
        let previous = state;
        const inv = constraintInvariant[previous.length];
        const type = getType(inv.datatype);
        previous.push({
          id: currentId,
          name: inv.name,
          min: type === "bool" ? 1 : 0,
          max: 1,
          type: type,
        });
        return previous;
      case ConstraintAction.CHANGE_NAME:
        const new_constraint = getConstraintFromName(action.name as string);
        const new_state_name = state.map((item: Constraint) => {
          if (item.id === action.id) {
            item.name = new_constraint.name;
            item.type = getType(new_constraint.datatype);
            item.min = item.type === "bool" ? 1 : 0;
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
      default:
        throw new Error();
    }
  };

  const formReducer = (state: FormValues, action: any) => {
    switch (action.type) {
      case "invariantX":
        return { ...state, invariantX: action.value };
      case "invariantY":
        return { ...state, invariantY: action.value };
      case "invariantColor":
        return { ...state, invariantColor: action.value };
      case "advanced":
        return { ...state, advanced: action.value };
      default:
        throw new Error();
    }
  };

  const [constraints, dispatchConstraints] = useReducer(constraintsReducer, []);

  const [formValues, dispatchFormValues] = useReducer(formReducer, {
    invariantX: "",
    invariantY: "",
    invariantColor: "",
    advanced: "",
  });

  const HEIGHTCARD = 125;

  const handleChangeShow = () => {
    setShow((prev) => !prev);
  };

  const handleChangeShowColoration = () => {
    setShowColoration((prev) => !prev);
    dispatchFormValues({ type: "invariantColor", value: "" });
  };

  const handleChangeShowAdvanced = () => {
    setShowAdvanced((prev) => !prev);
    dispatchFormValues({ type: "advanced", value: "" });
  };

  const handleRemoveConstraint = (id: number) => {
    dispatchConstraints({ type: ConstraintAction.REMOVE_CONSTRAINT, id });
  };

  const handleAddConstraint = () => {
    setCurrentId((prev) => prev + 1);
    dispatchConstraints({ type: ConstraintAction.ADD_CONSTRAINT });
  };

  const handleChangeName = (id: number, name: string | null) => {
    dispatchConstraints({ type: ConstraintAction.CHANGE_NAME, id, name });
  };

  const handleChangeMin = (id: number, min: string) => {
    dispatchConstraints({ type: ConstraintAction.CHANGE_MIN, id, min });
  };

  const handleChangeMax = (id: number, max: string) => {
    dispatchConstraints({ type: ConstraintAction.CHANGE_MAX, id, max });
  };

  const handleChangeX = (name: string | null) => {
    dispatchFormValues({ type: "invariantX", value: name });
  };

  const handleChangeY = (name: string | null) => {
    dispatchFormValues({ type: "invariantY", value: name });
  };

  const handleChangeColor = (name: string | null) => {
    dispatchFormValues({ type: "invariantColor", value: name });
  };

  const handleChangeAdvanced = (name: string | null) => {
    dispatchFormValues({ type: "advanced", value: name });
  };

  const handleSwitch = (id: number, previous: number) => {
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

  const handleExchange = () => {
    const currentY = formValues.invariantY;
    dispatchFormValues({ type: "invariantY", value: formValues.invariantX });
    dispatchFormValues({ type: "invariantX", value: currentY });
  };

  const handleSubmit = () => {
    if (
      formValues.invariantX === null ||
      formValues.invariantX === undefined ||
      formValues.invariantY === null ||
      formValues.invariantY === undefined ||
      (showColoration &&
        (formValues.invariantColor === null ||
          formValues.invariantColor === undefined)) ||
      (showAdvanced &&
        (formValues.advanced === null || formValues.advanced === undefined))
    ) {
      alert("Please fill in all fields");
      return;
    }
    context.labelX = formValues.invariantX;
    context.labelY = formValues.invariantY;
    context.labelColor = formValues.invariantColor;
    context.advancedConstraints = formValues.advanced;
    context.constraints = constraints;
  };

  return (
    <form>
      <Box sx={{ mt: 1, mb: 1 }}>
        <Button
          variant={show ? "outlined" : "contained"}
          onClick={handleChangeShow}
          color="success"
        >
          {show ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>

        {show ? "Hide form" : "Show form"}
      </Box>
      <Collapse in={show} sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography variant="h6" align="center">
                  X-Axis
                </Typography>
              </Box>
              <Autocomplete
                id="combo-box-demo"
                sx={{ m: 1 }}
                value={formValues.invariantX}
                onChange={(event, newValue) => {
                  handleChangeX(newValue);
                }}
                options={invariants
                  .filter((inv) => getType(inv.datatype) === "number")
                  .map((inv) => inv.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Invariant X" />
                )}
              />
            </Paper>
          </Grid>
          <Grid item xs={0.4}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height={HEIGHTCARD}
              onClick={handleExchange}
            >
              <SyncAltIcon />
            </Box>
          </Grid>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography variant="h6" align="center">
                  Y-Axis
                </Typography>
              </Box>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={formValues.invariantY}
                onChange={(event, newValue) => {
                  handleChangeY(newValue);
                }}
                options={invariants
                  .filter((inv) => getType(inv.datatype) === "number")
                  .map((inv) => inv.name)}
                sx={{ m: 1 }}
                renderInput={(params) => (
                  <TextField {...params} label="Invariant Y" />
                )}
              />
            </Paper>{" "}
          </Grid>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: showColoration ? "text.primary" : "text.disabled",
                  }}
                >
                  <Checkbox
                    onChange={handleChangeShowColoration}
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
                value={formValues.invariantColor}
                onChange={(event, newValue) => {
                  handleChangeColor(newValue);
                }}
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
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: showAdvanced ? "text.primary" : "text.disabled",
                  }}
                >
                  <Checkbox
                    onChange={handleChangeShowAdvanced}
                    size="small"
                    color="success"
                  />
                  Advanced
                </Typography>
              </Box>
              <TextField
                disabled={!showAdvanced}
                sx={{ m: 1 }}
                value={formValues.advanced}
                onChange={(event) => {
                  handleChangeAdvanced(event.target.value);
                }}
                id="advanced-constraint"
                label="Advanced constraint"
              />
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 1 }}>
          {constraints.map((constraint: Constraint, index: number) => {
            return (
              <Grid item sm={4} key={constraint.id}>
                <Paper
                  elevation={6}
                  sx={{ p: 1, height: HEIGHTCARD * 1.5 }}
                  square
                >
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography variant="h6" align="center">
                        Constraint {index + 1}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton
                        onClick={() => handleRemoveConstraint(constraint.id)}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={12}>
                      <Autocomplete
                        id="combo-box-demo"
                        options={constraintInvariant.map((inv) => inv.name)}
                        value={constraint.name}
                        onChange={(e, value) =>
                          handleChangeName(constraint.id, value)
                        }
                        sx={{ m: 1 }}
                        renderInput={(params) => (
                          <TextField {...params} label="Invariant color" />
                        )}
                      />
                    </Grid>
                    {constraint.type === "number" ||
                    constraint.type === "special" ? (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Stack
                          direction={{ xs: "column", sm: "row" }}
                          spacing={{ xs: 1, sm: 2, md: 2 }}
                          divider={<Divider orientation="vertical" flexItem />}
                          alignItems="center"
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
                              handleChangeMin(constraint.id, e.target.value)
                            }
                          />
                          <TextField
                            sx={{ m: 1, width: "50%" }}
                            id="max"
                            label="Max"
                            type="number"
                            InputProps={{ inputProps: { min: constraint.min } }}
                            value={constraint.max}
                            onChange={(e) =>
                              handleChangeMax(constraint.id, e.target.value)
                            }
                          />
                        </Stack>
                      </Grid>
                    ) : (
                      <Grid
                        item
                        xs={12}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Switch
                          checked={constraint.min === 1}
                          onChange={() =>
                            handleSwitch(constraint.id, constraint.min)
                          }
                          color="success"
                        />
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2, mb: 1 }}
        >
          <Button
            variant="outlined"
            onClick={handleAddConstraint}
            color="success"
            startIcon={<AddCircleOutlineIcon />}
          >
            Do you want add a constraint?
          </Button>

          <Button
            variant="contained"
            color="success"
            endIcon={<SendIcon />}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Stack>
      </Collapse>
    </form>
  );
};

interface Constraint {
  id: number;
  name: string;
  min: number;
  max: number;
  type: string;
}

export default Form;
