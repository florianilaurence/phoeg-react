import { Group } from "@visx/group";
import { Circle, LinePath } from "@visx/shape";
import { useContext } from "react";
import { CoordinateAutoconj } from "../../store/reducers/main_reducer";
import MainContext from "../../store/utils/main_context";

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
  setTooltipData: any;
  currentIndexOrder?: number;
}

const DrawConcave = ({
  xScale,
  yScale,
  setTooltipData,
  currentIndexOrder,
}: DrawConcaveProps) => {
  const mainContext = useContext(MainContext);

  if (currentIndexOrder === undefined && mainContext.concave === undefined) {
    return null;
  } else {
    const keys = Object.keys(
      mainContext.concave
        ? mainContext.concave
        : mainContext.concaves[currentIndexOrder!]
    );

    const onClickCircle = (point: CoordinateAutoconj) => {
      mainContext.setSubmitAutoconj(false);
      if (currentIndexOrder !== undefined) {
        // Useless because it's verify before call this function, TS ...
        const previousSubPointsClicked =
          mainContext.pointsClicked[currentIndexOrder!];
        let newPointsClicked: Array<Array<CoordinateAutoconj>> =
          mainContext.pointsClicked;

        if (point.clicked) {
          // Previously clicked => Remove it from correct subarray in pointsClicked
          const index = previousSubPointsClicked.findIndex(
            (p) => p.x === point.x && p.y === point.y
          );
          newPointsClicked[currentIndexOrder].splice(index, 1);
        } else {
          // Add point to correct subarray in pointsClicked
          newPointsClicked[currentIndexOrder].push(point);
        }

        point.clicked = !point.clicked;
        mainContext.setPointsClicked(newPointsClicked);
      }
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
                    : mainContext.concave![key as keyof typeof DirectionColors]
                }
                x={(d: any) => xScale(d.x)}
                y={(d: any) => yScale(d.y)}
              />
            </Group>
          );
        })}
        {currentIndexOrder !== undefined && (
          <Group>
            {mainContext.simplifiedPoints[currentIndexOrder].map(
              (point: CoordinateAutoconj, i: number) => {
                return (
                  <Circle
                    key={`point-${point.x}-${i}`}
                    className="circle"
                    cx={xScale(point.x)}
                    cy={yScale(point.y)}
                    r={point.clicked ? 5 : 3}
                    fill={point.clicked ? "red" : "black"}
                    onClick={() => onClickCircle(point)}
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
            )}
          </Group>
        )}
      </Group>
    );
  }
};

export default DrawConcave;
