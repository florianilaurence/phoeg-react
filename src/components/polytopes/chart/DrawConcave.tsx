import { Group } from "@visx/group";
import { Circle, LinePath } from "@visx/shape";
import { useContext, useEffect } from "react";
import MainContext from "../../../store/utils/main_context";

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

interface DrawConcaveProps {
  xScale: any;
  yScale: any;
  tooltipData: string;
  setTooltipData: any;
  currentIndexOrder?: number;
}

const DrawConcave = ({
  xScale,
  yScale,
  tooltipData,
  setTooltipData,
  currentIndexOrder,
}: DrawConcaveProps) => {
  const mainContext = useContext(MainContext);

  const keys = Object.keys(mainContext.concave);

  const onClickCircle = (e: any) => {
    // TODO
  };

  return (
    <Group>
      {keys.map((key, i) => {
        return (
          <Group key={`group-conc-${key}-${i}`}>
            <LinePath
              key={key}
              stroke={DirectionColors[key as keyof typeof DirectionColors]}
              strokeWidth={2}
              data={
                currentIndexOrder !== undefined
                  ? mainContext.concaves[currentIndexOrder][key]
                  : mainContext.concave[key as keyof typeof DirectionColors]
              }
              x={(d: any) => xScale(d.x)}
              y={(d: any) => yScale(d.y)}
            />
            {currentIndexOrder !== undefined
              ? mainContext.concaves[currentIndexOrder][key].map(
                  (point: any, i: number) => {
                    return (
                      <Circle
                        key={`point-${point.x}-${i}`}
                        className="circle"
                        cx={xScale(point.x)}
                        cy={yScale(point.y)}
                        r={2}
                        fillOpacity={0.75}
                        onClick={onClickCircle}
                        onMouseEnter={() => {
                          setTooltipData(
                            mainContext.labelX +
                              " = " +
                              point.x +
                              " | " +
                              mainContext.labelY +
                              " = " +
                              point.y
                          );
                        }}
                        onMouseLeave={() => {
                          setTooltipData("");
                        }}
                      />
                    );
                  }
                )
              : null}
          </Group>
        );
      })}
    </Group>
  );
};

export default DrawConcave;
