import { useContext, useMemo, useRef, useState } from "react";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns, GridRows } from "@visx/grid";
import { scaleLinear } from "@visx/scale";
import DrawConcave from "./DrawConcave";
import MainContext from "../../store/utils/main_context";
import "./Chart.css";
import { Box } from "@mui/system";
import DrawEnvelope from "./DrawEnvelope";
import DrawPoints from "./DrawPoints";
import { Typography } from "@mui/material";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import {
  ReactSvgPanZoomLoader,
  SvgLoaderSelectElement,
} from "react-svg-pan-zoom-loader";

// Données de configuration de l'encadré contenant le graphique
const background = "#fafafa";
const margin = { top: 10, right: 0, bottom: 45, left: 70 };

interface ChartProps {
  width: number;
  withConcave: boolean; // Only for phoeg app
  currentIndexOrder?: number; // Only for autoconjectures app
}

const Chart = ({ width, withConcave, currentIndexOrder }: ChartProps) => {
  const mainContext = useContext(MainContext);
  const [tooltipData, setTooltipData] = useState<string>("");

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
        domain: [
          currentIndexOrder !== undefined
            ? mainContext.minMaxList[currentIndexOrder].minX
            : mainContext.minMax!.minX,
          currentIndexOrder !== undefined
            ? mainContext.minMaxList[currentIndexOrder].maxX
            : mainContext.minMax!.maxX,
        ],
        range: [margin.left, innerWidth],
        clamp: true,
      }),
    [innerWidth, mainContext.minMax, mainContext.minMaxList]
  );

  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [
          currentIndexOrder !== undefined
            ? mainContext.minMaxList[currentIndexOrder].minY
            : mainContext.minMax!.minY,
          currentIndexOrder !== undefined
            ? mainContext.minMaxList[currentIndexOrder].maxY
            : mainContext.minMax!.maxY,
        ],
        range: [innerHeight, margin.top],
        clamp: true,
      }),
    [innerHeight, mainContext.minMax, mainContext.minMaxList]
  );

  if (mainContext.concaves.length === 0) {
    return (
      <ReactSvgPanZoomLoader
        src="test-digram.svg"
        proxy={
          <>
            <SvgLoaderSelectElement
              selector="#maturetree"
              onClick={(e) => alert("Tree")}
            />
          </>
        }
        render={(content) => (
          <>
            <Box sx={{ height: "17px", width: "100%" }}>
              <Typography fontSize={12} align="right">
                {tooltipData}
              </Typography>
            </Box>
            <UncontrolledReactSVGPanZoom width={width} height={height}>
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

                  <DrawEnvelope
                    xScale={xScale}
                    yScale={yScale}
                    currentIndexOrder={currentIndexOrder}
                  />

                  {withConcave && (
                    <DrawConcave
                      xScale={xScale}
                      yScale={yScale}
                      setTooltipData={setTooltipData}
                      currentIndexOrder={currentIndexOrder}
                    />
                  )}

                  {currentIndexOrder === undefined && (
                    <DrawPoints
                      xScale={xScale}
                      yScale={yScale}
                      setTooltipData={setTooltipData}
                    />
                  )}
                </Group>
              </svg>
            </UncontrolledReactSVGPanZoom>
            <Box sx={{ height: "17px", width: "100%" }}>
              <Typography fontSize={12} align="right">
                {tooltipData}
              </Typography>
            </Box>
          </>
        )}
      />
    );
  } else {
    return (
      <>
        <Box sx={{ height: "17px", width: "100%" }}>
          <Typography fontSize={12} align="right">
            {tooltipData}
          </Typography>
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

            <DrawEnvelope
              xScale={xScale}
              yScale={yScale}
              currentIndexOrder={currentIndexOrder}
            />

            {withConcave && (
              <DrawConcave
                xScale={xScale}
                yScale={yScale}
                setTooltipData={setTooltipData}
                currentIndexOrder={currentIndexOrder}
              />
            )}
          </Group>
        </svg>
        <Box sx={{ height: "17px", width: "100%" }}>
          <Typography fontSize={12} align="right">
            {tooltipData}
          </Typography>
        </Box>
      </>
    );
  }
};

export interface ScalesProps {
  xScale: any;
  yScale: any;
  colorScale: any;
}

export default Chart;
