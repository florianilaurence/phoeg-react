import { useContext, useEffect } from "react";
import { API_URL } from "../../.env";
import { stringify } from "qs";
import axios from "axios";
import { Invariant } from "../polytopes/PolytopesSlider";
import MainContext from "../../store/utils/main_context";

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
}

const Fetch = ({ invariants }: FetchProps) => {
  const mainContext = useContext(MainContext);

  useEffect(() => {
    mainContext.setIsLoading(true);
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

    fetchData(
      envelope_request,
      points_request,
      concave_request,
      advanced_constraints
    )
      .then((data) => {
        if (data.coordinates.length === 0 || data.envelope.length === 0) {
          mainContext.setError(
            "No data found, invariants are too restrictive."
          );
          mainContext.setIsLoading(false);
          return;
        }
        mainContext.setData(data);
        mainContext.setIsLoading(false);
      })
      .catch((error) => {
        mainContext.setError(error);
        mainContext.setIsLoading(false);
      });
    console.log(mainContext.coordinates);
  }, [mainContext.order]);

  const fetchData = (
    requestEnvelope: URL,
    requestPoints: URL,
    requestConcave: URL,
    body: { query: string }
  ) => {
    return axios
      .all([
        axios.post(requestEnvelope.toString(), body),
        axios.post(requestPoints.toString(), body),
        axios.post(requestConcave.toString(), body),
      ])
      .then(
        axios.spread((envelope, points, concave) => {
          return {
            envelope: envelope.data,
            minMax: points.data.minMax,
            coordinates: points.data.coordinates,
            sorted: points.data.sorted,
            concave: concave.data,
            error: "",
            pointClicked: null,
            legendClicked: null,
          };
        })
      );
  };

  return <></>;
};

export default Fetch;
