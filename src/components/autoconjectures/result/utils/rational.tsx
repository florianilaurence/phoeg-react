export default class Rational {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) throw new Error("Denominator cannot be 0");
    if (Number.isNaN(numerator) || Number.isNaN(denominator)) {
      throw new Error("Numerator and denominator cannot be NaN");
    }
    if (denominator < 0) {
      numerator = -numerator;
      denominator = -denominator;
    }
    this.numerator = numerator;
    this.denominator = denominator;
    this.simplify();
  }

  addRational(r: Rational): Rational {
    const new_numerator =
      this.numerator * r.denominator + this.denominator * r.numerator;
    const new_denominator = this.denominator * r.denominator;
    return new Rational(new_numerator, new_denominator);
  }

  multiplyRational(r: Rational): Rational {
    const new_numerator = this.numerator * r.numerator;
    const new_denominator = this.denominator * r.denominator;
    return new Rational(new_numerator, new_denominator);
  }

  divideRational(r: Rational): Rational {
    const new_numerator = this.numerator * r.denominator;
    const new_denominator = this.denominator * r.numerator;
    return new Rational(new_numerator, new_denominator);
  }

  static gcd = (a: number, b: number): number => {
    if (!Number.isInteger(a) || !Number.isInteger(b)) {
      throw new Error(`a=${a} and b=${b} must be integers`);
    }
    if (b === 0) return a;
    return Rational.gcd(b, a % b);
  };

  simplify(): void {
    const g = Rational.gcd(
      Math.abs(this.numerator),
      Math.abs(this.denominator)
    );
    this.numerator = this.numerator / g;
    this.denominator = this.denominator / g;
  }

  toNumber(): number {
    return this.numerator / this.denominator;
  }

  powNumber(po: number): Rational {
    const new_numerator = Math.pow(this.numerator, po);
    const new_denominator = Math.pow(this.denominator, po);
    return new Rational(new_numerator, new_denominator);
  }

  static fromNumber(n: number): Rational {
    if (Number.isInteger(n)) return new Rational(n, 1);
    const s = n.toString();
    const decimal = s.indexOf(".");
    const len = s.length - decimal - 1;
    const denominator = Math.pow(10, len);
    const numerator = Math.round(n * denominator);
    return new Rational(numerator, denominator);
  }

  negate(): Rational {
    return new Rational(-this.numerator, this.denominator);
  }

  toString(inLatex: boolean = false): string {
    if (this.denominator === 1) return this.numerator.toString();
    if (inLatex) return `\\frac{${this.numerator}}{${this.denominator}}`;
    return `${this.numerator}/${this.denominator}`;
  }
}
