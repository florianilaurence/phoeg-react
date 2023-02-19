import { useContext, useEffect, useReducer } from "react";
import { API_URL } from "../../.env";
import RequestChartContext from "../../store/utils/request_chart_context";
import { stringify } from "qs";
import axios from "axios";
import ChartDataContext from "../../store/utils/chart_data_context";
import { FormProps } from "./Form";

interface PostConstraint {
  name: string;
  minimum_bound: string;
  maximum_bound: string;
}

const Fetch: React.FC<FormProps> = ({ invariants }: FormProps) => {
  const requestChartContext = useContext(RequestChartContext);
  const chartDataContext = useContext(ChartDataContext);

  const getTablenameFromName = (name: string): string => {
    const invariant = invariants.find((invariant) => invariant.name === name);
    if (invariant) {
      return invariant.tablename;
    }
    return "";
  };

  const decodeConstraints = (constraints: string): Array<PostConstraint> => {
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

  useEffect(() => {
    requestChartContext.handleIsLoading(true);
    const constraints = decodeConstraints(requestChartContext.constraints);
    const x_tablename = getTablenameFromName(requestChartContext.labelX);
    const y_tablename = getTablenameFromName(requestChartContext.labelY);
    const color_tablename = getTablenameFromName(
      requestChartContext.labelColor
    );
    const part_request = stringify({
      order: requestChartContext.order,
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
          order: requestChartContext.order,
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
      query: requestChartContext.advancedConstraints,
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
          chartDataContext.handleSetError(
            "No data found, invariants are too restrictive."
          );
          requestChartContext.handleIsLoading(false);
          return;
        }
        chartDataContext.handleSetData(data);
        requestChartContext.handleIsLoading(false);
      })
      .catch((error) => {
        chartDataContext.handleSetError(error);
        requestChartContext.handleIsLoading(false);
      });
  }, [requestChartContext.order]);

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
