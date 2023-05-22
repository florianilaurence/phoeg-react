import MainContext from "../../../store/contexts/main_context";
import { useContext } from "react";
import { Grid } from "@mui/material";
import TableDirection from "./TableDirection";

const DataTables = () => {
  const mainContext = useContext(MainContext);

  const keys = Object.keys(mainContext.concaves);

  return (
    <Grid container spacing={1}>
      {keys.map((key) => {
        return (
          <Grid item xs={4} key={`table-${key}`}>
            <TableDirection title={key} data={mainContext.concaves[key]} />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default DataTables;
