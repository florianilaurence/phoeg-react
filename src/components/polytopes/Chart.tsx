import { useContext, useMemo, useReducer, useRef, useState } from "react";
import RequestChartContext from "../../store/utils/request_chart_context";
import {
  initialGraphState,
  RequestGraphReducer,
} from "../../store/reducers/request_graph_reducer";
import GraphContext from "../../store/utils/graph_context";
import { Zoom } from "@visx/zoom";
import { ScaleSVG } from "@visx/responsive";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import Tooltip from "@mui/material/Tooltip";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { Circle, LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import {
  Concave,
  Coordinate,
  MinMax,
} from "../../store/reducers/chart_data_reducer";
import ChartDataContext from "../../store/utils/chart_data_context";

// Données de configuration de l'encadré contenant le graphique
const background = "#fafafa";
const background_mini_map = "rgba(197,197,197,0.9)";
const width = 800;
const height = (width * 2) / 3;
const margin = { top: 10, right: 15, bottom: 45, left: 30 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Couleur pour chaque direction
enum DirectionColors {
  minY = "blue",
  minXminY = "green",
  minX = "red",
  maxXminY = "purple",
  maxX = "orange",
  maxXmaxY = "brown",
  maxY = "pink",
  minXmaxY = "grey",
}

interface Params {
  currentNbClusters: number;
  showMiniMap: boolean;
  maxDomain: number;
  color1: string;
  color2: string;
  selectedMin: number;
  selectedMax: number;
  selectedTag: string;
  isLegendClicked: boolean;
}

enum ParamsAction {
  SET_CURRENT_NB_CLUSTERS = "SET_CURRENT_NB_CLUSTERS",
  SET_SHOW_MINI_MAP = "SET_SHOW_MINI_MAP",
  SET_MAX_DOMAIN = "SET_MAX_DOMAIN",
  SET_COLOR_1 = "SET_COLOR_1",
  SET_COLOR_2 = "SET_COLOR_2",
  SET_SELECTED_MIN = "SET_SELECTED_MIN",
  SET_SELECTED_MAX = "SET_SELECTED_MAX",
  SET_SELECTED_TAG = "SET_SELECTED_TAG",
  SET_IS_LEGEND_CLICKED = "SET_IS_LEGEND_CLICKED",
}

export interface ChartProps {
  envelope: Array<Coordinate>;
  coordinates: Array<Coordinate>;
  minMax: MinMax;
  clusterList: Array<number>;
  allClusters: { [key: number]: Array<Array<Coordinate>> };
  concave: Concave;
}

const Chart: React.FC = () => {
  const [showMiniMap, setShowMiniMap] = useState(false);

  const chartDataContext = useContext(ChartDataContext);

  const chartContext = useContext(RequestChartContext);

  const [stateRequestGraphReducer, dispatchRequestGraphReducer] = useReducer(
    RequestGraphReducer,
    initialGraphState
  );
  const svgRef = useRef<SVGSVGElement>(null);
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [chartDataContext.minMax.minX, chartDataContext.minMax.maxX],
        range: [0, width],
        clamp: true,
      }),
    [width]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [chartDataContext.minMax.minY, chartDataContext.minMax.maxY],
        range: [height, 0],
        clamp: true,
      }),
    [height]
  );

  return (
    <GraphContext.Provider
      value={{
        ...stateRequestGraphReducer,
        handleValueX: (data: any) => {
          dispatchRequestGraphReducer({
            type: "HANDLE_VALUE_X",
            payload: data,
          });
        },
        handleValueY: (data: any) => {
          dispatchRequestGraphReducer({
            type: "HANDLE_VALUE_Y",
            payload: data,
          });
        },
        handleIsSelected: (data: any) => {
          dispatchRequestGraphReducer({
            type: "HANDLE_IS_SELECTED",
            payload: data,
          });
        },
      }}
    >
      <svg width={width} height={height} ref={svgRef}>
        <rect width={width} height={height} rx={14} fill={background} />
        <Group>
          <LinePath
            stroke="black"
            strokeWidth={1}
            data={chartDataContext.envelope}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.minY}
            strokeWidth={2}
            data={chartDataContext.concave.minY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.minXminY}
            strokeWidth={2}
            data={chartDataContext.concave.minXminY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.minX}
            strokeWidth={2}
            data={chartDataContext.concave.minX}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.minXmaxY}
            strokeWidth={2}
            data={chartDataContext.concave.minXmaxY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.maxY}
            strokeWidth={2}
            data={chartDataContext.concave.maxY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.maxXmaxY}
            strokeWidth={2}
            data={chartDataContext.concave.maxXmaxY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.maxX}
            strokeWidth={2}
            data={chartDataContext.concave.maxX}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          <LinePath
            stroke={DirectionColors.maxXminY}
            strokeWidth={2}
            data={chartDataContext.concave.maxXminY}
            x={(d) => xScale((d as Coordinate).x)}
            y={(d) => yScale((d as Coordinate).y)}
          />
          {chartDataContext.coordinates.map((point, i) => {
            return (
              <Circle
                key={`point-${point[0]}-${i}`}
                className="dot"
                cx={xScale(point.x)}
                cy={yScale(point.y)}
                r={5}
                fill="black"
              />
            );
          })}
        </Group>
      </svg>
    </GraphContext.Provider>
  );
};

export default Chart;
