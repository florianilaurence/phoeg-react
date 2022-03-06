
export const accessors = (data, param) => {
    if (data !== undefined) { // Obligatoire sinon problème, car est parfois appelé avec un undefined
        switch (param) {
            case 'x':
                return data.x;
            case 'y':
                return data.y;
            case 'r':
                return data.r;
            default:
                return data.col;
        }
    }
}

// Fonctions pour regrouper les points et les calculs qui y sont associés
export const regroupPointsByColor = (points) => {
    let pointsGr = {};
    for (let point of points) {
        if (pointsGr[point.col] == null) {
            pointsGr[point.col] = [];
        }
        pointsGr[point.col].push(point);
    }
    return {
        cols: Object.keys(pointsGr).map(x => parseInt(x)).sort((a, b) => a - b),
        pointsGr: pointsGr
    };
}

export const computeAllCluster = (groupedByColor, colors, points) => {
    let currentNbCluster = 2;
    let currentSizeCluster = Math.floor(colors.length / currentNbCluster);
    let viewedNb = [1];
    let result = {
        1: [points]
    };
    while (currentNbCluster <= colors.length) {
        let currentClusters = regroupPointsInCluster(currentSizeCluster, colors, groupedByColor);
        if (!viewedNb.includes(currentClusters.length)) {
            viewedNb.push(currentClusters.length);
            result[currentClusters.length] = currentClusters;
        }
        currentNbCluster += 1;
        currentSizeCluster = Math.ceil(colors.length / currentNbCluster);
    }
    return {
        clusterPossible: viewedNb.sort((a, b) => a - b),
        allClusters: result
    };
}

export const regroupPointsInCluster = (sizeCluster, colors, groupedPointsByColor) => {
    let result = [];
    let start = 0;
    let end = sizeCluster;
    while (end <= colors.length - sizeCluster) {
        let temp = [];
        while (start < end) {
            temp.push(...groupedPointsByColor[colors[start]]);
            start += 1;
        }
        result.push(temp);
        end += sizeCluster;
    }
    let temp = [];
    while (start < colors.length) {
        temp.push(...groupedPointsByColor[colors[start]]);
        start += 1;
    }
    result.push(temp);
    return result;
}

// Fonctions pour construire les noms de domaine lors d'une coloration avec choix
export const computeTagsDomainIndep = (currentGroupedPoints) => {
    let result = [];
    if (currentGroupedPoints !== undefined) {
        for (let group of currentGroupedPoints) {
            result.push(constructTagName(group));
        }
    }
    return result;
}


// Fonctions pour construire les noms de domaine lors d'une coloration avec gradient
export const computeTagsDomainGradient = (currentGroupedPoints) => {
    let resultTags = [];
    if (currentGroupedPoints !== undefined) {
        for (let i = 0; i < currentGroupedPoints.length; i++) {
            let group = currentGroupedPoints[i];
            resultTags.push(constructTagName(group));
        }
    }
    return resultTags;
}

export const constructTagName = (group) => {
    let min = Math.min(...group.map((d) => d.col));
    let max = Math.max(...group.map((d) => d.col));
    if (min !== max) {
        return `[${min};${max}]`;
    } else {
        return `${min}`;
    }
}

export const computeColorsRange = (newDomain, range) => {
    let result = [];
    if (range.length > newDomain.length) {
        result = range.slice(0, newDomain.length); // Copie du nombre de couleurs nécessaires
    } else if (range.length < newDomain.length) {
        result = range.slice(); // Copier l'entièreté des précédentes couleurs
        let i = range.length;
        while (i < newDomain.length) { // Compléter avec suffisamment de couleurs
            let color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            while (color in result) {
                color = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
            }
            result.push(color);
            i++;
        }
    }
    return result;
}