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