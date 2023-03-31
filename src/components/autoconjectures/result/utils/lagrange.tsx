import Polynomial from "./polynomial";
import Rational from "./rational";

export const compute_a_pol = (
  points: Array<Point>,
  current: Point
): Polynomial => {
  let result = new Polynomial([]);
  for (let point of points) {
    if (!(point.x === current.x && point.y === current.y)) {
      // Not same point
      const current_pol = new Polynomial([
        Rational.fromNumber(-point.x),
        Rational.fromNumber(1),
      ]);
      if (result.coefficients.length === 0) result = current_pol;
      else result = result.multiplyPolynomial(current_pol);
    }
  }
  return result;
};

export const lagrange = (points: Array<Point>): Polynomial => {
  let result = new Polynomial([]);
  for (let point of points) {
    const current_pol = compute_a_pol(points, point);
    const value = current_pol.evaluate(new Rational(point.x, 1));
    const divide_pol = current_pol.divideRational(value);
    const mult_pol = divide_pol.multiplyPolynomial(
      new Polynomial([new Rational(point.y, 1)])
    );
    result = result.addPolynomial(mult_pol);
  }
  return result.simplify();
};

export interface Point {
  x: number;
  y: number;
}
