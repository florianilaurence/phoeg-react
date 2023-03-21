import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface SubTitleProps {
  subtitle: string;
}

const SubTitle = ({ subtitle }: SubTitleProps) => {
  return (
    <Divider textAlign="center" sx={{ m: 2 }}>
      <Typography variant="h4" style={{ color: blueGrey[800] }}>
        {subtitle}
      </Typography>
    </Divider>
  );
};

export default SubTitle;
