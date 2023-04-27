import { useContext, useEffect } from "react";
import { API_URL } from "../../.env";
import { stringify } from "qs";
import axios from "axios";
import { Invariant } from "../phoeg_app/PolytopesSlider";
import MainContext from "../../store/utils/main_context";
import {
  CoordinateAutoconj,
  Coordinate,
  CoordinateGrouped,
  MinMax,
  Concave,
  Concaves,
  SimplifiedCoordinate,
} from "../../store/reducers/main_reducer";
import NumRat from "../../utils/numRat";

interface PostConstraint {
  name: string;
  minimum_bound: string;
  maximum_bound: string;
}
// utils before fetch
export const getTablenameFromName = (
  name: string,
  invariants: Array<Invariant>
): string => {
  const invariant = invariants.find((invariant) => invariant.name === name);
  if (invariant) {
    return invariant.tablename;
  }
  return "";
};

export const decodeConstraints = (
  constraints: string
): Array<PostConstraint> => {
  let constraints_array: Array<PostConstraint> = [];
  if (constraints !== "") {
    const constraints_string = constraints.split(";");
    constraints_string.forEach((constraint) => {
      if (constraint === "") {
        return;
      }
      const constraint_array = constraint.split(" ");
      const constraint_object = {
        name: constraint_array[0],
        minimum_bound: constraint_array[1],
        maximum_bound: constraint_array[2],
      };
      constraints_array.push(constraint_object);
    });
  }
  return constraints_array;
};

export const containsCoordinate = (
  array: Array<CoordinateAutoconj>,
  coord: CoordinateAutoconj
) => {
  let res = false;
  for (let c of array) {
    if (c.x.equal(coord.x) && c.y.equal(coord.y)) {
      res = true;
      break;
    }
  }
  return res;
};

// utils after fetch, for PHOEG app
const sameCoordinates = (point1: CoordinateGrouped, point2: Coordinate) => {
  return point1.x.equal(point2.x) && point1.y.equal(point2.y);
};

const convertPointsNumRat = (points: Array<any>) => {
  const newPoints: Array<Coordinate> = [];
  points.forEach((point) => {
    newPoints.push({
      x: new NumRat(point.x),
      y: new NumRat(point.y),
      color: point.color,
      mult: point.mult,
    });
  });
  return newPoints;
};

const regroupByXY = (points: Coordinate[]) => {
  const newPoints: CoordinateGrouped[] = [];
  points.forEach((point) => {
    const index = newPoints.findIndex((p) => sameCoordinates(p, point));
    if (index === -1) {
      // first time we see this point so convert it to a CoodinateGrouped
      newPoints.push({
        x: point.x,
        y: point.y,
        colors: [point.color],
        averageCols: point.color,
        mults: [point.mult],
      });
    } else {
      // we have seen this point before so add the color and mult to the existing CoodinateGrouped
      newPoints[index].colors.push(point.color);
      newPoints[index].mults.push(point.mult);
    }
  });
  // compute the mean color for each point
  newPoints.forEach((point) => {
    let withoutDuplicate: Array<number> = [];
    point.colors.forEach((color) => {
      // to calculate the true average of the available colours (without duplication)
      if (!withoutDuplicate.includes(color)) {
        withoutDuplicate.push(color);
      }
    });

    point.averageCols =
      withoutDuplicate.reduce((a, b) => a + b, 0) / withoutDuplicate.length;
  });
  return newPoints;
};

const convertToCoordinateGrouped = (points: Coordinate[]) => {
  const newPoints: CoordinateGrouped[] = [];
  points.forEach((point) => {
    newPoints.push({
      x: point.x,
      y: point.y,
      colors: [point.color],
      averageCols: point.color,
      mults: [point.mult],
    });
  });
  return newPoints;
};

const convertEnvelope = (envelope: Array<any>): Array<SimplifiedCoordinate> => {
  return envelope.map((coordinate) => {
    return {
      x: new NumRat(coordinate.x),
      y: new NumRat(coordinate.y),
    };
  });
};

const convertConcave = (concave: any): Concave => {
  let newConcave: Concave = {
    minX: [],
    maxX: [],
    minY: [],
    maxY: [],
    minXminY: [],
    minXmaxY: [],
    maxXminY: [],
    maxXmaxY: [],
  };
  newConcave = {
    minX: concave.minX.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    maxX: concave.maxX.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    minY: concave.minY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    maxY: concave.maxY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    minXminY: concave.minXminY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    minXmaxY: concave.minXmaxY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    maxXminY: concave.maxXminY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
    maxXmaxY: concave.maxXmaxY.map((coord) => {
      return {
        x: new NumRat(coord.x.numerator),
        y: new NumRat(coord.y.numerator),
      };
    }),
  };

  return newConcave;
};

// utils after fetch, for Autoconj app
const convertPointConcaveList = (
  concaveList: Array<Concave>,
  orders: Array<number>
): Array<Concave> => {
  const res: Array<Concave> = [];
  const keys = Object.keys(concaveList[0]);
  for (let i = 0; i < concaveList.length; i++) {
    let currentConcave = concaveList[i];
    const temp: Concave = {
      minX: [],
      maxX: [],
      minY: [],
      maxY: [],
      minXminY: [],
      minXmaxY: [],
      maxXminY: [],
      maxXmaxY: [],
    };
    for (const key of keys) {
      for (const coordinate of currentConcave[key]) {
        temp[key].push({
          x: coordinate.x.denominator
            ? new NumRat(coordinate.x.numerator, coordinate.x.denominator)
            : new NumRat(coordinate.x.numerator),
          y: coordinate.y.denominator
            ? new NumRat(coordinate.y.numerator, coordinate.y.denominator)
            : new NumRat(coordinate.y.numerator),
          order: orders[i],
          clicked: false,
        });
      }
    }
    res.push(temp);
  }
  return res;
};

const convertMinMaxList = (minMaxList: Array<MinMax>) => {
  return minMaxList.map((minMax: MinMax) => {
    // Must do it else it is not recognized as a NumRat
    return {
      minX: new NumRat(minMax.minX.numerator, minMax.minX.denominator),
      maxX: new NumRat(minMax.maxX.numerator, minMax.maxX.denominator),
      minY: new NumRat(minMax.minY.numerator, minMax.minY.denominator),
      maxY: new NumRat(minMax.maxY.numerator, minMax.maxY.denominator),
    };
  });
};

const regroupByFamily = (concaveList: Array<Concave>): Concaves => {
  // Array of concave hulls --> direction object with list of lists
  let res_dirs: Concaves = {
    minX: [],
    maxX: [],
    minY: [],
    maxY: [],
    minXminY: [],
    minXmaxY: [],
    maxXminY: [],
    maxXmaxY: [],
  };

  for (const dir of concaveList) {
    if (dir.minX) res_dirs.minX.push(dir.minX);
    if (dir.maxX) res_dirs.maxX.push(dir.maxX);
    if (dir.minY) res_dirs.minY.push(dir.minY);
    if (dir.maxY) res_dirs.maxY.push(dir.maxY);
    if (dir.minXminY) res_dirs.minXminY.push(dir.minXminY);
    if (dir.minXmaxY) res_dirs.minXmaxY.push(dir.minXmaxY);
    if (dir.maxXminY) res_dirs.maxXminY.push(dir.maxXminY);
    if (dir.maxXmaxY) res_dirs.maxXmaxY.push(dir.maxXmaxY);
  }

  return res_dirs;
};

const convertEnvelopes = (
  envelopes: Array<Array<SimplifiedCoordinate>>
): Array<Array<SimplifiedCoordinate>> => {
  return envelopes.map((envelope) => {
    return convertEnvelope(envelope);
  });
};

const constructPointsFromConcaves = (
  concaves: Array<Concave>,
  orders: Array<number>
) => {
  const tempPoints: Array<Array<CoordinateAutoconj>> = [];
  const keys = Object.keys(concaves[0]);
  for (let i = 0; i < concaves.length; i++) {
    const concave = concaves[i];
    const tempSublist: Array<CoordinateAutoconj> = [];
    for (let key of keys) {
      for (let coordinate of concave[key]) {
        if (!containsCoordinate(tempSublist, coordinate)) {
          tempSublist.push({
            x: coordinate.x,
            y: coordinate.y,
            order: orders[i],
            clicked: false,
          });
        }
      }
    }
    tempPoints.push([...tempSublist]);
  }
  return tempPoints;
};

interface FetchProps {
  invariants: Array<Invariant>;
  withConcave?: boolean;
  withOrders?: boolean;
}

const Fetch = ({ invariants, withConcave, withOrders }: FetchProps) => {
  const mainContext = useContext(MainContext);

  useEffect(() => {
    mainContext.clearData();
    mainContext.setIsLoading(true);
    if (withOrders) {
      autoconjUseEffect();
    } else {
      phoegUseEffect();
    }
  }, [mainContext.order]);

  const phoegUseEffect = () => {
    const constraints = decodeConstraints(mainContext.constraints);
    const x_tablename = getTablenameFromName(mainContext.labelX, invariants);
    const y_tablename = getTablenameFromName(mainContext.labelY, invariants);
    const color_tablename = getTablenameFromName(
      mainContext.labelColor,
      invariants
    );
    const part_request = stringify({
      order: mainContext.order,
      x_invariant: x_tablename,
      y_invariant: y_tablename,
      constraints: constraints,
    });
    const envelope_request = new URL(
      `${API_URL}/graphs/polytope?${part_request}`
    );
    const points_request = new URL(
      `${API_URL}/graphs/points?${stringify({
        order: mainContext.order,
        x_invariant: x_tablename,
        y_invariant: y_tablename,
        colour:
          color_tablename === "num_vertices" || color_tablename === "mult"
            ? null
            : color_tablename,
        constraints: constraints,
      })}`
    );
    const advanced_constraints = {
      query: mainContext.advancedConstraints,
    };
    const concave_request = new URL(
      `${API_URL}/graphs/concave?${part_request}`
    );
    phoegFetchData(
      envelope_request,
      points_request,
      advanced_constraints,
      concave_request
    ).then((data) => {
      mainContext.setData(data);
      mainContext.setIsLoading(false);
    });
  };

  const phoegFetchData = (
    requestEnvelope: URL,
    requestPoints: URL,
    body: { query: string },
    requestConcave: URL
  ) => {
    const requests = [requestEnvelope.toString(), requestPoints.toString()];
    if (withConcave) requests.push(requestConcave.toString());

    return axios.all(requests.map((url) => axios.post(url, body))).then(
      axios.spread((envelope, points, concave) => {
        let newCoordinates: Array<CoordinateGrouped> = [];

        const newPoints = convertPointsNumRat(points.data.coordinates);

        if (
          mainContext.labelColor !== "" &&
          mainContext.labelColor !== "Multiplicity"
        ) {
          newCoordinates = regroupByXY(newPoints);
        } else {
          newCoordinates = convertToCoordinateGrouped(newPoints);
        }

        const newMinMax: MinMax = {
          minX: new NumRat(points.data.minMax.minX.numerator),
          maxX: new NumRat(points.data.minMax.maxX.numerator),
          minY: new NumRat(points.data.minMax.minY.numerator),
          maxY: new NumRat(points.data.minMax.maxY.numerator),
          minColor: points.data.minMax.minColor,
          maxColor: points.data.minMax.maxColor,
        };

        const newConcave: Concave | undefined = withConcave
          ? convertConcave(concave.data.concave)
          : undefined;

        return {
          envelope: convertEnvelope(envelope.data),
          minMax: newMinMax,
          coordinates: newCoordinates,
          concave: newConcave,
          sorted: points.data.sorted,
          error: "",
          pointClicked: null,
          legendClicked: null,
        };
      })
    );
  };

  const autoconjUseEffect = () => {
    const constraints = decodeConstraints(mainContext.constraints);
    const x_tablename = getTablenameFromName(mainContext.labelX, invariants);
    const y_tablename = getTablenameFromName(mainContext.labelY, invariants);

    const concave_request = new URL(
      `${API_URL}/graphs/concaves?${stringify({
        orders: mainContext.orders,
        x_invariant: x_tablename,
        y_invariant: y_tablename,
        constraints: constraints,
      })}`
    );

    const envelopes_request = new URL(
      `${API_URL}/graphs/polytopes?${stringify({
        orders: mainContext.orders,
        x_invariant: x_tablename.replace("_rational", ""),
        y_invariant: y_tablename.replace("_rational", ""),
        constraints: constraints,
      })}`
    );

    const advanced_constraints = {
      query: mainContext.advancedConstraints,
    };

    autoconjFetchData(concave_request, envelopes_request, advanced_constraints)
      .then((data) => {
        const concaveList = convertPointConcaveList(
          data.concaves,
          mainContext.orders
        );
        const concaves = regroupByFamily(concaveList);
        const envelopes = convertEnvelopes(data.envelopes);
        const simplifiedPoints = constructPointsFromConcaves(
          concaveList,
          mainContext.orders
        );
        const minMaxList: Array<MinMax> = convertMinMaxList(data.minMaxList);
        mainContext.setDataAutoconj(
          concaveList,
          concaves,
          envelopes,
          simplifiedPoints,
          minMaxList
        );

        mainContext.setIsLoading(false);
      })
      .catch((error) => {
        mainContext.setError(error);
        mainContext.setIsLoading(false);
      });
  };

  const autoconjFetchData = async (
    requestConcave: URL,
    requestEnvelopes: URL,
    body: { query: string }
  ) => {
    return axios
      .all([
        axios.post(requestConcave.toString(), body),
        axios.post(requestEnvelopes.toString(), body),
      ])
      .then(
        axios.spread((concaves, envelopes) => {
          return {
            concaves: concaves.data.concaves,
            minMaxList: concaves.data.minMax,
            envelopes: envelopes.data,
          };
        })
      );
  };

  return <></>;
};

export default Fetch;
