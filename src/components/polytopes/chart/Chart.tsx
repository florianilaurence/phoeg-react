import { useContext, useMemo, useRef, useState } from "react";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { Circle, LinePath } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import DrawConcave from "./DrawConcave";
import Legend from "./Legend";
import MainContext from "../../../store/utils/main_context";
import { Coordinate } from "../../../store/reducers/main_reducer";
import "./Chart.css";
import Inner from "../../styles_and_settings/Inner";
import { Box } from "@mui/system";

// Données de configuration de l'encadré contenant le graphique
const background = "#fafafa";
const background_mini_map = "rgba(197,197,197,0.9)";
const margin = { top: 10, right: 0, bottom: 45, left: 70 };

interface SizeProps {
  width: number;
}

const Chart = ({ width }: SizeProps) => {
  const mainContext = useContext(MainContext);
  const [tooltipData, setTooltipData] = useState<string>();

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
    [innerWidth, mainContext.minMax.maxX, mainContext.minMax.minX]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [mainContext.minMax.minY, mainContext.minMax.maxY],
        range: [innerHeight, margin.top],
        clamp: true,
      }),
    [innerHeight, mainContext.minMax.maxY, mainContext.minMax.minY]
  );

  const colorScale = scaleLinear<string>({
    // TODO: config colors reducer (could change select colors)
    domain: [mainContext.minMax.minColor, mainContext.minMax.maxColor],
    range: ["#000000", "#00ff00"],
    clamp: true,
  });

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
    <>
      <Box sx={{ height: "17px", width: "100%" }}>
        <Inner size={12} align="right">
          {tooltipData}
        </Inner>
      </Box>
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
                    mainContext.labelColor === ""
                      ? "black"
                      : colorScale(point.color)
                  }
                  onClick={() =>
                    handleClickOnCircle(
                      point.x,
                      point.y,
                      point.color,
                      point.mult
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
