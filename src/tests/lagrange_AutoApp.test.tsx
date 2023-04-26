import {
  compute_a_pol,
  lagrange,
} from "../components/autoconjectures/result/utils/lagrange";
import NumRat from "../utils/numRat";

const pointInt1 = { x: new NumRat(-1), y: new NumRat(7) };
const pointInt2 = { x: new NumRat(0), y: new NumRat(1) };
const pointInt3 = { x: new NumRat(1), y: new NumRat(-1) };

const pointsInt = [pointInt1, pointInt2, pointInt3];

const pointRat1 = { x: new NumRat(-1), y: new NumRat(7) };
const pointRat2 = { x: new NumRat(1, 2), y: new NumRat(3) };
const pointRat3 = { x: new NumRat(5), y: new NumRat(1, 3) };

const pointsRat = [pointRat1, pointRat2, pointRat3];

const pointFloat1 = { x: new NumRat(-1), y: new NumRat(7) };
const pointFloat2 = { x: new NumRat(0.5), y: new NumRat(3) };
const pointFloat3 = { x: new NumRat(5), y: new NumRat(0.3) };

const pointsFloat = [pointFloat1, pointFloat2, pointFloat3];

test("compute_a_pol_integers", () => {
  expect(compute_a_pol(pointsInt, pointInt1, 0).toString("x")).toBe("x^{2}-x");
});

test("compute_a_pol_rationals", () => {
  expect(compute_a_pol(pointsRat, pointRat1, 0).toString("x")).toBe(
    "x^{2}-11/2x+5/2"
  );
  expect(compute_a_pol(pointsRat, pointRat2, 0).toString("x")).toBe(
    "x^{2}-4x-5"
  );
  expect(compute_a_pol(pointsRat, pointRat3, 0).toString("x")).toBe(
    "x^{2}+1/2x-1/2"
  );
});

test("compute_a_pol_floats", () => {
  expect(compute_a_pol(pointsFloat, pointFloat1, 2).toString("x")).toBe(
    "x^{2}-5.5x+2.5"
  );
  expect(compute_a_pol(pointsFloat, pointFloat2, 2).toString("x")).toBe(
    "x^{2}-4x-5"
  );
  expect(compute_a_pol(pointsFloat, pointFloat3, 2).toString("x")).toBe(
    "x^{2}+0.5x-0.5"
  );
});

test("lagrange_integers", () => {
  expect(lagrange(pointsInt, false, 2).toString("x")).toBe("2x^{2}-4x+1");
});

test("lagrange_rationals", () => {
  expect(lagrange(pointsRat, true, 0).toString("x")).toBe(
    "28/81x^{2}-202/81x+337/81"
  );
});

test("lagrange_floats", () => {
  expect(lagrange(pointsFloat, false, 2).toString("x")).toBe(
    "0.33x^{2}-2.49x+4.17"
  );
});
