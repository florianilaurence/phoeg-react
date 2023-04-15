import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import MainContext from "../../store/utils/main_context";
import { useContext, useEffect } from "react";
import { CoordinateGrouped } from "../../store/reducers/main_reducer";

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

  const handleClickOnCircle = (
    x: number,
    y: number,
    colors: Array<number>,
    meanColor: number,
    colorToShow: string,
    mults: Array<number>
  ) => {
    const pointClicked: CoordinateGrouped = {
      x: x,
      y: y,
      colors: colors,
      meanColor: meanColor,
      colorToShow: colorToShow,
      mults: mults,
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
            onClick={() =>
              handleClickOnCircle(
                point.x,
                point.y,
                point.colors,
                point.meanColor,
                point.colorToShow,
                point.mults
              )
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
      })}
    </Group>
  );
};

export default DrawPoints;
