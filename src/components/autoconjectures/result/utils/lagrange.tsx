import Polynomial from "./polynomial";

const compute_a_pol = (points: Array<Point>, current: Point): Polynomial => {
  let result = new Polynomial([], 0);
  for (let point of points) {
    if (point.x !== current.x || point.y !== current.y) {
      const current_pol = new Polynomial([-point.x, 1], 1);
      result = result.multiplyPolynomial(current_pol);
    }
  }
  return result;
};

export const lagrange = (points: Array<Point>): Polynomial => {
  //TODO: Gérer le cas du point seul
  let result = new Polynomial([], 0);
  for (let point of points) {
    const current_pol = compute_a_pol(points, point);
    const value = current_pol.evaluate(point.x);
    const divide_pol = current_pol.divideNumber(value);
    const mult_pol = divide_pol.multiplyPolynomial(
      new Polynomial([point.y], 0)
    );
    result = result.addPolynomial(mult_pol);
  }
  return result.simplify();
};

export interface Point {
  x: number;
  y: number;
}
