import React, {useCallback, useEffect, useState} from "react";
import {API_URL} from "../../.env";
import {View} from "react-native-web";
import SubTitleText from "../styles_and_settings/SubTitleText";
import "./Polytopes.css"
import PolytopeForm from "./PolytopeForm";
import axios from "axios";
import InnerText from "../styles_and_settings/InnerText";
import {LEFT, RIGHT} from "../../designVars";

const compare = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

const parseToLabelValueObject = (list) => {
  return list.map(item => {
    return {
      label: item.name,
      value: item.tablename
    }
  });
};

export default function Polytope({key, num}) {
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let request = new URL(`${API_URL}/invariants?type=any`);

    fetchData(request).then(d => {
      d.push({tablename: "mult", datatype: -1, name: "Multiplicity", description: ""}); // Add multiplicity because not really a table of invariants in database
      d.sort(compare)

      setData({
        invariantsAxis: parseToLabelValueObject(d.filter(e => 2 <= e.datatype && e.datatype <= 4)),
        invariantsColoration: parseToLabelValueObject(d.filter(e => (2 <= e.datatype && e.datatype <= 4) || e.datatype === -1)),
        invariantsConstraint: parseToLabelValueObject(d.filter(e => 2 <= e.datatype && e.datatype <= 5)),
        types: d.filter(e => 2 <= e.datatype && e.datatype <= 5).map(e => e.datatype)
      });
      setLoading(false);
    });
    forceUpdate();
  }, [])

  const fetchData = (request) => {
    return axios.get(request)
      .then(res => {
        return res.data;
      })
      .catch(err => {
        setError(err);
        setLoading(false);
        return null;
      });
  }

  if (error) return (
    <View style={{
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px'
    }}>
      <InnerText>An error occurred while loading invariants list</InnerText>
    </View>
  );

  if (loading || data === null) {
    return (
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: '200px'
      }}>
        <InnerText>Please wait, we are contacting the server</InnerText>
      </View>
    );
  }

  return (
    <View style={{
      flexGrow: 1,
      width: '100%'
    }}>
      <View style={{paddingLeft: LEFT, paddingRight: RIGHT}}>
        <SubTitleText>{"Polytope " + num}</SubTitleText>
      </View>
      <PolytopeForm
        invariantsAxis={data.invariantsAxis}
        invariantsColoration={data.invariantsColoration}
        invariantsConstraint={data.invariantsConstraint}
        types={data.types}
      />
    </View>
  )
}