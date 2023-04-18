import { Box, Typography, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MainContext from "../../../store/utils/main_context";

const LegendColorValues = () => {
  const mainContext = useContext(MainContext);
  const [colorsKeys, setColorsKeys] = useState<number[]>([]);

  useEffect(() => {
    const colorsKeysStr = Object.keys(mainContext.sorted);
    let tempColorsKeys = colorsKeysStr.map((color) => Number(color));
    tempColorsKeys.sort((a, b) => (a > b ? 1 : -1));
    setColorsKeys(tempColorsKeys);
  }, [mainContext.sorted]);

  const handleOnClickLegend = (item: number) => {
    if (mainContext.legendClicked === item) {
      mainContext.setLegendClicked(null);
    } else {
      mainContext.setLegendClicked(item);
    }
  };

  return (
    <Box
      className="color-values-container"
      sx={{
        mt: 1,
      }}
    >
      <Typography variant="body1" fontSize={12} fontStyle="italic">
        All possible color values (clickable to show point with this value in
        these {mainContext.labelColor} values):
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 1,
          maxHeight: 45,
        }}
        style={{
          overflow: "hidden",
          overflowY: "scroll", // added scroll
        }}
        flexWrap="wrap"
      >
        {colorsKeys.map((color, i) => {
          return (
            <Box
              key={`leg-col-${i}-${color}`}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ ml: 1, cursor: "pointer" }}
                onClick={() => handleOnClickLegend(color)}
              >
                <Typography
                  variant="body1"
                  fontSize={12}
                  fontStyle={
                    mainContext.legendClicked !== null &&
                    mainContext.legendClicked === color
                      ? "italic"
                      : "normal"
                  }
                >
                  {color}
                </Typography>
              </Box>
              {i !== colorsKeys.length - 1 && (
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

export default LegendColorValues;
