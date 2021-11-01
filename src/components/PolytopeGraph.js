import {Chart} from "chart.js";

const redGreenGradient = [
    [0, 0, 255, 30],
    [50, 255, 255, 30],
    [100, 255, 0, 30]];

const GRADIENT = redGreenGradient;

function pickColorIntoGradient(gradient, per) {
    if (per < 0 || per > 100)
        return;
    let i = 1;
    while (gradient[i][0] < per)
        i += 1;

    let d1 = per - gradient[i - 1][0];
    let d2 = gradient[i][0] - per;
    let d = gradient[i][0] - gradient[i - 1][0];
    let p1 = d2 / d;
    let p2 = d1 / d;
    let r = gradient[i - 1][1] * p1 + gradient[i][1] * p2;
    let g = gradient[i - 1][2] * p1 + gradient[i][2] * p2;
    let b = gradient[i - 1][3] * p1 + gradient[i][3] * p2;

    return `rgb(${r},${g},${b})`
}

function parseCSV(str) {
    let arr = str.split(/\r?\n/g);
    let firstLine = arr.shift().split(',');
    let varMapping = {}
    for (let i in firstLine)
        varMapping[firstLine[i]] = i;

    arr.pop();
    return {arr, varMapping};
}

function readEnveloppe(response, xVar, yVar) {
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

function readFile(path) {
    fetch('essai.txt')
        .then(response => response.text())
        .then(data => {
            alert(typeof data);
        });
}

export default function PolytopeGraph(props) {

    const readPoints = (response, xVar, yVar, colorVar) => {
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
            pointsGrouped[colorVal].push({ x: xVal, y: yVal, r: 4 });
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

    const resetCanvas = () => {
        let polytopeCanvas = document.getElementById('polytope-canvas');
        let polytopeContainer = polytopeCanvas.parentElement;
        polytopeCanvas.remove();
        let newCanvas = document.createElement('canvas');
        newCanvas.id = "polytope-canvas";
        polytopeContainer.append(newCanvas);
        return document.getElementById('polytope-canvas');
    };


    //initalize the polytope with the values computed above.
    const initChart = (convexHull, points) => {
        const canvas = resetCanvas();
        return new Chart(canvas.getContext('2d'), {
        type: 'bubble',
        data: {
            datasets: [{
                type: 'line',
                label: "Enveloppe",
                data: convexHull,
                lineTension: 0,
                fill: false,
                backgroundColor: 'black',
                borderColor: 'black',
                pointRadius: 0
            },
                ...points]
        },
        options: {}

    });
    };
/*
    const updatePolytope = () => {
        let reader = new FileReader();
        let file = FileViewer.open('../assets/'+props.invariant+'/enveloppes/enveloppe-'+props.option+'.csv')
        reader.readAsText(file)


        const path = // absolute-path-to-my-local-file.
        FileViewer.open(`../assets/${props.invariant}/enveloppes/enveloppe-${props.option}.csv`)
            .then(() => {
                const enveloppe = readEnveloppe(parseCSV())})
            .catch(error => {
                // error
        });

        document.get(`../assets/${props.invariant}/enveloppes/enveloppe-${props.option}.csv`, responseEnv => {
            const enveloppe = readEnveloppe(parseCSV(responseEnv));
            document.get(`../assets/${props.invariant}/points/points-${props.number}.csv`, responseGraphe => {
                const points = readPoints(parseCSV(responseGraphe), document.getElementById('coloringSelect').value);
                initChart(enveloppe, points);
            })
        })
    };*/

    return (
        <div>
            <h4>invariant : {props.invariant} number : {props.number} option : {props.option}</h4>
            <p>
                {readFile("essai.txt")}
            </p>
        </div>
    )
}