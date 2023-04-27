import { Group } from "@visx/group";
import { Circle, LinePath } from "@visx/shape";
import { useContext } from "react";
import {
  CoordinateAutoconj,
  SimplifiedCoordinate,
} from "../../store/reducers/main_reducer";
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
      currentIndexOrder !== undefined
        ? mainContext.concaveList[currentIndexOrder]
        : mainContext.concave!
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
            (p) => p.x.equal(point.x) && p.y.equal(point.y)
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
                    ? mainContext.concaveList[currentIndexOrder][key]
                    : mainContext.concave![key as keyof typeof DirectionColors]
                }
                x={(d: SimplifiedCoordinate) => xScale(d.x.getValue())}
                y={(d: SimplifiedCoordinate) => yScale(d.y.getValue())}
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
                    cx={xScale(point.x.getValue())}
                    cy={yScale(point.y.getValue())}
                    r={point.clicked ? 5 : 3}
                    fill={point.clicked ? "red" : "black"}
                    onClick={() => onClickCircle(point)}
                    onMouseEnter={() => {
                      setTooltipData(
                        mainContext.labelX +
                          " = " +
                          point.x.getValue() +
                          " | " +
                          mainContext.labelY +
                          " = " +
                          point.y.getValue()
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
