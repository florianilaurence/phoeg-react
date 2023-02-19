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
import React, { useContext, useReducer, useState } from "react";
import { Invariant } from "./Polytopes";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";
import RequestChartContext from "../../store/utils/request_chart_context";
import Inner from "../styles_and_settings/Inner";

const getType = (id: number): string => {
  if (id >= 2 && id <= 4) return "number";
  if (id === 5) return "bool";
  return "special";
};

enum ConstraintAction {
  ADD_CONSTRAINT,
  REMOVE_CONSTRAINT,
  CHANGE_NAME,
  CHANGE_MIN,
  CHANGE_MAX,
}

export interface FormProps {
  invariants: Array<Invariant>;
}

export interface Constraint {
  id: number;
  name: string;
  tablename: string;
  min: number;
  max: number;
  type: string;
}

const HEIGHTCARD = 125;

const Form: React.FC<FormProps> = ({ invariants }: FormProps) => {
  const requestChartContext = useContext(RequestChartContext);

  const [showForm, setShowForm] = useState(true);
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
          tablename: inv.tablename,
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
            item.tablename = new_constraint.tablename;
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

  const [constraints, dispatchConstraints] = useReducer(constraintsReducer, []);

  const handleCollapsed = () => {
    setShowForm((prev) => !prev);
  };

  const handleLabelX = (data: any) => {
    requestChartContext.handleIsSubmit(false);
    requestChartContext.handleLabelX(data);
  };

  const handleLabelY = (data: any) => {
    requestChartContext.handleIsSubmit(false);
    requestChartContext.handleLabelY(data);
  };

  const handleShowColoration = () => {
    requestChartContext.handleIsSubmit(false);
    setShowColoration((prev) => !prev);
    requestChartContext.handleLabelColor("");
  };

  const handleLabelColor = (data: any) => {
    requestChartContext.handleIsSubmit(false);
    requestChartContext.handleLabelColor(data);
  };

  const handleShowAdvanced = () => {
    requestChartContext.handleIsSubmit(false);
    setShowAdvanced((prev) => !prev);
  };

  const handleLabelAdvanced = (data: any) => {
    requestChartContext.handleIsSubmit(false);
    requestChartContext.handleAdvancedConstraints(data);
  };

  const handleRemoveConstraint = (id: number) => {
    requestChartContext.handleIsSubmit(false);
    dispatchConstraints({ type: ConstraintAction.REMOVE_CONSTRAINT, id });
  };

  const handleAddConstraint = () => {
    setCurrentId((prev) => prev + 1);
    requestChartContext.handleIsSubmit(false);
    dispatchConstraints({ type: ConstraintAction.ADD_CONSTRAINT });
  };

  const handleChangeName = (id: number, name: string | null) => {
    requestChartContext.handleIsSubmit(false);
    dispatchConstraints({ type: ConstraintAction.CHANGE_NAME, id, name });
  };

  const handleChangeMin = (id: number, min: string) => {
    requestChartContext.handleIsSubmit(false);
    dispatchConstraints({ type: ConstraintAction.CHANGE_MIN, id, min });
  };

  const handleChangeMax = (id: number, max: string) => {
    requestChartContext.handleIsSubmit(false);
    dispatchConstraints({ type: ConstraintAction.CHANGE_MAX, id, max });
  };

  const handleSwitch = (id: number, previous: number) => {
    requestChartContext.handleIsSubmit(false);
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

  const handleExchangeXY = () => {
    requestChartContext.handleIsSubmit(false);
    const labelY = requestChartContext.labelY;
    requestChartContext.handleLabelY(requestChartContext.labelX);
    requestChartContext.handleLabelX(labelY);
  };

  const handleSubmit = () => {
    if (
      requestChartContext.labelX === null ||
      requestChartContext.labelY === null ||
      requestChartContext.labelX === "" ||
      requestChartContext.labelY === ""
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
    requestChartContext.handleIsLoading(true);
    requestChartContext.handleConstraints(encodeConstraints());
    requestChartContext.handleIsSubmit(true);
  };

  const encodeConstraints = () => {
    let result = "";
    constraints.forEach((constraint: Constraint) => {
      result += constraint.tablename + " ";
      result += constraint.min + " ";
      result += constraint.max + ";";
    });
    return result;
  };

  const checkMainDifferent = () => {
    if (requestChartContext.labelX === requestChartContext.labelY) {
      return "The main labels must be different (X and Y)";
    } else if (showColoration) {
      if (requestChartContext.labelX === requestChartContext.labelColor) {
        return "The main labels must be different (X and Color)";
      } else if (
        requestChartContext.labelY === requestChartContext.labelColor
      ) {
        return "The main labels must be different (Y and Color)";
      }
    }
    return "";
  };

  return (
    <form>
      <Stack
        sx={{ mt: 1, mb: 1 }}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={1}
      >
        <Button
          variant={showForm ? "contained" : "outlined"}
          onClick={handleCollapsed}
          color="success"
        >
          {showForm ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </Button>
        <Inner>{showForm ? "Hide form" : "Show form"}</Inner>
      </Stack>
      <Collapse in={showForm} sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography variant="h6" align="center">
                  X-Axis*
                </Typography>
              </Box>
              <Autocomplete
                id="combo-box-demo"
                sx={{ m: 1 }}
                value={requestChartContext.labelX}
                onChange={(event, newValue) => handleLabelX(newValue)}
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
              onClick={handleExchangeXY}
              sx={{ cursor: "pointer" }}
            >
              <SyncAltIcon />
            </Box>
          </Grid>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography variant="h6" align="center">
                  Y-Axis*
                </Typography>
              </Box>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                value={requestChartContext.labelY}
                onChange={(event, newValue) => handleLabelY(newValue)}
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
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Box sx={{ height: 40 }}>
                <Typography
                  variant="h6"
                  align="center"
                  sx={{
                    color: showColoration ? "text.primary" : "text.disabled",
                    cursor: "pointer",
                  }}
                  onClick={handleShowColoration}
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
                value={requestChartContext.labelColor}
                onChange={(event, newValue) => handleLabelColor(newValue)}
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
                    cursor: "pointer",
                  }}
                  onClick={handleShowAdvanced}
                >
                  <Checkbox
                    checked={showAdvanced}
                    size="small"
                    color="success"
                  />
                  Advanced
                </Typography>
              </Box>
              <TextField
                disabled={!showAdvanced}
                sx={{ m: 1 }}
                value={requestChartContext.advancedConstraints}
                onChange={(event) => handleLabelAdvanced(event.target.value)}
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
                        sx={{ m: 1 }}
                        disableClearable
                        onChange={(e, value) =>
                          handleChangeName(constraint.id, value)
                        }
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
                            InputProps={{
                              inputProps: { min: constraint.min },
                            }}
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

export default Form;
