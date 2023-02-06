
export const accessors = (data, param) => {
    if (data !== undefined) { // Obligatoire sinon problème, car est parfois appelé avec un undefined
        switch (param) {
            case 'x':
                return data.x;
            case 'y':
                return data.y;
            case 'r':
                return data.r;
            case 'mult':
                return data.mult;
            default:
                return data.color;
        }
    }
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
    let min = Math.min(...group.map((d) => d.color));
    let max = Math.max(...group.map((d) => d.color));
    if (min !== max) {
        return `[${min} ; ${max}]`;
    } else {
        return ` ${min} `;
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