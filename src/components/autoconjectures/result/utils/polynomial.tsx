import Rational from "./rational";

export default class Polynomial {
  // [x^0, x^1, x^2, ..., x^degree]
  constructor(readonly coefficients: Rational[]) {}

  evaluate(x: Rational): Rational {
    let result = Rational.fromNumber(0);
    for (let i = 0; i < this.coefficients.length; i++) {
      result = result.addRational(
        this.coefficients[i].multiplyRational(x.powNumber(i))
      );
    }
    return result;
  }

  addPolynomial(p: Polynomial): Polynomial {
    const new_coeffs: Array<Rational> = [];
    const new_degree = Math.max(
      this.coefficients.length,
      p.coefficients.length
    );
    for (let i = 0; i < new_degree; i++) {
      if (i < this.coefficients.length && i < p.coefficients.length) {
        new_coeffs.push(this.coefficients[i].addRational(p.coefficients[i]));
      } else if (i < this.coefficients.length) {
        new_coeffs.push(this.coefficients[i]);
      } else {
        new_coeffs.push(p.coefficients[i]);
      }
    }
    return new Polynomial(new_coeffs);
  }

  multiplyPolynomial(p: Polynomial): Polynomial {
    const new_coeffs: Array<Rational> = [];
    const new_degree = this.coefficients.length + p.coefficients.length - 1;
    for (let i = 0; i < new_degree; i++) {
      new_coeffs.push(Rational.fromNumber(0));
    }
    for (let i = 0; i < this.coefficients.length; i++) {
      for (let j = 0; j < p.coefficients.length; j++) {
        new_coeffs[i + j] = new_coeffs[i + j].addRational(
          this.coefficients[i].multiplyRational(p.coefficients[j])
        );
      }
    }
    return new Polynomial(new_coeffs);
  }

  divideRational(n: Rational): Polynomial {
    const new_coeffs: Array<Rational> = [];
    for (let i = 0; i < this.coefficients.length; i++) {
      new_coeffs.push(this.coefficients[i].divideRational(n));
    }
    return new Polynomial(new_coeffs);
  }

  simplify(): Polynomial {
    const new_coeffs: Array<Rational> = [...this.coefficients];
    for (let i = this.coefficients.length - 1; i >= 0; i--) {
      if (this.coefficients[i].toNumber() !== 0) {
        break;
      }
      new_coeffs.pop();
    }
    return new Polynomial(new_coeffs);
  }

  toString(xVar: string, inLatex: boolean = false): string {
    const temp: Array<string> = [];
    for (let i = 0; i < this.coefficients.length; i++) {
      temp.push(this.constructVar(this.coefficients[i], xVar, i, inLatex));
    }
    let result = "";
    for (let i = temp.length - 1; i >= 0; i--) {
      if (i === temp.length - 1 && temp[i].charAt(0) === "+") {
        result += temp[i].substring(1);
      } else {
        result += temp[i];
      }
    }

    return result;
  }

  toStringReplaceCoeffs(
    xVar: string,
    coeffs: Array<string>,
    inLatex: boolean = false
  ): string {
    const temp: Array<string> = [];
    for (let i = 0; i < this.coefficients.length; i++) {
      temp.push(this.constructVar(coeffs[i], xVar, i, inLatex));
    }
    let result = "";
    for (let i = temp.length - 1; i >= 0; i--) {
      if (i === temp.length - 1 && temp[i].charAt(0) === "+") {
        result += temp[i].substring(1);
      } else {
        result += temp[i];
      }
    }

    for (let i = 0; i < coeffs.length; i++) {
      result = result.replace("x^" + i, coeffs[i]);
    }

    return result;
  }

  constructVar(
    coeff: Rational | string,
    xVar: string,
    degree: number,
    inLatex: boolean
  ): string {
    if (coeff === undefined) return "";
    if (typeof coeff === "string") {
      if (degree === 0) {
        return "+(" + coeff + ")";
      } else if (degree === 1) {
        return "+(" + coeff + ")" + xVar;
      } else {
        return "+(" + coeff + ")" + xVar + "^{" + degree + "}";
      }
    }
    const c = coeff.toNumber();
    if (c === 0) {
      return "";
    } else if (c === 1) {
      if (degree === 0) {
        return "+1";
      } else if (degree === 1) {
        return "+" + xVar;
      } else {
        return "+" + xVar + "^{" + degree + "}";
      }
    } else if (c === -1) {
      if (degree === 0) {
        return "-1";
      } else if (degree === 1) {
        return "-" + xVar;
      } else {
        return "-" + xVar + "^{" + degree + "}";
      }
    } else if (c > 0) {
      if (degree === 0) {
        return "+" + coeff.toString(inLatex);
      } else if (degree === 1) {
        return "+" + coeff.toString(inLatex) + xVar;
      } else {
        return "+" + coeff.toString(inLatex) + xVar + "^{" + degree + "}";
      }
    } else {
      // c < 0
      if (degree === 0) {
        return coeff.toString(inLatex);
      } else if (degree === 1) {
        return coeff.toString(inLatex) + xVar;
      } else {
        return coeff.toString(inLatex) + xVar + "^{" + degree + "}";
      }
    }
  }
}
