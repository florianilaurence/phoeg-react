import axios from 'axios';
import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../.env";
import {stringify} from "qs";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import PolytopeChart from "./PolytopeChart";
import { useContext } from 'react';
import { Context } from '../context';

export default function PolytopeFetch() {
  const context = useContext(Context);

  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let envelope_request = new URL(`${API_URL}/graphs/polytope`);
    envelope_request += "?" + stringify({
      order:  context.order,
      x_invariant:  context.invariantX,
      y_invariant:  context.invariantY,
      constraints:  context.constraints,
    })

    let points_request = new URL(`${API_URL}/graphs/points`);
    points_request += "?" + stringify({
      order: context.order,
      x_invariant: context.invariantX,
      y_invariant: context.invariantY,
      colour: context.invariantColor === "num_vertices" ||  context.invariantColor === "mult" ? null :  context.invariantColor,
      constraints: context.constraints
    });

    let concave_request = new URL(`${API_URL}/graphs/concave`);
    concave_request += "?" + stringify({
      order: context.order,
      x_invariant: context.invariantX,
      y_invariant: context.invariantY,
      constraints: context.constraints,
    });

    const advancedConstraints = {
      query:  context.advancedConstraints,
    }

    fetchData(envelope_request, points_request, concave_request, advancedConstraints).then(
      (d) => {
        setData(d);
        setLoading(false);
      }
    ).catch(
      (error) => {
        setError(error);
        setLoading(false);
      }
    );
    forceUpdate();
  }, []);

  const fetchData = (requestEnvelope, requestPoints, requestConcave, body) => {
    return axios.all([
      axios.post(requestEnvelope, body),
      axios.post(requestPoints, body),
      axios.post(requestConcave, body)
    ]).then(axios.spread((envelope, points, concave) => {
      if (points.data[context.invariantX] === null || points.data[context.invariantY] === null || points.data[context.invariantColor] === null
        || envelope.data[context.invariantX] === null || envelope.data[context.invariantY] === null || points.data === {} || envelope.data === {}) {
        return {
          envelope: null,
          points: null,
          concave: null
        };
      }
      return {
        envelope: envelope.data,
        pointResult: points.data,
        concave: concave.data,
      }
    }));
  };

  if (error) return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px'
    }}>
      <InnerText>An error occurred while loading your data for polytope</InnerText>
    </View>
  );
  if (loading || data === null) {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px'
      }}>
        <InnerText>Please wait, your data is being loaded</InnerText>
      </View>
    );
  }

  if (data.points === null || data.envelope === null) {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px'
      }}>
        <InnerText>No data found, please check if selected constraints are too tight</InnerText>
      </View>
    );
  }

  return (
    <>
      {data.pointResult && data.envelope && data.concave &&
        <PolytopeChart
          envelope={data.envelope}
          concave={data.concave}
          domainsData={{
            "x": [data.pointResult.minMax.minX, data.pointResult.minMax.maxX],
            "y": [data.pointResult.minMax.minY, data.pointResult.minMax.maxY],
            "color": [data.pointResult.minMax.minColor, data.pointResult.minMax.maxColor]
          }}
          allClusters={data.pointResult.allClusters}
          clustersList={data.pointResult.clustersList}
        />
      }
    </>
  );
}
