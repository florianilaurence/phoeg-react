import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import MainContext from "../../../store/utils/main_context";
import { useContext } from "react";
import { Coordinate } from "../../../store/reducers/main_reducer";

interface DrawPointsProps {
  xScale: any;
  yScale: any;
  colorScale: any;
  tooltipData: any;
  setTooltipData: any;
}

const DrawPoints = ({
  xScale,
  yScale,
  colorScale,
  tooltipData,
  setTooltipData,
}: DrawPointsProps) => {
  const mainContext = useContext(MainContext);

  const handleClickOnCircle = (
    x: number,
    y: number,
    color: number,
    mult: number
  ) => {
    const pointClicked: Coordinate = {
      x: x,
      y: y,
      color: color,
      mult: mult,
    };
    mainContext.setPointClicked(pointClicked);
  };

  return (
    <Group>
      {mainContext.coordinates.map((point, i) => {
        return (
          <Circle
            key={`point-${point[0]}-${i}`}
            className="circle"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={mainContext.legendClicked === point.color ? 7 : 4}
            fillOpacity={0.75}
            fill={
              mainContext.labelColor === "" ? "black" : colorScale(point.color)
            }
            onClick={() =>
              handleClickOnCircle(point.x, point.y, point.color, point.mult)
            }
            onMouseEnter={() => {
              setTooltipData(
                mainContext.labelX +
                  " = " +
                  point.x +
                  " | " +
                  mainContext.labelY +
                  " = " +
                  point.y +
                  " | mult = " +
                  point.mult
              );
            }}
            onMouseLeave={() => {
              setTooltipData("");
            }}
          />
        );
      })}
    </Group>
  );
};

export default DrawPoints;
