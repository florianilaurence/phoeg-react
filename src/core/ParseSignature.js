export function parseToBits(data) {
  let bits = [];
  for (let b of data) {
    for (let i = 5; i >= 0; i--) {
      bits.push((b >> i) & 1);
    }
  }
  return bits;
}

export function unpack(str) {
  let bytes = [];
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    bytes.push(char & 0xff);
  }
  return bytes;
}

export function bytesArrayToN(bytesArray) {
  if (bytesArray[0] <= 62) return [bytesArray[0], bytesArray.slice(1)];

  if (bytesArray[1] <= 62)
    return [
      (bytesArray[1] << 12) + (bytesArray[2] << 6) + bytesArray[3],
      bytesArray.slice(4),
    ];

  return [
    (bytesArray[2] << 30) +
      (bytesArray[3] << 24) +
      (bytesArray[4] << 18) +
      (bytesArray[5] << 12) +
      (bytesArray[6] << 6) +
      bytesArray[7],
    bytesArray.slice(8),
  ];
}

export function constructEdges(bits, n) {
  const edges = [];
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
}

export const constructComplementEdges = (bits, n) => {
  const edgesCompl = [];
  let cnt = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      if (!bits[cnt]) {
        edgesCompl.push({ data: { source: i, target: j } });
      }
      cnt += 1;
    }
  }
  return edgesCompl;
};
