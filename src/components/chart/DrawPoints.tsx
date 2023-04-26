import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import MainContext from "../../store/utils/main_context";
import { useContext, useState } from "react";
import { CoordinateGrouped } from "../../store/reducers/main_reducer";
import { GlyphStar } from "@visx/glyph";
import { Box, Button, Modal, Typography } from "@mui/material";
import ColorationsContext from "../../store/utils/colorations_context";
import { ColorationObject } from "../../store/reducers/colorations_reducer";

interface DrawPointsProps {
  xScale: any;
  yScale: any;
  setTooltipData: any;
}

const getColorationFromAverage = (
  average: number,
  objects: Array<ColorationObject>
) => {
  const object = objects.filter((object) => object.average === average)[0];
  return object.coloration;
};

const DrawPoints = ({ xScale, yScale, setTooltipData }: DrawPointsProps) => {
  const mainContext = useContext(MainContext);
  const colorationsContext = useContext(ColorationsContext);

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

  const generateTooltip = (point: CoordinateGrouped) => {
    let result =
      mainContext.labelX +
      " = " +
      point.x.getValue() +
      " | " +
      mainContext.labelY +
      " = " +
      point.y.getValue();

    if (mainContext.labelColor !== "") {
      result += " | " + mainContext.labelColor + " = ";
      if (point.colors.length === 1) {
        result += point.colors[0];
      } else {
        result += "[" + point.colors.join(", ") + "]";
        result += " | average = " + point.averageCols;
      }
    }
    result += " | mult";
    if (point.mults.length === 1) {
      result += " = " + point.mults[0];
    } else {
      result += "s = [" + point.mults.join(", ") + "]";
    }
    return result;
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
                cx={xScale(point.x.getValue())}
                cy={yScale(point.y.getValue())}
                r={
                  mainContext.legendClicked !== null &&
                  point.colors.includes(mainContext.legendClicked)
                    ? 7
                    : 4
                }
                fill={
                  mainContext.labelColor === ""
                    ? "black"
                    : getColorationFromAverage(
                        point.averageCols,
                        colorationsContext.objects
                      )
                }
                onClick={() => handleClickOnCircle(point)}
                onMouseEnter={() => {
                  setTooltipData(generateTooltip(point));
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
                left={xScale(point.x.getValue())}
                top={yScale(point.y.getValue())}
                size={
                  mainContext.legendClicked !== null &&
                  point.colors.includes(mainContext.legendClicked)
                    ? 115
                    : 50
                }
                fill={
                  mainContext.labelColor === ""
                    ? "black"
                    : getColorationFromAverage(
                        point.averageCols,
                        colorationsContext.objects
                      )
                }
                onClick={() => handleClickOnStar(point)}
                onMouseEnter={() => {
                  setTooltipData(generateTooltip(point));
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
