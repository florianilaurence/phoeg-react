import $ from 'jquery';
import {Chart} from "react-chartjs-2";
import {pickColorIntoGradient, GRADIENT} from './gradient'

export default class ParseFiles {
    constructor(invariant, measure, number) {
        this.invariant = invariant;
        this.measure = measure;
        this.number = number;
        this.radius = 4; // The radius of the points in the metagraph
    }

    updatePolytope() {
        $.get(`./files/data_${this.invariant}/enveloppes/enveloppe-${this.number}.csv`, responseEnv => {
            const envelope = this.readEnvelope(this.parseCSV(responseEnv), this.invariant, this.measure);
            $.get(`./files/data_${this.invariant}/points/points-${this.number}.csv`, responseGraphe => {
                const points = this.readPoints(this.parseCSV(responseGraphe), this.invariant, this.measure, 0);
                this.initChart(envelope, points);
            })
        })
    }

    parseCSV(str) {
        let arr = str.split(/\r?\n/g);
        let firstLine = arr.shift().split(',');
        let varMapping = {};
        for (let i in firstLine) {
            varMapping[firstLine[i]] = i;
        }
        arr.pop();
        return { arr, varMapping };
    }

    readEnvelope(response, xVar, yVar) {
        let arr = response['arr'];
        let varMapping = response['varMapping'];
        const result = [];
        for (let i in arr) {
            let line = arr[i].split(',');
            let xVal = line[varMapping[xVar]];
            let yVal = line[varMapping[yVar]];
            result.push({ x: xVal, y: yVal });
        }
        return result;
    }

    readPoints(response, xVar, yVar, colorVar) {
        const pointsGrouped = {};
        let arr = response['arr'];
        let varMapping = response['varMapping'];
        for (let i in arr) {
            let line = arr[i].split(',');
            let xVal = line[varMapping[xVar]];
            let yVal = line[varMapping[yVar]];
            let colorVal = line[varMapping[colorVar]];
            if (!pointsGrouped.hasOwnProperty(colorVal))
                pointsGrouped[colorVal] = [];
            pointsGrouped[colorVal].push({ x: xVal, y: yVal, r: this.radius });
        }
        const result = [];
        const groupsKeys = Object.keys(pointsGrouped).map(x => parseInt(x)).sort((a, b) => a >= b);
        const min = groupsKeys[0];
        const max = groupsKeys[groupsKeys.length - 1];
        for (let i in groupsKeys) {
            const groupVal = groupsKeys[i];
            result.push({
                type: 'bubble',
                label: `${colorVar} = ${groupVal}`,
                data: pointsGrouped[groupVal],
                backgroundColor: pickColorIntoGradient(GRADIENT, 100 * (groupVal - min) / (max - min)),
                borderColor: "transparent",
            })
        }
        return result;
    }

    initChart(convexHull, points) {
        let chart = new Chart( {
            type: 'bubble',
            data: {
                datasets: [
                    {
                        type: 'line',
                        label: "Enveloppe",
                        data: convexHull,
                        lineTension: 0,
                        fill: false,
                        backgroundColor: 'black',
                        borderColor: 'black',
                        pointRadius: 0},
                    ...points
                ]
            },
            options: {
                legend: {
                    display: true},
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Number of edges'
                        }
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: this.invariant
                        }
                    }],
                },
            animation: false,
            parsing: false,
            responsive: true,
            maintainAspectRatio: false,
            }
        })
    }

}