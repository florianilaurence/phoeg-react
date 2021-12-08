import {pickColorIntoGradient} from "./gradient";

let GRADIENT = [
  [0, 0, 255, 30],
  [50, 255, 255, 30],
  [100, 255, 0, 30]];

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

export function readPoints(data, invariantX, coloration) {
    // "m" --> Oy
    // "avcol" "eci" ... --> Ox
    // "chi" --> Coloration
    // "mult" --> Coloration

    const pointsGrouped = {};
    for (let i in data) {
        let xVal = data[i][invariantX];
        let yVal = data[i]["m"]; //TODO A modifier
        let color = data[i][coloration];
        if (pointsGrouped[color] == null) {
            pointsGrouped[color] = [];
        }
        pointsGrouped[color].push({x: xVal, y: yVal, r: 5});
    }
    let result = [];
    const groupsKeys = Object.keys(pointsGrouped).map(x => parseInt(x)).sort((a, b) => a >= b);
    const min = groupsKeys[0];
    const max = groupsKeys[groupsKeys.length - 1];
    for (let i in groupsKeys) {
        const groupVal = groupsKeys[i];
        result.push({
            type: 'bubble',
            label: coloration + " = " + groupVal,
            data: pointsGrouped[groupVal],
            backgroundColor: pickColorIntoGradient(GRADIENT, 100 * (groupVal - min) / (max - min)),
            borderWidth: 1,
            hoverBorderColor: '0x000000',
            pointStyle: 'triangle'
        })
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
