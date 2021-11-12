
export function readEnvelope(data, x_axis) {
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
    let str = "";
    for (let i in result) {
        str = str + "x " + result[i]['x'] + " y " + result[i]['y'] + "\n";
    }
    return result;
}

export function readPoints(data) {
    return [{data: [{x: 0, y: 0, r: 5}]}];
}
