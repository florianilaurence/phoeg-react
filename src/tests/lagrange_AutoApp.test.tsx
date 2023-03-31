import {
  compute_a_pol,
  lagrange,
  Point,
} from "../components/autoconjectures/result/utils/lagrange";
import Rational from "../components/autoconjectures/result/utils/rational";

const point1 = { x: -1, y: 7 };
const point2 = { x: 0, y: 1 };
const point3 = { x: 1, y: -1 };

const points = [point1, point2, point3];

const p1 = { x: 4, y: 6 };
const p2 = { x: 3, y: 7 };
const p3 = { x: 2, y: 10 };
const p4 = { x: 1, y: 21 };

const ps = [p1, p2, p3, p4];

test("compute_a_pol", () => {
  const result = compute_a_pol(points, point1);
  expect(result.toString("x")).toBe("x^2-x");
});

test("lagrange", () => {
  const result1 = lagrange(points);
  expect(result1.toString("x")).toBe("2x^2-4x+1");
  const result2 = lagrange(ps);
  expect(result2.toString("x")).toBe("-x^3+10x^2-34x+46");
});
