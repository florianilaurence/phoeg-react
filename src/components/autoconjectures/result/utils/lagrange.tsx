import { SimplifiedCoordinate } from "../../../../store/reducers/main_reducer";
import NumRat from "../../../../utils/numRat";
import Polynomial from "./polynomial";

export const compute_a_pol = (
  points: Array<SimplifiedCoordinate>,
  current: SimplifiedCoordinate,
  decimalNb: number
): Polynomial => {
  // Compute a polynomial which pass by all points except current
  let result = new Polynomial([]);
  for (let point of points) {
    if (!(point.x === current.x && point.y === current.y)) {
      // Not same point
      const current_pol = new Polynomial([point.x.negate(), new NumRat(1)]);
      if (result.coefficients.length === 0) result = current_pol;
      else result = result.multiplyPolynomial(current_pol, decimalNb);
    }
  }
  return result;
};

export const lagrange = (
  points: Array<SimplifiedCoordinate>,
  inRational: boolean,
  decimalNb: number
): Polynomial => {
  let result = new Polynomial([]);
  for (let point of points) {
    const current_pol = compute_a_pol(points, point, decimalNb);
    const value = current_pol.evaluate(point.x, decimalNb);
    const divide_pol = current_pol.divideNumRat(value, inRational, decimalNb);
    const mult_pol = divide_pol.multiplyPolynomial(
      new Polynomial([point.y]),
      decimalNb
    );
    result = result.addPolynomial(mult_pol, decimalNb);
  }
  return result.simplify();
};
