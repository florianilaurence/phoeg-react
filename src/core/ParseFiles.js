import $ from 'jquery';
import {pickColorIntoGradient, GRADIENT} from './gradient'

export default class ParseFiles {
    constructor(invariant, coloration, number) {
        this.x_axis = invariant;
        this.y_axis = "m";  // TODO à remplacer pour qu'il soit récupérer directement dans le fichier
        this.coloration = coloration;
        this.number = number;
        this.radius = 4;    // TODO à remplacer pour qu'il soit plus facilement modifiable
    }

    parseCSV(str) {
        let arr = str.split(/\r?\n/g);
        let firstLine = arr.shift().split(',');
        let varMapping = {};
        for (let i in firstLine) {
            varMapping[firstLine[i]] = i;
        }
        arr.pop();
        return {arr, varMapping};
    }

    readEnvelope() {
        const result = [];
        $.get(`./files/data_${this.x_axis}/enveloppes/enveloppe-${this.number}.csv`, response => {
            this.parseCSV(response);
            let arr = response['arr'];
            let varMapping = response['varMapping'];
            for (let i in arr) {
                let line = arr[i].split(',');
                let xVal = line[varMapping[this.x_axis]];
                let yVal = line[varMapping[this.y_axis]];
                result.push({"x": xVal, "y": yVal});
            }
        })
        return result;
    }

    readPoints() {
        const result = []
        $.get(`./files/data_${this.x_axis}/points/points-${this.number}.csv`, response => {
            const pointsGrouped = {};
            this.parseCSV(response);
            let arr = response['arr'];
            let varMapping = response['varMapping'];
            for (let i in arr) {
                let line = arr[i].split(',');
                let xVal = line[varMapping[this.x_axis]];
                let yVal = line[varMapping[this.y_axis]];
                let colorVal = line[varMapping[this.coloration]];
                if (!pointsGrouped.hasOwnProperty(colorVal))
                    pointsGrouped[colorVal] = [];

                pointsGrouped[colorVal].push({ "x": xVal, "y": yVal, "r": this.radius });
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