import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

export interface SubSubTitleProps {
  text: string;
}

const SubSubTitle: React.FC<SubSubTitleProps> = ({
  text,
}: SubSubTitleProps) => {
  return (
    <Divider textAlign="center" sx={{ m: 1 }}>
      <Typography variant="subtitle2" style={{ color: blueGrey[800] }}>
        {text}
      </Typography>
    </Divider>
  );
};

export default SubSubTitle;
