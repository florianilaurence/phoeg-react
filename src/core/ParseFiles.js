
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

export function readPoints(data, invariantX, invariantY, invariantColor) {
    const result = [];
    for (let i in data) {
        let xVal = data[i][invariantX];
        let yVal = data[i][invariantY];
        let color = data[i][invariantColor];
        result.push({x: xVal, y: yVal, r: 1, col: color});
        // ToDo possibilité d'ajouter un invariant supplémentaire pour le rayon des cercles
    }
    return result;
}

/**
 *
 * @param data Données du Json
 * @param numberEdges Nombre d'arrêtes demandé (y)
 * @param invariantValue Valeur de l'invariant demandée (x)
 * @param invariantName Nom de l'invariant
 * @returns {*[]} Liste des signatures de graphes correspondant aux critères
 */

export function readGraph(data, numberEdges, invariantName, invariantValue) {
    let result =[];
    for (let d of data) {
        if (d["m"] === numberEdges && d[invariantName] === invariantValue) {
            result.push(d["sig"]);
        }
    }
    return result;
}
