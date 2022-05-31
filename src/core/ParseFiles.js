
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
    return [{x: data["x"], y: data["y"]}];
}

function readEnvelopeLine(data) {
    // Séparer de polygone car il ne faut pas rajouter à la fin de la liste le premier point (pour fermer le polygone)
    return [
        {x: data[0]["x"], y: data[0]["y"]},
        {x: data[1]["x"], y: data[1]["y"]}
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

export function readPoints(data, colorName) {
    const keys = Object.keys(data);
    const pointsGrouped = [];
    const xName = keys[0];
    const yName = keys[1];

    const invariants_length = data[keys[0]].length;
    console.assert(keys.every(key => data[key].length === invariants_length), "Assert all invariants must have the same length");

    for (let i = 0; i<invariants_length; i++) {
        const xValue = data[xName][i];
        const yValue = data[yName][i];
        if (colorName === "num_vertices") {
            pointsGrouped.push({x: xValue, y: yValue, r: 5, col: 0});
        } else {
            const colorValue = data[colorName][i];
            pointsGrouped.push({x: xValue, y: yValue, r: 5, col: colorValue});
        }
    }
    return pointsGrouped;
}

export function readGraph(data, x_invariant_name, x_invariant_value, y_invariant_name, y_invariant_value) {
    const result =[];
    const keys = Object.keys(data);
    const invariants_length = data[keys[0]].length;
    console.assert(keys.every(key => data[key].length === invariants_length), "Assert all invariants must have the same length");

    for (let i = 0; i<invariants_length; i++) {
        const xValue = data[x_invariant_name][i];
        const yValue = data[y_invariant_name][i];
        const sigValue = data["sig"][i];

        if (xValue === x_invariant_value && yValue === y_invariant_value) {
            result.push(sigValue);
        }
    }

    return result;
}