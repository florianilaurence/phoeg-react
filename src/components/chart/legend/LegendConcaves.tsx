import { Box, Typography, Tooltip, Button, Divider } from "@mui/material";
import { DirectionColors } from "../DrawConcave";
import { useContext, useEffect } from "react";
import MainContext from "../../../store/contexts/main_context";
import { containsCoordinate } from "../../form_fetch/Fetch";

interface LegendAutoAppProps {
  currentIndexOrder: number;
}

const LegendConcaves = ({ currentIndexOrder }: LegendAutoAppProps) => {
  const mainContext = useContext(MainContext);

  let dirsKeys: string[] = Object.keys(
    mainContext.concaveList[currentIndexOrder]
  ).filter((dir) => mainContext.concaveList[currentIndexOrder][dir].length > 1);

  const onClickLegendConcave = (key: string) => {
    const previousSubPointsClicked =
      mainContext.pointsClicked[currentIndexOrder!];
    const concaveSelected = mainContext.concaveList[currentIndexOrder!][key];

    for (const point of concaveSelected) {
      if (!point.clicked) {
        point.clicked = true;
        previousSubPointsClicked.push(point);
      }
    }

    const previousSimplifiedPoints = mainContext.simplifiedPoints;

    for (const point of previousSimplifiedPoints[currentIndexOrder!]) {
      if (containsCoordinate(previousSubPointsClicked, point)) {
        point.clicked = true;
      }
    }

    mainContext.updateSimplifiedPoints(previousSimplifiedPoints);
    mainContext.setPointsClicked([
      ...mainContext.pointsClicked.slice(0, currentIndexOrder!),
      previousSubPointsClicked,
      ...mainContext.pointsClicked.slice(currentIndexOrder! + 1),
    ]);
    mainContext.setSubmitAutoconj(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="body1" fontSize={14} fontStyle="italic">
        Points families:
      </Typography>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {dirsKeys.map((dir, i) => {
          return (
            <Box className="dirs-container" key={`dirs-container-${i}`}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 1,
                }}
              >
                <Tooltip title="Click to select all points in this direction">
                  <Button
                    variant="text"
                    onClick={() => onClickLegendConcave(dir)}
                  >
                    <Typography
                      variant="body1"
                      fontSize={10}
                      color={DirectionColors[dir]}
                      fontWeight="bold"
                    >
                      {dir}
                    </Typography>
                  </Button>
                </Tooltip>
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
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default LegendConcaves;
