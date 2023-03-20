import {
  Grid,
  Paper,
  Typography,
  IconButton,
  Autocomplete,
  TextField,
  Stack,
  Divider,
  Switch,
} from "@mui/material";
import { useContext, useReducer, useState } from "react";
import MainContext from "../../store/utils/main_context";
import { Invariant } from "../polytopes/PolytopesSlider";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { getType } from "./Form";
import Inner from "../styles_and_settings/Inner";

export interface SubFormProps {
  invariants: Array<Invariant>;
}

const getConstraintType = (invariantId: number): ConstraintType => {
  if (invariantId >= 2 && invariantId <= 4) return ConstraintType.NUMBER;
  if (invariantId === 5) return ConstraintType.BOOL;
  if (invariantId === -1) return ConstraintType.SPECIAL;
  return ConstraintType.ADVANCED;
};

enum ConstraintAction {
  ADD_CONSTRAINT,
  REMOVE_CONSTRAINT,
  CHANGE_NAME,
  CHANGE_MIN,
  CHANGE_MAX,
}

enum ConstraintType {
  NUMBER,
  BOOL,
  SPECIAL,
  ADVANCED,
}

export interface Constraint {
  id: number;
  name: string;
  tablename: string;
  min: number;
  max: number;
  type: ConstraintType;
}

const optionsConstraint = [
  { value: "simple", label: "Simple constraint" },
  { value: "advanced", label: "Advanced constraint" },
];

const initialConstraint: Constraint = {
  id: 0,
  name: "",
  tablename: "",
  min: 0,
  max: 0,
  type: ConstraintType.NUMBER,
};

const HEIGHTCARD = 175;

const SubForm = ({ invariants }: SubFormProps) => {
  const mainContext = useContext(MainContext);

  const [currentId, setCurrentId] = useState(1);

  const constraintInvariant: Array<Invariant> = invariants.filter(
    (inv: Invariant) =>
      getType(inv.datatype) === "number" ||
      getType(inv.datatype) === "bool" ||
      getType(inv.datatype) === "special"
  );

  const getInvariantFromName = (name: string): Invariant => {
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
        const type = getConstraintType(inv.datatype);
        previous.push({
          id: currentId,
          name: inv.name,
          tablename: inv.tablename,
          min: type === ConstraintType.BOOL ? 1 : 0,
          max: 1,
          type: type,
        });
        return previous;
      case ConstraintAction.CHANGE_NAME:
        const new_constraint = getInvariantFromName(action.name as string);
        const new_state_name = state.map((item: Constraint) => {
          if (item.id === action.id) {
            const type = getConstraintType(new_constraint.datatype);
            item.name = new_constraint.name;
            item.tablename = new_constraint.tablename;
            item.type = type;
            item.min = type === ConstraintType.BOOL ? 1 : 0;
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

  const [constraints, dispatchConstraints] = useReducer(constraintsReducer, [
    initialConstraint,
  ]);

  const encodeConstraints = () => {
    let result = "";
    constraints.forEach((constraint: Constraint) => {
      result += constraint.tablename + " ";
      result += constraint.min + " ";
      result += constraint.max + ";";
    });
    return result;
  };

  return (
    <Grid container spacing={3} sx={{ mt: 1 }}>
      {constraints.map((constraint: Constraint) => {
        <Grid item xs={4} key={constraint.id}>
          <Paper
            elevation={1}
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: HEIGHTCARD,
            }}
          >
            <>
              {console.log(constraint)}
              <Autocomplete
                id="type-constraint"
                options={optionsConstraint}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} label="Type of constraint" />
                )}
              />
              {constraint.type === ConstraintType.ADVANCED && (
                <TextField
                  id="advanced-constraint"
                  label="Advanced constraint"
                  multiline
                  rows={4}
                />
              )}
            </>
          </Paper>
        </Grid>;
      })}
    </Grid>
  );
};

export default SubForm;
