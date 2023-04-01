import { RationalPoint } from "./autoconjectures";
import Polynomial from "./polynomial";
import Rational from "./rational";

export const compute_a_pol = (
  points: Array<RationalPoint>,
  current: RationalPoint
): Polynomial => {
  let result = new Polynomial([]);
  for (let point of points) {
    if (!(point.x === current.x && point.y === current.y)) {
      // Not same point
      const current_pol = new Polynomial([
        point.x.negate(),
        Rational.fromNumber(1),
      ]);
      if (result.coefficients.length === 0) result = current_pol;
      else result = result.multiplyPolynomial(current_pol);
    }
  }
  return result;
};

export const lagrange = (points: Array<RationalPoint>): Polynomial => {
  let result = new Polynomial([]);
  for (let point of points) {
    const current_pol = compute_a_pol(points, point);
    const value = current_pol.evaluate(point.x);
    const divide_pol = current_pol.divideRational(value);
    const mult_pol = divide_pol.multiplyPolynomial(new Polynomial([point.y]));
    result = result.addPolynomial(mult_pol);
  }
  return result.simplify();
};
