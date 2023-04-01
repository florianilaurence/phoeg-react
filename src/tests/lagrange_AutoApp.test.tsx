import {
  compute_a_pol,
  lagrange,
} from "../components/autoconjectures/result/utils/lagrange";
import Rational from "../components/autoconjectures/result/utils/rational";

const point1 = { x: Rational.fromNumber(-1), y: Rational.fromNumber(7) };
const point2 = { x: Rational.fromNumber(0), y: Rational.fromNumber(1) };
const point3 = { x: Rational.fromNumber(1), y: Rational.fromNumber(-1) };

const points = [point1, point2, point3];

const p1 = { x: Rational.fromNumber(4), y: Rational.fromNumber(6) };
const p2 = { x: Rational.fromNumber(3), y: Rational.fromNumber(7) };
const p3 = { x: Rational.fromNumber(2), y: Rational.fromNumber(10) };
const p4 = { x: Rational.fromNumber(1), y: Rational.fromNumber(21) };

const ps = [p1, p2, p3, p4];

const psFloat = [
  {
    x: Rational.fromNumber(3.6),
    y: Rational.fromNumber(2.4),
  },
  {
    x: Rational.fromNumber(4.36),
    y: Rational.fromNumber(1.64),
  },
  // { // NOT WORKING WITH THIS POINTS ==> OVERFITTING
  // x: Rational.fromNumber(5.436),
  //   y: Rational.fromNumber(0.0564),
  // },
  // {
  //   x: Rational.fromNumber(5.7436),
  //   y: Rational.fromNumber(0.7436),
  // },
];

test("compute_a_pol", () => {
  const result = compute_a_pol(points, point1);
  expect(result.toString("x")).toBe("x^{2}-x");
});

test("lagrange", () => {
  const result1 = lagrange(points);
  expect(result1.toString("x")).toBe("2x^{2}-4x+1");
  const result2 = lagrange(ps);
  expect(result2.toString("x")).toBe("-x^{3}+10x^{2}-34x+46");
});

test("lagrange_with_float", () => {
  const result = lagrange(psFloat);
  expect(result.toString("x")).toBe("-x+6");
});
