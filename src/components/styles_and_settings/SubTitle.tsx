import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface SubTitleProps {
  size?: number;
  children: React.ReactNode;
}

const SubTitle = ({ size = 20, children }: SubTitleProps) => {
  return (
    <Divider textAlign="center" sx={{ m: 2 }}>
      <Typography variant="h4" style={{ color: blueGrey[800], fontSize: size }}>
        {children}
      </Typography>
    </Divider>
  );
};

export default SubTitle;
