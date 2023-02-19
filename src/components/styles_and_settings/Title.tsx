import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface TitleProps {
  title: string;
}

const Title: React.FC<TitleProps> = ({ title }: TitleProps) => {
  return (
    <Divider textAlign="right" sx={{ m: 1 }}>
      <Typography variant="h3" style={{ color: blueGrey[800] }}>
        {title}
      </Typography>
    </Divider>
  );
};

export default Title;
