import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface SubTitleProps {
  subtitle: string;
}

const SubTitle: React.FC<SubTitleProps> = ({ subtitle }: SubTitleProps) => {
  return (
    <Divider textAlign="center" sx={{ m: 1 }}>
      <Typography variant="h4" style={{ color: blueGrey[800] }}>
        {subtitle}
      </Typography>
    </Divider>
  );
};

export default SubTitle;
