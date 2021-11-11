/* There are 3 possible layouts for the graphs (circle, grid and random layout). Layout is defined at line 110.
*/

const circleLayout = {
  name: 'circle',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding used on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  condense: false, // uses all available space on false, uses minimal space on true
  rows: undefined, // force num of rows in the grid
  cols: undefined, // force num of columns in the grid
  position: function (node) { }, // returns { row, col } for element
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
};

const gridLayout = {
  name: 'grid',

  fit: true, // whether to fit the viewport to the graph
  padding: 30, // padding used on fit
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
  nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  condense: false, // uses all available space on false, uses minimal space on true
  rows: undefined, // force num of rows in the grid
  cols: undefined, // force num of columns in the grid
  position: function (node) { }, // returns { row, col } for element
  sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
};


const randomLayout = {
  name: 'random',

  fit: true, // whether to fit to viewport
  padding: 30, // fit padding
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  animate: false, // whether to transition the node positions
  animationDuration: 500, // duration of animation in ms if enabled
  animationEasing: undefined, // easing of animation if enabled
  animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
  ready: undefined, // callback on layoutready
  stop: undefined, // callback on layoutstop
  transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts 
};


const params = {
  container: document.getElementById('graphe'),
  elements: [ /* ... */],
  style: [ /* ... */],
  layout: null,
  data: { /* ... */ },

  // initial viewport state:
  zoom: 1,
  pan: { x: 0, y: 0 },

  // interaction options:
  minZoom: 1e-2,
  maxZoom: 10,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: true,
  selectionType: 'single',
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  autolock: false,
  autoungrabify: false,
  autounselectify: false,

  // rendering options:
  headless: false,
  styleEnabled: true,
  hideEdgesOnViewport: false,
  textureOnViewport: false,
  motionBlur: false,
  motionBlurOpacity: 0.2,
  wheelSensitivity: 0.2,
  pixelRatio: 'auto'
};


const updateGraph = (sig) => {
  let graphe = cytoscape(params);
  graphe.add(readGraph6(sig));
  graphe.layout(circleLayout).run();
}


let signature = "";

let graphSelect = document.getElementById("graph-choice");
graphSelect.addEventListener('change', e => {
  signature = graphSelect.value;
})


document.getElementById('show-graph').addEventListener('click', e => {
  updateGraph(signature);
})




/* The readGraph6 and bytesArrayToN functions are translated from the networkx python module (https://networkx.org/documentation/stable/_modules/networkx/readwrite/graph6.html#from_graph6_bytes) */


function readGraph6(str) {
  /* The case where the given string begins with >>graph6<< is not managed */

  const bytesArr = unpack(str);

  for (i in bytesArr)
    bytesArr[i] -= 63;
  if (bytesArr.some((b) => b > 63)) {
    console.log("each input character must be in range(63, 127)")
    return
  }

  let [n, data] = bytesArrayToN(bytesArr);
  let nd = Math.floor((Math.floor(n * (n - 1) / 2) + 5) / 6)

  let bits = []
  for (b of data) {
    for (let i = 5; i >= 0; i--)
      bits.push((b >> i) & 1);
  }

  if (data.length !== nd) {
    console.log(`Expected ${Math.floor(n * (n - 1) / 2)} bits but got ${data.length * 6} in graph6`)
    return
  }

  const nodes = [];
  for (let i = 0; i < n; i++) {
    nodes.push({
      data: {
        id: `n${i}`
      }
    });
  }

  const edges = [];
  let cnt = 0;
  let edgesCnt = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      if (bits[cnt]) {
        edges.push({
          data: { id: `e${edgesCnt}`, source: `n${i}`, target: `n${j}` }
        })
        edgesCnt += 1;
      }
      cnt += 1;
    }
  }

  return { nodes, edges };
}


function bytesArrayToN(bytesArray) {
  if (bytesArray[0] <= 62)
    return [bytesArray[0], bytesArray.slice(1)];

  if (bytesArray[1] <= 62)
    return [(bytesArray[1] << 12) + (bytesArray[2] << 6) + bytesArray[3], bytesArray.slice(4)];

  return [(bytesArray[2] << 30)
    + (bytesArray[3] << 24)
    + (bytesArray[4] << 18)
    + (bytesArray[5] << 12)
    + (bytesArray[6] << 6)
    + bytesArray[7],
  bytesArray.slice(8)];
}


function unpack(str) {
  var bytes = [];
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    //bytes.push(char >>> 8);
    bytes.push(char & 0xFF);
  }
  return bytes;
}