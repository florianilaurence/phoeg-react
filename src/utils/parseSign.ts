export const parseToBits = (data: any): Array<number> => {
  const bits: Array<number> = [];
  for (let b of data) {
    for (let i = 5; i >= 0; i--) {
      bits.push((b >> i) & 1);
    }
  }
  return bits;
};

export const unpack = (str: string): Array<number> => {
  const bytes: Array<number> = [];
  for (let i = 0; i < str.length; i++) {
    bytes.push(str.charCodeAt(i));
  }
  return bytes;
};

export const bytesArrayToN = (
  bytesArray: Array<number>
): {
  n: number;
  bytesArray: Array<number>;
} => {
  if (bytesArray[0] <= 62)
    return { n: bytesArray[0], bytesArray: bytesArray.slice(1) };

  if (bytesArray[1] <= 62)
    return {
      n: (bytesArray[1] << 12) + (bytesArray[2] << 6) + bytesArray[3],
      bytesArray: bytesArray.slice(4),
    };

  return {
    n:
      (bytesArray[2] << 30) +
      (bytesArray[3] << 24) +
      (bytesArray[4] << 18) +
      (bytesArray[5] << 12) +
      (bytesArray[6] << 6) +
      bytesArray[7],
    bytesArray: bytesArray.slice(8),
  };
};

export const constructEdges = (bits: Array<number>, n: number) => {
  const edges: Array<Edge> = [];
  let cnt = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      if (bits[cnt]) {
        edges.push({ data: { source: i, target: j } });
      }
      cnt += 1;
    }
  }
  return edges;
};

interface Edge {
  data: {
    source: number;
    target: number;
  };
}

export const constructComplementEdges = (bits: Array<number>, n: number) => {
  const edges: Array<Edge> = [];
  let cnt = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      if (!bits[cnt]) {
        edges.push({ data: { source: i, target: j } });
      }
      cnt += 1;
    }
  }
  return edges;
};
