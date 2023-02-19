import { Group } from "@visx/group";
import { LinePath } from "@visx/shape";
import { useContext } from "react";
import { Coordinate } from "../../../store/reducers/chart_data_reducer";
import ChartDataContext from "../../../store/utils/chart_data_context";
import { ScalesProps } from "./Chart";

// Couleur pour chaque direction
export enum DirectionColors {
  minY = "blue",
  minXminY = "green",
  minX = "red",
  maxXminY = "purple",
  maxX = "orange",
  maxXmaxY = "brown",
  maxY = "pink",
  minXmaxY = "grey",
}

const DrawConcave: React.FC<ScalesProps> = ({
  xScale,
  yScale,
}: ScalesProps) => {
  const chartDataContext = useContext(ChartDataContext);
  const keys = Object.keys(chartDataContext.concave);
  return (
    <Group>
      {keys.map((key) => {
        return (
          <LinePath
            key={key}
            stroke={DirectionColors[key as keyof typeof DirectionColors]}
            strokeWidth={2}
            data={chartDataContext.concave[key as keyof typeof DirectionColors]}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
          />
        );
      })}
    </Group>
  );
};

export default DrawConcave;
