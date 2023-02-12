import { useContext } from "react";
import ChartContext from "../../store/utils/chart_context";

const Chart: React.FC = () => {
  const context = useContext(ChartContext);

  return <div className="chart"></div>;
};

export default Chart;
