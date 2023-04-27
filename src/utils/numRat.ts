class NumRat {
  public numerator: number;
  public denominator: number | undefined;

  constructor(numerator: number, denominator?: number) {
    this.numerator = numerator;
    this.denominator = denominator;
    // if (this.denominator === 0) {
    //   throw new Error("Denominator cannot be 0");
    // }
    if (this.denominator === 1) {
      this.denominator = undefined;
    }
    if (this.denominator) this.simplify();
  }

  equal(other: NumRat): boolean {
    return this.getValue() === other.getValue();
  }

  gcd(a: number, b: number): number {
    if (b === 0) return a;
    return this.gcd(b, a % b);
  }

  simplify(): void {
    const gcd = this.gcd(Math.abs(this.numerator), Math.abs(this.denominator!));
    if (this.denominator! < 0) {
      this.numerator = -this.numerator / gcd;
      this.denominator = -this.denominator! / gcd;
    } else {
      this.numerator = this.numerator / gcd;
      this.denominator = this.denominator! / gcd;
    }
  }

  toString(inLatex: boolean = false): string {
    if (this.denominator === 1 || this.denominator === undefined)
      return this.numerator.toString();
    if (inLatex) return `\\frac{${this.numerator}}{${this.denominator}}`;
    return `${this.numerator}/${this.denominator}`;
  }

  getValue(): number {
    if (this.denominator === undefined) {
      return this.numerator;
    } else {
      return this.numerator / this.denominator;
    }
  }

  add(value: NumRat): NumRat {
    if (this.denominator === undefined && value.denominator === undefined) {
      // Add number with number
      return new NumRat(this.numerator + value.numerator);
    } else if (
      // Add rational with rational
      this.denominator !== undefined &&
      value.denominator !== undefined
    ) {
      return new NumRat(
        this.numerator * value.denominator + value.numerator * this.denominator,
        this.denominator * value.denominator
      );
    }
    if (Number.isInteger(this.numerator) && Number.isInteger(value.numerator)) {
      if (this.denominator !== undefined) {
        // Add rational with integer
        return new NumRat(
          this.numerator + value.numerator * this.denominator,
          this.denominator
        );
      } else if (value.denominator !== undefined) {
        // Add integer with rational
        return new NumRat(
          value.numerator + this.numerator * value.denominator,
          value.denominator
        );
      }
    }
    // Not should happen (add rational with float)
    return new NumRat(0);
  }

  multiply(value: NumRat): NumRat {
    if (this.denominator === undefined && value.denominator === undefined) {
      // Multiply number with number
      return new NumRat(this.numerator * value.numerator);
    } else if (
      // Multiply rational with rational
      this.denominator !== undefined &&
      value.denominator !== undefined
    ) {
      return new NumRat(
        this.numerator * value.numerator,
        this.denominator * value.denominator
      );
    }
    if (Number.isInteger(this.numerator) && Number.isInteger(value.numerator)) {
      if (this.denominator !== undefined) {
        // Multiply rational with integer
        return new NumRat(this.numerator * value.numerator, this.denominator);
      } else if (value.denominator !== undefined) {
        // Multiply integer with rational
        return new NumRat(this.numerator * value.numerator, value.denominator);
      }
    }
    // Not should happen (multiply rational with float)
    return new NumRat(0);
  }

  powNumber(value: number): NumRat {
    if (this.denominator === undefined) {
      // Pow number with number
      return new NumRat(Math.pow(this.numerator, value));
    } else {
      return new NumRat(
        Math.pow(this.numerator, value),
        Math.pow(this.denominator, value)
      );
    }
  }

  divide(value: NumRat, inRational: boolean): NumRat {
    if (inRational) {
      return this.divideRational(value);
    } else {
      return this.divideFloat(value);
    }
  }

  divideFloat(value: NumRat): NumRat {
    return new NumRat(this.getValue() / value.getValue());
  }

  divideRational(value: NumRat): NumRat {
    if (this.denominator === undefined && value.denominator === undefined) {
      // Divide integer with integer
      return new NumRat(this.numerator, value.numerator);
    } else if (
      this.denominator === undefined &&
      value.denominator !== undefined
    ) {
      // Integer with rational
      return new NumRat(this.numerator * value.denominator, value.numerator);
    } else if (
      this.denominator !== undefined &&
      value.denominator === undefined
    ) {
      // Rational with integer
      return new NumRat(this.numerator, value.numerator * this.denominator);
    } else if (
      this.denominator !== undefined &&
      value.denominator !== undefined
    ) {
      // Rational with rational
      return new NumRat(
        this.numerator * value.denominator,
        value.numerator * this.denominator
      );
    } else {
      // Not should happen (divide rational with float)
      return new NumRat(0);
    }
  }

  negate(): NumRat {
    if (this.denominator === undefined) {
      return new NumRat(-this.numerator);
    } else {
      return new NumRat(-this.numerator, this.denominator);
    }
  }

  round(decimalNb: number): NumRat {
    if (this.denominator !== undefined) {
      // Not round rational
      return this;
    } else {
      return new NumRat(
        Math.round((this.numerator + Number.EPSILON) * 10 ** decimalNb) /
          10 ** decimalNb
      );
    }
  }
}

export default NumRat;
