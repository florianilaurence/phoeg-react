import { Circle } from "@visx/shape";
import { Group } from "@visx/group";
import { useContext } from "react";
import ChartDataContext from "../../../store/utils/chart_data_context";
import RequestChartContext from "../../../store/utils/request_chart_context";
import RequestGraphContext from "../../../store/utils/request_graph_context";
import { ScalesProps } from "./Chart";
import "./DrawPoints.css";

const DrawPoints: React.FC<ScalesProps> = ({
  xScale,
  yScale,
  colorScale,
}: ScalesProps) => {
  const chartDataContext = useContext(ChartDataContext);
  const requestChartContext = useContext(RequestChartContext);
  const requestGraphContext = useContext(RequestGraphContext);

  const handleClickOnCircle = (x: number, y: number) => {
    requestGraphContext.handleValueX(x);
    requestGraphContext.handleValueY(y);
    requestGraphContext.handleIsSelected(true);
  };

  return (
    <Group>
      {chartDataContext.coordinates.map((point, i) => {
        return (
          <Circle
            key={`point-${point[0]}-${i}`}
            className="circle"
            cx={xScale(point.x)}
            cy={yScale(point.y)}
            r={chartDataContext.legendClicked === point.color ? 10 : 5}
            fillOpacity={0.75}
            fill={
              requestChartContext.labelColor === ""
                ? "black"
                : colorScale(point.color)
            }
            onClick={() => handleClickOnCircle(point.x, point.y)}
          />
        );
      })}
    </Group>
  );
};

export default DrawPoints;
