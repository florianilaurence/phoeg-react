import { Box, Typography, Divider } from "@mui/material";
import { DirectionColors } from "../DrawConcave";
import { useContext } from "react";
import MainContext from "../../../store/contexts/main_context";

const LegendConcave = () => {
  const mainContext = useContext(MainContext);

  let dirsKeys: string[] = Object.keys(mainContext.concave!).filter(
    (dir) => mainContext.concave![dir].length > 1
  );

  return (
    <Box
      className="coloration-container"
      sx={{
        mt: 1,
      }}
    >
      <Typography variant="body1" fontSize={12} fontStyle="italic">
        Points families:
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 1,
        }}
      >
        {dirsKeys.map((dir, i) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mr: 1,
              }}
              key={`leg-dir-${dir}`}
            >
              <Typography
                variant="body1"
                fontSize={12}
                color={DirectionColors[dir]}
                fontWeight="bold"
              >
                {dir}
              </Typography>
              {i !== dirsKeys.length - 1 && (
                <Divider
                  sx={{
                    ml: 1,
                  }}
                  orientation="vertical"
                  variant="middle"
                  flexItem
                />
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LegendConcave;
