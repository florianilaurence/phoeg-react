import { Box, Divider, Grid, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface SubSubTitleProps {
  annex: string;
  children: React.ReactNode;
}

const SubSubTitle = ({ annex, children }: SubSubTitleProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={11.2}>
        <Divider textAlign="center" sx={{ m: 1 }}>
          <Typography variant="subtitle2" style={{ color: blueGrey[800] }}>
            {children}
          </Typography>
        </Divider>
      </Grid>
      <Grid item xs={0.7} sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          fontSize={12}
          style={{ color: blueGrey[800] }}
        >
          {annex}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default SubSubTitle;
