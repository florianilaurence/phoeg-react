import CytoscapeComponent from "react-cytoscapejs";
import CoseBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import cola from "cytoscape-cola";
import dagre from "cytoscape-dagre";
import Cytoscape from "cytoscape";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Autocomplete,
  Box,
  Grid,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { blueGrey, green } from "@mui/material/colors";
import {
  unpack,
  bytesArrayToN,
  parseToBits,
  constructEdges,
  constructComplementEdges,
} from "../../core/ParseSignature";

const computeNodesEdges = (sign: string) => {
  const resNodes = new Array<Node>();
  const resEdges = new Array<Edge>();
  const resEdgesComplement = new Array<Edge>();

  const bytesArr = unpack(sign);
  for (let i in bytesArr) {
    bytesArr[i] -= 63;
  }
  let [n, data] = bytesArrayToN(bytesArr);

  let bits = parseToBits(data);
  for (let i = 0; i < n; i++) {
    resNodes.push({ data: { id: i.toString() } });
  }

  const edgesTemp = constructEdges(bits, n);
  for (let i = 0; i < edgesTemp.length; i++) {
    resEdges.push({
      data: {
        source: edgesTemp[i].data.source.toString(),
        target: edgesTemp[i].data.target.toString(),
      },
    });
  }

  const edgesTempComplement = constructComplementEdges(bits, n);
  for (let i = 0; i < edgesTempComplement.length; i++) {
    resEdgesComplement.push({
      data: {
        source: edgesTempComplement[i].data.source.toString(),
        target: edgesTempComplement[i].data.target.toString(),
      },
    });
  }

  return { resNodes, resEdges, resEdgesComplement };
};

Cytoscape.use(CoseBilkent);
Cytoscape.use(fcose);
Cytoscape.use(cola);
Cytoscape.use(dagre);

interface NewGraphProps {
  sign: string;
  width: number;
}

const layouts = {
  Random: {
    name: "random",
    animate: true,
  },
  Circle: {
    name: "circle",
    animate: true,
  },
  Cose: {
    name: "cose",
    animate: true,
  },
  Grid: {
    name: "grid",
    animate: true,
  },
  Breadthfirst: {
    name: "breadthfirst",
    animate: true,
  },
  Fcose: {
    name: "fcose",
    animate: true,
  },
  Cola: {
    name: "cola",
    animate: true,
    maxSimulationTime: 40000,
  },
  Dagre: {
    name: "dagre",
    animate: true,
  },
};

export interface Node {
  data: { id: string };
}

export interface Edge {
  data: { source: string; target: string };
}

const options = Object.keys(layouts);

const colorGraph = blueGrey[800];
const colorComplement = green[500];

const NewGraph = ({ sign, width }: NewGraphProps) => {
  const [nodes, setNodes] = useState(new Array<Node>());
  const [edges, setEdges] = useState(new Array<Edge>());
  const [edgesComplement, setEdgesComplement] = useState(new Array<Edge>());
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);
  const [layout, setLayout] = useState(layouts.Circle);
  const [inputLayout, setInputLayout] = useState("");
  const [isComplement, setIsComplement] = useState(false);
  const cyRef = useRef();

  useEffect(() => {
    const { resNodes, resEdges, resEdgesComplement } = computeNodesEdges(sign);
    setNodes(resNodes);
    setEdges(resEdges);
    setEdgesComplement(resEdgesComplement);
    forceUpdate();
  }, [sign, forceUpdate]);

  const handleChangeChecked = (event) => {
    setIsComplement(event.target.checked);
    forceUpdate();
  };

  const renderCytoscape = (elmts, color: string) => {
    return (
      <CytoscapeComponent
        elements={elmts}
        minZoom={0.5}
        maxZoom={2}
        pan={{ x: width / 2, y: width / 2 }}
        stylesheet={[
          {
            selector: "node",
            style: {
              width: 35,
              height: 35,
              "background-color": "#000",
              "border-color": "#000",
              "border-width": 2,
            },
          },
          { selector: "edge", style: { width: 5, "line-color": color } },
        ]}
        cy={(cy: any) => {
          cyRef.current = cy;
          cy.layout(layout).run();
          cy.fit();
        }}
        style={{
          width: width,
          height: width,
          border: "1px solid black",
        }}
      />
    );
  };

  if (!nodes || nodes.length === 0) return <>Loading</>;

  return (
    <Box>
      {" "}
      <Grid container spacing={1}>
        <Grid
          item
          xs={3}
          display="flex"
          justifyContent="center"
          alignContent="center"
        >
          <Typography variant="body1" align="center" fontSize={13}>
            Complement?
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Tooltip
            title={
              isComplement
                ? "Show the original graph"
                : "Show the complement of the graph"
            }
          >
            <Switch
              checked={isComplement}
              onChange={() =>
                handleChangeChecked({ target: { checked: !isComplement } })
              }
              color="success"
              size="small"
            />
          </Tooltip>
        </Grid>
        <Grid item xs={6}>
          <Tooltip title="Change layout">
            <Autocomplete
              value={layout.name}
              onChange={(event, value) =>
                setLayout(value ? layouts[value] : "")
              }
              inputValue={inputLayout}
              onInputChange={(event, value) => setInputLayout(value)}
              id="graph-layout-select"
              options={options}
              clearIcon={null}
              size="small"
              renderInput={(params) => <TextField {...params} label="Layout" />}
            />
          </Tooltip>
        </Grid>
      </Grid>
      {isComplement ? (
        <Box sx={{ mt: 1 }}>
          {renderCytoscape([...nodes, ...edgesComplement], colorComplement)}
          <Typography
            variant="body1"
            align="center"
            fontSize={13}
            color={colorComplement}
          >
            Complement
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 1 }}>
          {renderCytoscape([...nodes, ...edges], colorGraph)}
          <Typography
            variant="body1"
            align="center"
            fontSize={13}
            color={colorGraph}
          >
            Original
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NewGraph;
