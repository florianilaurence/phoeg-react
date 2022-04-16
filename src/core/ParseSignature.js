
function parseToBits(data) {
    let bits = []
    for (let b of data) {
        for (let i = 5; i >= 0; i--) {
            bits.push((b >> i) & 1);
        }
    }
    return bits;
}

function unpack(str) {
    let bytes = [];
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        bytes.push(char & 0xFF);
    }
    return bytes;
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

function constructEdges(bits, n) {
    const edges = [];
    let cnt = 0;
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if (bits[cnt]) {
                edges.push({data: {source: i, target: j}});
            }
            cnt += 1;
        }
    }
    return edges;
}

const constructComplementEdges = (bits, n) => {
    const edgesCompl = [];
    let cnt = 0;
    for (let j = 1; j < n; j++) {
        for (let i = 0; i < j; i++) {
            if (!bits[cnt]) {
                edgesCompl.push({data: {source: i, target: j}});
            }
            cnt += 1;
        }
    }
    return edgesCompl;
}

export function computeNodesEdges(signature) {
    const bytesArr = unpack(signature);
    for (let i in bytesArr) {
        bytesArr[i] -= 63;
    }
    let [n, data] = bytesArrayToN(bytesArr);
    let bits = parseToBits(data);

    return {
        nodes: Array.from(Array(n).keys()).map(i => ({data: {id: i}})),
        edges: constructEdges(bits, n),
        edgesComplement: constructComplementEdges(bits, n),
    };
}