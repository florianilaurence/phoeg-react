import { useContext, useMemo, useReducer, useRef, useState } from "react";
import RequestChartContext from "../../store/utils/request_chart_context";
import {
  initialGraphState,
  RequestGraphReducer,
} from "../../store/reducers/request_graph_reducer";
import GraphContext from "../../store/utils/request_graph_context";
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
import {
  handleIsSelected,
  handleValueX,
  handleValueY,
} from "../../store/actions/request_graph_action";
import DrawConcave from "./DrawConcave";
import DrawPoints from "./DrawPoints";

// Données de configuration de l'encadré contenant le graphique
const background = "#fafafa";
const background_mini_map = "rgba(197,197,197,0.9)";
const margin = { top: 10, right: 0, bottom: 45, left: 70 };

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

interface SizeProps {
  width: number;
}

const Chart: React.FC<SizeProps> = ({ width }: SizeProps) => {
  const [showMiniMap, setShowMiniMap] = useState(false);

  const chartDataContext = useContext(ChartDataContext);

  const requestChartContext = useContext(RequestChartContext);

  const [stateRequestGraphReducer, dispatchRequestGraphReducer] = useReducer(
    RequestGraphReducer,
    initialGraphState
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const height = useMemo(() => {
    return (width * 2) / 3;
  }, [width]);

  const innerWidth = useMemo(() => {
    return width - margin.left - margin.right;
  }, [width]);

  const innerHeight = useMemo(() => {
    return height - margin.top - margin.bottom;
  }, [height]);

  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [chartDataContext.minMax.minX, chartDataContext.minMax.maxX],
        range: [margin.left, innerWidth],
        clamp: true,
      }),
    [width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [chartDataContext.minMax.minY, chartDataContext.minMax.maxY],
        range: [innerHeight, margin.top],
        clamp: true,
      }),
    [height]
  );

  const colorScale = scaleLinear<string>({
    // TODO: config colors reducer
    domain: [
      chartDataContext.minMax.minColor,
      chartDataContext.minMax.maxColor,
    ],
    range: ["#000000", "#00ff00"],
    clamp: true,
  });

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <rect width={width} height={height} rx={14} fill={background} />
        <Group>
          <AxisLeft
            scale={yScale}
            left={margin.left}
            label={requestChartContext.labelY}
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            label={requestChartContext.labelX}
          />
          <GridRows
            left={margin.left}
            scale={yScale}
            width={innerWidth}
            strokeDasharray="1"
            stroke={"#464646"}
            strokeOpacity={0.25}
            pointerEvents="none"
          />
          <GridColumns
            top={margin.top}
            scale={xScale}
            height={innerHeight}
            strokeDasharray="1"
            stroke={"#464646"}
            strokeOpacity={0.25}
            pointerEvents="none"
          />
          <LinePath
            stroke="black"
            strokeWidth={1}
            data={chartDataContext.envelope}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
          />
          <DrawConcave
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
          />
          <DrawPoints xScale={xScale} yScale={yScale} colorScale={colorScale} />
        </Group>
      </svg>

      <GraphContext.Provider
        value={{
          ...stateRequestGraphReducer,
          handleValueX: (data: number) =>
            handleValueX(data, dispatchRequestGraphReducer),
          handleValueY: (data: number) =>
            handleValueY(data, dispatchRequestGraphReducer),
          handleIsSelected: (data: boolean) =>
            handleIsSelected(data, dispatchRequestGraphReducer),
        }}
      >
        {/*Pas nécessaire pour tous les fils, seulement pour graphslider et les graphes ...*/}
      </GraphContext.Provider>
    </div>
  );
};

export interface ScalesProps {
  xScale: any;
  yScale: any;
  colorScale: any;
}

export default Chart;
