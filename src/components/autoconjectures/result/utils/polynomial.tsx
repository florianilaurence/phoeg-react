export default class Polynomial {
  constructor(readonly coefficients: number[], readonly degree: number) {}

  evaluate(x: number): number {
    let result = 0;
    for (let i = 0; i <= this.degree; i++) {
      result += this.coefficients[i] * Math.pow(x, i);
    }
    return result;
  }

  addPolynomial(p: Polynomial): Polynomial {
    const newCoefficients: Array<number> = [];
    const newDegree = Math.max(this.degree, p.degree);
    for (let i = 0; i <= newDegree; i++) {
      newCoefficients[i] =
        (this.coefficients[i] || 0) + (p.coefficients[i] || 0);
    }
    return new Polynomial(newCoefficients, newDegree);
  }

  multiplyPolynomial(p: Polynomial): Polynomial {
    if (this.coefficients.length === 0) return p;

    if (p.coefficients.length === 0) return this;
    const prod: Array<number> = [];
    const n = this.degree;
    const m = p.degree;
    for (let i = 0; i <= n + m; i++) prod[i] = 0;
    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++)
        prod[i + j] += p.coefficients[i] * this.coefficients[j];
    }
    return new Polynomial(prod, n + m);
  }

  divideNumber(n: number): Polynomial {
    const new_coeffs: Array<number> = [];
    for (let i = 0; i <= this.degree; i++) {
      new_coeffs.push(this.coefficients[i] / n);
    }
    return new Polynomial(new_coeffs, this.degree);
  }

  simplify(): Polynomial {
    let new_coeffs: Array<number> = [];
    for (let coeff of this.coefficients) {
      new_coeffs.push(Math.round(coeff * 100) / 100);
    }
    for (let i = new_coeffs.length - 1; i >= 0; i--) {
      const coeff = new_coeffs[i];
      if (coeff === 0) new_coeffs = new_coeffs.slice(0, i);
      else break;
    }
    const res = new Polynomial(new_coeffs, new_coeffs.length - 1);
    return res;
  }

  toString(): string {
    if (this.coefficients.length === 0) return "";
    let degree = this.degree;
    let result = "";
    result +=
      this.coefficients[degree] === 1
        ? this.x_factor("x", degree)
        : this.coefficients[degree] + this.x_factor("x", degree);
    degree -= 1;

    while (degree > 0) {
      let coeff = this.coefficients[degree];
      if (coeff > 1) result += " + " + coeff + this.x_factor("x", degree);
      else if (coeff === 1) result += " + " + this.x_factor("x", degree);
      else if (coeff < 0)
        result += " - " + Math.abs(coeff) + this.x_factor("x", degree);
      degree -= 1;
    }

    if (degree === 0) {
      result +=
        this.coefficients[degree] > 0
          ? " + " + this.coefficients[degree]
          : " - " + Math.abs(this.coefficients[degree]);
    }

    return result;
  }

  string_replace_x(x_var: string): string {
    if (this.coefficients.length === 0) return "";
    let degree = this.degree;
    let result = "";
    result +=
      this.coefficients[degree] === 1 && degree === 0
        ? 1
        : this.coefficients[degree] === 1
        ? this.x_factor(x_var, degree)
        : this.coefficients[degree] + this.x_factor(x_var, degree);
    degree -= 1;

    while (degree > 0) {
      let coeff = this.coefficients[degree];
      if (coeff > 1) result += " + " + coeff + this.x_factor(x_var, degree);
      else if (coeff === 1) result += " + " + this.x_factor(x_var, degree);
      else if (coeff < 0)
        result += " - " + Math.abs(coeff) + this.x_factor(x_var, degree);
      degree -= 1;
    }

    if (degree === 0) {
      result +=
        this.coefficients[degree] > 0
          ? " + " + this.coefficients[degree]
          : " - " + Math.abs(this.coefficients[degree]);
    }

    return result;
  }

  string_replace_coeff(coeffs: Array<string>, var_name: string): string {
    if (coeffs.length === 0) return "";
    let degree = this.degree;
    let result = "";
    while (degree >= 0) {
      let coeff = coeffs[degree];
      result += degree === this.degree ? "" : " + ";
      result += "(" + coeff + ") " + this.x_factor(var_name, degree);
      degree -= 1;
    }
    return result;
  }

  x_factor(x_var: string, degree: number): string {
    if (degree === 0) return "";
    else if (degree === 1) return x_var;
    else return x_var + "^" + degree;
  }
}
