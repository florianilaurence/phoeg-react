import { useContext, useMemo, useRef } from "react";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import DrawConcave from "./DrawConcave";
import DrawPoints from "./DrawPoints";
import Legend from "./Legend";
import MainContext from "../../../store/utils/main_context";

// Données de configuration de l'encadré contenant le graphique
const background = "#fafafa";
const background_mini_map = "rgba(197,197,197,0.9)";
const margin = { top: 10, right: 0, bottom: 45, left: 70 };

interface SizeProps {
  width: number;
}

const Chart = ({ width }: SizeProps) => {
  const mainContext = useContext(MainContext);

  const svgRef = useRef<SVGSVGElement>(null);

  const height = useMemo(() => {
    return width * 0.5;
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
        domain: [mainContext.minMax.minX, mainContext.minMax.maxX],
        range: [margin.left, innerWidth],
        clamp: true,
      }),
    [width]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [mainContext.minMax.minY, mainContext.minMax.maxY],
        range: [innerHeight, margin.top],
        clamp: true,
      }),
    [height]
  );

  const colorScale = scaleLinear<string>({
    // TODO: config colors reducer
    domain: [mainContext.minMax.minColor, mainContext.minMax.maxColor],
    range: ["#000000", "#00ff00"],
    clamp: true,
  });

  return (
    <>
      <svg width={width} height={height} ref={svgRef}>
        <rect width={width} height={height} rx={14} fill={background} />
        <Group>
          <AxisLeft
            scale={yScale}
            left={margin.left}
            label={mainContext.labelY}
          />
          <AxisBottom
            scale={xScale}
            top={innerHeight}
            label={mainContext.labelX}
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
            data={mainContext.envelope}
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
      <Legend xScale={xScale} yScale={yScale} colorScale={colorScale} />
    </>
  );
};

export interface ScalesProps {
  xScale: any;
  yScale: any;
  colorScale: any;
}

export default Chart;
