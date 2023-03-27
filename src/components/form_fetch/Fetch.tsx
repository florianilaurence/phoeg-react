import { useContext, useEffect } from "react";
import { API_URL } from "../../.env";
import { stringify } from "qs";
import axios from "axios";
import { Invariant } from "../phoeg_app/PolytopesSlider";
import MainContext from "../../store/utils/main_context";
import { CoordinateAutoconj } from "../../store/reducers/main_reducer";

interface PostConstraint {
  name: string;
  minimum_bound: string;
  maximum_bound: string;
}

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

interface FetchProps {
  invariants: Array<Invariant>;
  withConcave?: boolean;
  withOrders?: boolean;
}

export const containsCoordinate = (
  array: Array<CoordinateAutoconj>,
  coord: CoordinateAutoconj
) => {
  let res = false;
  for (let c of array) {
    if (c.x === coord.x && c.y === coord.y) {
      res = true;
      break;
    }
  }
  return res;
};

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
      `${API_URL}/graphs/polytope` + "?" + part_request
    );
    const points_request = new URL(
      `${API_URL}/graphs/points` +
        "?" +
        stringify({
          order: mainContext.order,
          x_invariant: x_tablename,
          y_invariant: y_tablename,
          colour:
            color_tablename === "num_vertices" || color_tablename === "mult"
              ? null
              : color_tablename,
          constraints: constraints,
        })
    );
    const advanced_constraints = {
      query: mainContext.advancedConstraints,
    };
    const concave_request = new URL(
      `${API_URL}/graphs/concave` + "?" + part_request
    );

    withConcave
      ? phoegFetchData(
          envelope_request,
          points_request,
          advanced_constraints,
          concave_request
        )
          .then((data) => {
            mainContext.setData(data);
            mainContext.setIsLoading(false);
          })
          .catch((error) => {
            mainContext.setError(error);
            mainContext.setIsLoading(false);
          })
      : phoegFetchData(envelope_request, points_request, advanced_constraints)
          .then((data) => {
            mainContext.setData(data);
            mainContext.setIsLoading(false);
          })
          .catch((error) => {
            mainContext.setError(error);
            mainContext.setIsLoading(false);
          });
  };

  const phoegFetchData = (
    requestEnvelope: URL,
    requestPoints: URL,
    body: { query: string },
    requestConcave?: URL
  ) => {
    const requests = [requestEnvelope.toString(), requestPoints.toString()];
    if (requestConcave) requests.push(requestConcave.toString());
    return axios
      .all([
        axios.post(requestEnvelope.toString(), body),
        axios.post(requestPoints.toString(), body),
        axios.post(
          requestConcave
            ? requestConcave.toString()
            : requestEnvelope.toString(),
          body
        ),
      ])
      .then(
        axios.spread((envelope, points, concave) => {
          return {
            envelope: envelope.data,
            minMax: points.data.minMax,
            coordinates: points.data.coordinates,
            sorted: points.data.sorted,
            concave: concave.data.concave,
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

    const part_request = stringify({
      orders: mainContext.orders,
      x_invariant: x_tablename,
      y_invariant: y_tablename,
      constraints: constraints,
    });
    const concave_request = new URL(
      `${API_URL}/graphs/concaves` + "?" + part_request
    );

    const envelopes_request = new URL(
      `${API_URL}/graphs/polytopes` + "?" + part_request
    );

    const advanced_constraints = {
      query: mainContext.advancedConstraints,
    };

    autoconjFetchData(concave_request, envelopes_request, advanced_constraints)
      .then((data) => {
        mainContext.setIsLoading(false);
        const tempPoints: Array<Array<CoordinateAutoconj>> = [];
        const keys = Object.keys(data.concaves[0]);
        for (let concave of data.concaves) {
          const tempSublist: Array<CoordinateAutoconj> = [];
          for (let key of keys) {
            for (let coordinate of concave[key]) {
              if (!containsCoordinate(tempSublist, coordinate)) {
                tempSublist.push(coordinate);
              }
            }
          }
          tempPoints.push([...tempSublist]);
        }
        mainContext.setDataAutoconj(
          data.concaves,
          data.envelopes,
          tempPoints,
          data.minMax
        );
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
            minMax: concaves.data.minMax,
            envelopes: envelopes.data,
          };
        })
      );
  };

  return <></>;
};

export default Fetch;
