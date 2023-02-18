import { Group } from "@visx/group";
import { Circle } from "@visx/shape";
import { useContext } from "react";
import ChartDataContext from "../../store/utils/chart_data_context";
import RequestChartContext from "../../store/utils/request_chart_context";
import { ScalesProps } from "./Chart";

const DrawPoints: React.FC<ScalesProps> = ({
  xScale,
  yScale,
  colorScale,
}: ScalesProps) => {
  const chartDataContext = useContext(ChartDataContext);
  const requestChartContext = useContext(RequestChartContext);

  return (
    <Group>
      {chartDataContext.coordinates.map((point, i) => {
        return (
          <Circle
            key={`point-${point[0]}-${i}`}
            className="dot"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={5}
            fill={
              requestChartContext.labelColor === ""
                ? "black"
                : colorScale(point.color)
            }
          />
        );
      })}
    </Group>
  );
};

export default DrawPoints;
