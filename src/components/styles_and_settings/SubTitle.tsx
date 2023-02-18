import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const SubTitle: React.FC = ({ children }) => {
  return (
    <Divider textAlign="center" sx={{ m: 1 }}>
      <Typography variant="h4" style={{ color: blueGrey[800] }}>
        {children}
      </Typography>
    </Divider>
  );
};

export default SubTitle;
