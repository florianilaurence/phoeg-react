
export function readEnvelope(json) {
    if (json["type"] === "Point") {
        return readEnvelopePoint(json["coordinates"]);
    } else {
        return readEnvelopePolygone(json["coordinates"]);
    }
}

function readEnvelopePoint(data) {
    return [{x: data[0], y: data[1]}];
}

function readEnvelopePolygone(data) {
    let result = [];
    for (let coord in data) {
        result.push({x: coord[0], y: coord[1]});
    }
    return result;
}

export function readPoints(data, invariantX) {
    // "m" --> Oy
    // "avcol" "eci" ... --> Ox
    // "chi" --> Coloration
    // "mult" --> Coloration
    let result = [];
    for (let i in data) {
        result.push({x: data[i][invariantX], y: data[i]["m"], r: 5});
    }
    return result;
}
