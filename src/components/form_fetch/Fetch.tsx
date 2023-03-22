import { useContext, useEffect } from "react";
import { API_URL } from "../../.env";
import { stringify } from "qs";
import axios from "axios";
import { Invariant } from "../polytopes/PolytopesSlider";
import MainContext from "../../store/utils/main_context";
import { Concave } from "../../store/reducers/main_reducer";

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
  orders?: Array<number>; //Only for conjecture app
}

const Fetch = ({ invariants, orders }: FetchProps) => {
  const mainContext = useContext(MainContext);

  useEffect(() => {
    mainContext.setIsLoading(true);
    if (orders) {
      concavesUseEffect();
      console.log(mainContext.concaves);
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
    phoegFetchData(
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
  };

  const phoegFetchData = (
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

  const concavesUseEffect = () => {
    const constraints = decodeConstraints(mainContext.constraints);
    const x_tablename = getTablenameFromName(mainContext.labelX, invariants);
    const y_tablename = getTablenameFromName(mainContext.labelY, invariants);
    const concaves_res: Array<Concave> = [];

    if (orders) {
      orders.forEach((order) => {
        const part_request = stringify({
          order: order,
          x_invariant: x_tablename,
          y_invariant: y_tablename,
          constraints: constraints,
        });
        const concave_request = new URL(
          `${API_URL}/graphs/concave` + "?" + part_request
        );
        concavesFetchData(concave_request)
          .then((data) => {
            if (data.concave.length === 0) {
              mainContext.setError(
                "No data found, invariants are too restrictive."
              );
              mainContext.setIsLoading(false);
              return;
            }
            concaves_res.push(data.concave);
          })
          .catch((error) => {
            mainContext.setError(error);
            mainContext.setIsLoading(false);
          });
      });
      mainContext.setConcaves(concaves_res);
      mainContext.setIsLoading(false);
    }
  };

  const concavesFetchData = async (requestConcave: URL) => {
    const concave = await axios.post(requestConcave.toString());
    return {
      concave: concave.data,
      error: "",
    };
  };

  return <></>;
};

export default Fetch;
