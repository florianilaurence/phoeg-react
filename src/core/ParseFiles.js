import $ from 'jquery';
import {pickColorIntoGradient, GRADIENT} from './gradient'

function parseCSV(str) {
    let arr = str.split(/\r?\n/g);
    let firstLine = arr.shift().split(',');
    let varMapping = {};
    for (let i in firstLine) {
        varMapping[firstLine[i]] = i;
    }
    arr.pop();
    return {arr, varMapping};
}

export function readEnvelope(x_axis, coloration, number) {
    let path = "https://florianilaurence.github.io/assets/data_" + x_axis
        + "/enveloppes/enveloppe-" + number + ".csv"
    $.get(path, function(data) {
        let result = [];
        let y_axis = "m";
        let lines = data.split("\n");
        let firstLine = lines[0].split(',');
        if (firstLine[0] === x_axis) {
            y_axis = firstLine[1];
            let i = 1;
            while (i < lines.length) {
                if (lines[i] !== '') {
                    let currentLine = lines[i].split(',');
                    result.push({x: parseFloat(currentLine[0]), y: parseFloat(currentLine[1])});
                }
                i++;
            }
        }
        return result;
    });
}


export default class ParseFiles {

    constructor(invariant, coloration, number) {
        this.x_axis = invariant;
        this.y_axis = "m";
        this.coloration = coloration;
        this.number = number;
        this.radius = 4;    // TODO à remplacer pour qu'il soit plus facilement modifiable
    }



    readPoints() {
        let result = [];
        let path = "https://florianilaurence.github.io/assets/data_" + this.x_axis
                + "/points/points-" + this.number + ".csv"
        $.get(path, function(data) {
            let response = parseCSV(data);
            const pointsGrouped = {};
            let arr = response['arr'];
            let varMapping = response['varMapping'];
            for (let i in arr) {
                let line = arr[i].split(',');
                let xVal = line[varMapping[this.x_axis]];
                let yVal = line[varMapping[this.y_axis]];
                let colorVal = line[varMapping[this.coloration]];
                if (!pointsGrouped.hasOwnProperty(colorVal))
                    pointsGrouped[colorVal] = [];

                pointsGrouped[colorVal].push({ x: xVal, y: yVal, r: this.radius });
            }
            const groupsKeys = Object.keys(pointsGrouped).map(x => parseInt(x)).sort((a, b) => a >= b);
            const min = groupsKeys[0];
            const max = groupsKeys[groupsKeys.length - 1];
            for (let i in groupsKeys) {
                const groupVal = groupsKeys[i];
                result.push({
                    type: 'bubble',
                    label: `${this.coloration} = ${groupVal}`,
                    data: pointsGrouped[groupVal],
                    backgroundColor: pickColorIntoGradient(GRADIENT, 100 * (groupVal - min) / (max - min)),
                    borderColor: "transparent",
                })
            }
        })
        return result;
    }
}