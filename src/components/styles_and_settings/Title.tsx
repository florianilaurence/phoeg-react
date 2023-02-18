import { Divider, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const Title: React.FC = ({ children }) => {
  return (
    <Divider textAlign="right" sx={{ m: 1 }}>
      <Typography variant="h3" style={{ color: blueGrey[800] }}>
        {children}
      </Typography>
    </Divider>
  );
};

export default Title;
