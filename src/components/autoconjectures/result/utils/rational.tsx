export default class Rational {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number) {
    if (denominator === 0) throw new Error("Denominator cannot be 0");
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

  simplify(): void {
    const gcd = (a: number, b: number): number => {
      if (b === 0) return a;
      return gcd(b, a % b);
    };
    const g = gcd(Math.abs(this.numerator), Math.abs(this.denominator));
    this.numerator = this.numerator / g;
    this.denominator = this.denominator / g;
  }

  toString(): string {
    if (this.denominator === 1) return this.numerator.toString();
    return `${this.numerator}/${this.denominator}`;
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
    return new Rational(n, 1);
  }
}
