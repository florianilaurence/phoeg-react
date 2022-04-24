import {useCallback, useEffect, useState} from "react";
import {accessors, computeAllCluster, regroupPointsByColor} from "../../core/utils_PolytopeChart";
import {View} from "react-native-web";
import InnerText from "../styles_and_settings/InnerText";
import PolytopeChart from "./PolytopeChart";

export default function PolytopeCalc(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [domainsData, setDomainsData] = useState(null);
    const [pointsGrouped, setPointsGrouped] = useState(null);
    const [allClusters, setAllClusters] = useState(null);
    const [clustersList, setClustersList] = useState(null);

    useEffect(() => {
        const minX = Math.floor(Math.min(
            Math.min(...props.points.map((d) => accessors(d, "x"))),
            Math.min(...props.envelope.map((d) => accessors(d, "x"))))
        );
        const maxX = Math.ceil(Math.max(
            Math.max(...props.points.map((d) => accessors(d, "x"))),
            Math.max(...props.envelope.map((d) => accessors(d, "x"))))
        );
        const minY = Math.floor(Math.min(
            Math.min(...props.points.map((d) => accessors(d, "y"))),
            Math.min(...props.envelope.map((d) => accessors(d, "y"))))
        );
        const maxY = Math.ceil(Math.max(
            Math.max(...props.points.map((d) => accessors(d, "y"))),
            Math.max(...props.envelope.map((d) => accessors(d, "y"))))
        );
        const minColor = Math.min(...props.points.map((d) => accessors(d)));
        const maxColor = Math.max(...props.points.map((d) => accessors(d)));
        setDomainsData({
            x: [minX, maxX],
            y: [minY, maxY],
            color: [minColor, maxColor]
        });
        let tempPointsGrouped = regroupPointsByColor(props.points);
        setPointsGrouped(tempPointsGrouped);
        let colorsList = Object.keys(tempPointsGrouped).map(x => parseInt(x)).sort((a, b) => a - b);
        const allClustersComputed = computeAllCluster(tempPointsGrouped, colorsList, props.points);
        setAllClusters(allClustersComputed.allClusters);
        setClustersList(allClustersComputed.clustersList);
        forceUpdate();
    }, [props.points, props.envelope]);

    if (domainsData === null || pointsGrouped === null || allClusters === null || clustersList === null) {
        return (
            <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px'
            }}>
                <InnerText>Please wait, your data are being processed</InnerText>
            </View>
        );
    }

    return (
        <PolytopeChart
            graphPath={props.graphPath}
            order={props.order}
            invariantX={props.invariantX}
            invariantY={props.invariantY}
            invariantColor={props.invariantColor}
            constraints={props.constraints}
            envelope={props.envelope}
            points={props.points}
            domainsData={domainsData}
            pointsGrouped={pointsGrouped}
            allClusters={allClusters}
            clustersList={clustersList}
        />
    );
}