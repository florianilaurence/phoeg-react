import { Grid, Paper } from "@mui/material";

const OrderForm = () => {
  //TODO: Implement the specific form for select list of orders (min - max - step - textfield with list of values {regex})
  return (
    <Paper elevation={3}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          min
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          max
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          step
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          list
        </Grid>
      </Grid>
    </Paper>
  );
};

export default OrderForm;
