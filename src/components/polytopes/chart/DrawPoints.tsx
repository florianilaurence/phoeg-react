import { Circle } from "@visx/shape";
import { Group } from "@visx/group";
import { useContext } from "react";
import { ScalesProps } from "./Chart";
import "./DrawPoints.css";
import MainContext from "../../../store/utils/main_context";
import { Coordinate } from "../../../store/reducers/main_reducer";
import { Tooltip } from "@mui/material";

const DrawPoints = ({ xScale, yScale, colorScale }: ScalesProps) => {
  const mainContext = useContext(MainContext);

  // const handleClickOnCircle = (x: number, y: number) => {
  //   const pointClicked: Coordinate = {
  //     x: x,
  //     y: y,
  //   };
  //   mainContext.setPointClicked(pointClicked);
  // };

  return (
    <Group>
      {mainContext.coordinates.map((point, i) => {
        return (
          <Circle
            key={`point-${point[0]}-${i}`}
            className="circle"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={mainContext.legendClicked === point.color ? 5 : 3}
            fillOpacity={0.75}
            fill={
              mainContext.labelColor === "" ? "black" : colorScale(point.color)
            }
            // onClick={() => handleClickOnCircle(point.x, point.y)}
          />
        );
      })}
    </Group>
  );
};

export default DrawPoints;
