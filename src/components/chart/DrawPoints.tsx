import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import MainContext from "../../store/utils/main_context";
import { useContext, useEffect, useState } from "react";
import { CoordinateGrouped } from "../../store/reducers/main_reducer";
import { GlyphStar } from "@visx/glyph";
import { Box, Button, Modal, Typography } from "@mui/material";

interface DrawPointsProps {
  xScale: any;
  yScale: any;
  colorScale: any;
  setTooltipData: any;
}

const DrawPoints = ({
  xScale,
  yScale,
  colorScale,
  setTooltipData,
}: DrawPointsProps) => {
  const mainContext = useContext(MainContext);
  const [showModal, setShowModal] = useState(false);
  const [pointClicked, setPointClicked] = useState<CoordinateGrouped | null>(
    null
  );

  const handleClickOnCircle = (point: CoordinateGrouped) => {
    mainContext.setPointClicked(point);
  };

  const handleClickOnStar = (point: CoordinateGrouped) => {
    setPointClicked(point);
    setShowModal(true);
  };

  return (
    <>
      <Group>
        {mainContext.coordinates.map((point, i) => {
          if (point.colors.length < 2) {
            return (
              <Circle
                key={`point-${point[0]}-${i}`}
                className="circle"
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={
                  mainContext.legendClicked !== null &&
                  point.colors.includes(mainContext.legendClicked)
                    ? 7
                    : 4
                }
                fillOpacity={0.75}
                fill={
                  mainContext.labelColor === ""
                    ? "black"
                    : colorScale(point.meanColor)
                }
                onClick={() => handleClickOnCircle(point)}
                onMouseEnter={() => {
                  setTooltipData(
                    mainContext.labelX +
                      " = " +
                      point.x +
                      " | " +
                      mainContext.labelY +
                      " = " +
                      point.y +
                      " | colors = " +
                      point.colors[0] +
                      " | mult = " +
                      point.mults[0]
                  );
                }}
                onMouseLeave={() => {
                  setTooltipData("");
                }}
              />
            );
          } else {
            return (
              <GlyphStar
                key={`point-${point[0]}-${i}`}
                className="circle"
                left={xScale(point.x)}
                top={yScale(point.y)}
                r={
                  mainContext.legendClicked !== null &&
                  point.colors.includes(mainContext.legendClicked)
                    ? 6
                    : 3
                }
                fillOpacity={0.75}
                fill={
                  mainContext.labelColor === ""
                    ? "black"
                    : colorScale(point.meanColor)
                }
                onClick={() => handleClickOnStar(point)}
                onMouseEnter={() => {
                  setTooltipData(
                    mainContext.labelX +
                      " = " +
                      point.x +
                      " | " +
                      mainContext.labelY +
                      " = " +
                      point.y +
                      " | colors = [ " +
                      point.colors +
                      " ] | mean of colors = " +
                      point.meanColor +
                      " ] | mults = [ " +
                      point.mults +
                      " ]"
                  );
                }}
                onMouseLeave={() => {
                  setTooltipData("");
                }}
              />
            );
          }
        })}
      </Group>
      {pointClicked && (
        <Modal open={showModal} onClose={() => setShowModal(false)}>
          <Box
            sx={{
              position: "absolute",
              width: 500,
              bgcolor: "whitesmoke",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ textAlign: "center" }}
            >
              Please choose a color value for graphs request
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
              }}
            >
              {pointClicked.colors.map((color, i) => (
                <Button
                  key={`color-${i}`}
                  variant="outlined"
                  color="success"
                  size="small"
                  onClick={() => {
                    mainContext.setPointClicked({
                      ...pointClicked,
                      colors: [color],
                      mults: [pointClicked.mults[i]],
                    });
                    setShowModal(false);
                  }}
                >
                  {color}
                </Button>
              ))}
            </Box>
          </Box>
        </Modal>
      )}
    </>
  );
};

export default DrawPoints;
