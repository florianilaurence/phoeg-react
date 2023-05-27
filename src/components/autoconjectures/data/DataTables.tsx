import MainContext from "../../../store/contexts/main_context";
import { useContext } from "react";
import { Grid } from "@mui/material";
import TableDirection from "./TableDirection";
import { ToPrintProps } from "../NewWindow";

const DataTables = ({ isToPrint }: ToPrintProps) => {
  const mainContext = useContext(MainContext);

  if (mainContext.concaves === undefined) {
    return null;
  } else {
    const keys = Object.keys(mainContext.concaves);

    return (
      <Grid container spacing={1}>
        {keys.map((key) => {
          return (
            <Grid item xs={4} key={`table-${key}`}>
              <TableDirection
                isToPrint={isToPrint}
                title={key}
                data={mainContext.concaves![key]}
              />
            </Grid>
          );
        })}
      </Grid>
    );
  }
};

export default DataTables;
