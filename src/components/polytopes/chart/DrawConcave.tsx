import { Group } from "@visx/group";
import { Circle, LinePath } from "@visx/shape";
import { useContext } from "react";
import { CoordinateAutoconj } from "../../../store/reducers/main_reducer";
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

  const keys = Object.keys(mainContext.concave);

  const onClickCircle = (point: CoordinateAutoconj) => {
    mainContext.setSubmitAutoconj(false);
    if (currentIndexOrder !== undefined) {
      // Useless because it's verify before call this function, TS ...
      let newPointsClicked: Array<Array<CoordinateAutoconj>> = [];
      if (point.clicked) {
        // Previously clicked => Remove it from correct subarray in pointsClicked
        for (let i = 0; i < mainContext.pointsClicked.length; i++) {
          if (i === currentIndexOrder) {
            const newSubList: Array<CoordinateAutoconj> = [];
            for (const current of mainContext.pointsClicked[i]) {
              if (!(current.x === point.x && current.y === point.y))
                newSubList.push(current);
            }
            newPointsClicked.push(newSubList);
          } else {
            newPointsClicked.push(mainContext.pointsClicked[i]);
          }
        }
      } else {
        // Add point to correct subarray in pointsClicked
        newPointsClicked = mainContext.pointsClicked;
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
                        r={point.clicked ? 4 : 3}
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
                )
              : null}
          </Group>
        );
      })}
    </Group>
  );
};

export default DrawConcave;
