
export function readEnvelope(json) {
    if (json["type"] === "Point") {
        return readEnvelopePoint(json["coordinates"]);
    } else if (json["type"] === "LineString") {
        return readEnvelopeLine(json["coordinates"])
    } else {
        return readEnvelopePolygone(json["coordinates"]);
    }
}

function readEnvelopePoint(data) {
    return [{x: data[0], y: data[1]}];
}

function readEnvelopeLine(data) {
    // Séparer de polygone car il ne faut pas rajouter à la fin de la liste le premier point (pour fermer le polygone)
    return [
        {x: data[0][0], y: data[0][1]},
        {x: data[1][0], y: data[1][1]}
    ];
}

function readEnvelopePolygone(data) {
    let result = [];
    for (let i in data) {
        result.push({x: data[i]["x"], y: data[i]["y"]});
    }
    result.push(result[0]); // Pour fermer le polygone
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
