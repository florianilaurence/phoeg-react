import {
  Autocomplete,
  Button,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useReducer, useState } from "react";
import { InvariantsProps } from "./Polytopes";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import SendIcon from "@mui/icons-material/Send";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box } from "@mui/system";

type FormValues = {
  invariantX: string;
  invariantY: string;
  invariantColor: string;
  advanced: string;
  constraints: Array<Constraint>;
};

const Form: React.FC<InvariantsProps> = ({ invariants }: InvariantsProps) => {
  const [show, setShow] = useState(true);
  const [showColoration, setShowColoration] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [currentId, setCurrentId] = useState(0); // Unique id for each item (not change if add or remove item)

  const constraintsReducer = (state: any, action: any) => {
    console.log(action);
    switch (action.type) {
      case "REMOVE_ITEM":
        const new_state = state.filter(
          (item: Constraint) => item.id !== action.id
        );
        return new_state;
      case "ADD_ITEM":
        let previous = state;
        previous.push({
          id: currentId,
          name: "",
          min: 0,
          max: 0,
        });
        console.log(previous);
        return previous;
      default:
        throw new Error();
    }
  };

  const [constraints, dispatchConstraints] = useReducer(constraintsReducer, []);

  const HEIGHTCARD = 125;

  const getType = (id: number): string => {
    if (id >= 2 || id <= 4) return "number";
    if (id === 5) return "bool";
    return "special";
  };

  const handleChangeShow = () => {
    setShow((prev) => !prev);
  };

  const handleChangeShowColoration = () => {
    setShowColoration((prev) => !prev);
  };

  const handleChangeShowAdvanced = () => {
    setShowAdvanced((prev) => !prev);
  };

  const handleRemoveConstraint = (id: number) => {
    dispatchConstraints({ type: "REMOVE_ITEM", id });
  };

  const handleAddConstraint = () => {
    setCurrentId((prev) => prev + 1);
    dispatchConstraints({ type: "ADD_ITEM" });
  };

  const handleExchange = () => {
    console.log("Exchange");
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
      <Collapse in={show}>
        <Grid container spacing={2}>
          <Grid item xs={2.9}>
            <Paper elevation={3} sx={{ p: 1, height: HEIGHTCARD }}>
              <Typography variant="h6" align="center">
                X-Axis
              </Typography>

              <Autocomplete
                id="combo-box-demo"
                options={invariants
                  .filter((inv) => getType(inv.datatype) === "number")
                  .map((inv) => inv.name)}
                sx={{ m: 1 }}
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
              <Typography variant="h6" align="center">
                Y-Axis
              </Typography>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
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
              <Typography
                variant="h6"
                align="center"
                sx={{
                  color: showColoration ? "text.primary" : "text.disabled",
                }}
              >
                <Checkbox onChange={handleChangeShowColoration} size="small" />
                Coloration
              </Typography>
              <Autocomplete
                disabled={!showColoration}
                disablePortal
                id="combo-box-demo"
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
              <Typography
                variant="h6"
                align="center"
                sx={{ color: showAdvanced ? "text.primary" : "text.disabled" }}
              >
                <Checkbox onChange={handleChangeShowAdvanced} size="small" />
                Advanced
              </Typography>
              <TextField
                disabled={!showAdvanced}
                sx={{ m: 1 }}
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
                  <Typography variant="h6" align="center">
                    Constraint {index + 1}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveConstraint(constraint.id)}
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                  <Autocomplete
                    id="combo-box-demo"
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
            );
          })}
        </Grid>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 1, mb: 1 }}
        >
          <Button
            variant="outlined"
            onClick={handleAddConstraint}
            color="success"
            startIcon={<AddCircleOutlineIcon />}
          >
            Do you want add a constraint?
          </Button>

          <Button variant="contained" color="success" endIcon={<SendIcon />}>
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
}

interface FormProps {
  invariantX: string;
  invariantY: string;
  invariantColor: string;
  advancedConstraint: string;
  constraints: Constraint[];
}

export default Form;
