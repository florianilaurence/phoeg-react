import Polynomial from "../components/autoconjectures/result/utils/polynomial";
import NumRat from "../utils/numRat";

const int1 = new NumRat(-1);
const int2 = new NumRat(2);
const int3 = new NumRat(-3);
const int4 = new NumRat(4);
const int5 = new NumRat(1);

const polyInt1 = new Polynomial([int1, int2, int3, int4]); // 4x^3-3x^2+2x-1
const polyInt2 = new Polynomial([int4, int3, int2, int1]); // -x^3+2x^2-3x+4
const polyInt3 = new Polynomial([int5, int1]); // x-1

const rat1 = new NumRat(-1, 2);
const rat2 = new NumRat(1, 3);
const rat3 = new NumRat(1, 4);
const rat4 = new NumRat(1, 5);

const polyRat1 = new Polynomial([rat1, rat2, rat3, rat4]); // 1/5x^3+1/4x^2+1/3x-1/2
const polyRat2 = new Polynomial([rat4, rat3, rat2, rat1]); // -1/2x^3+1/3x^2+1/4x+1/5
const polyRat3 = new Polynomial([int1, rat2]); // 1/3x-1

const float1 = new NumRat(-1.5);
const float2 = new NumRat(2.4);
const float3 = new NumRat(-3.5);
const float4 = new NumRat(4.3);

const polyFloat1 = new Polynomial([float1, float2, float3, float4]); // 4.3x^3-3.5x^2+2.4x-1.5
const polyFloat2 = new Polynomial([float4, float3, float2, float1]); // -1.5x^3+2.4x^2-3.5x+4.3
const polyFloat3 = new Polynomial([int1, float4]); // 4.3x-1

test("toStringNoLatex", () => {
  expect(polyInt1.toString("x")).toBe("4x^{3}-3x^{2}+2x-1");
  expect(polyInt2.toString("x")).toBe("-x^{3}+2x^{2}-3x+4");
  expect(polyInt3.toString("x")).toBe("-x+1");

  expect(polyRat1.toString("x")).toBe("1/5x^{3}+1/4x^{2}+1/3x-1/2");
  expect(polyRat2.toString("x")).toBe("-1/2x^{3}+1/3x^{2}+1/4x+1/5");
  expect(polyRat3.toString("x")).toBe("1/3x-1");

  expect(polyFloat1.toString("x")).toBe("4.3x^{3}-3.5x^{2}+2.4x-1.5");
  expect(polyFloat2.toString("x")).toBe("-1.5x^{3}+2.4x^{2}-3.5x+4.3");
  expect(polyFloat3.toString("x")).toBe("4.3x-1");
});

test("toStringLatex", () => {
  expect(polyInt1.toString("x", true)).toBe("4x^{3}-3x^{2}+2x-1");
  expect(polyRat1.toString("x", true)).toBe(
    "\\frac{1}{5}x^{3}+\\frac{1}{4}x^{2}+\\frac{1}{3}x\\frac{-1}{2}"
  );
  expect(polyFloat1.toString("x", true)).toBe("4.3x^{3}-3.5x^{2}+2.4x-1.5");
});

test("addPolynomial", () => {
  expect(polyInt1.addPolynomial(polyInt2, 2).toString("x")).toBe(
    "3x^{3}-x^{2}-x+3"
  );
  expect(polyRat1.addPolynomial(polyRat2, 2).toString("x")).toBe(
    "-3/10x^{3}+7/12x^{2}+7/12x-3/10"
  );
  expect(polyFloat1.addPolynomial(polyFloat2, 2).toString("x")).toBe(
    "2.8x^{3}-1.1x^{2}-1.1x+2.8"
  );
});

test("multiplyPolynomial", () => {
  expect(polyInt1.multiplyPolynomial(polyInt3, 0).toString("x")).toBe(
    "-4x^{4}+7x^{3}-5x^{2}+3x-1"
  );
  expect(polyRat1.multiplyPolynomial(polyRat3, 0).toString("x")).toBe(
    "1/15x^{4}-7/60x^{3}-5/36x^{2}-1/2x+1/2"
  );
  expect(polyFloat1.multiplyPolynomial(polyFloat3, 2).toString("x")).toBe(
    "18.49x^{4}-19.35x^{3}+13.82x^{2}-8.85x+1.5"
  );
});

test("dividePolynomialInRational", () => {
  // Integers polynomial divide by integer
  expect(polyInt1.divideNumRat(int2, true, 0).toString("x")).toBe(
    "2x^{3}-3/2x^{2}+x-1/2"
  );
  // Rationals polynomial divide by rational
  expect(polyRat1.divideNumRat(rat2, true, 0).toString("x")).toBe(
    "3/5x^{3}+3/4x^{2}+x-3/2"
  );
  // Rationals polynomial divide by integer
  expect(polyRat1.divideNumRat(int2, true, 0).toString("x")).toBe(
    "1/10x^{3}+1/8x^{2}+1/6x-1/4"
  );
  // Integers polynomial divide by rational
  expect(polyInt1.divideNumRat(rat2, true, 0).toString("x")).toBe(
    "12x^{3}-9x^{2}+6x-3"
  );
});

test("dividePolynomialInFloat", () => {
  // Integers polynomial divide by integer
  expect(polyInt1.divideNumRat(int2, false, 2).toString("x")).toBe(
    "2x^{3}-1.5x^{2}+x-0.5"
  );
  // Integers polynomial divide by float
  expect(polyInt1.divideNumRat(float2, false, 2).toString("x")).toBe(
    "1.67x^{3}-1.25x^{2}+0.83x-0.42"
  );
  // Floats polynomial divide by integer
  expect(polyFloat1.divideNumRat(int2, false, 2).toString("x")).toBe(
    "2.15x^{3}-1.75x^{2}+1.2x-0.75"
  );
  // Floats polynomial divide by float
  expect(polyFloat1.divideNumRat(float2, false, 2).toString("x")).toBe(
    "1.79x^{3}-1.46x^{2}+x-0.62"
  );
});

test("evaluate", () => {
  // Integers polynomial evaluate with integer
  expect(polyInt1.evaluate(int2, 0).toString()).toBe("23");
  // Integers polynomial evaluate with rational
  expect(polyInt1.evaluate(rat2, 0).toString()).toBe("-14/27");
  // Integers polynomial evaluate with float
  expect(polyInt1.evaluate(float2, 3).toString()).toBe("41.816");
});

test("simplify", () => {
  const polyInt4 = new Polynomial([int1, int2, new NumRat(0), new NumRat(0)]);
  expect(polyInt4.simplify().toString("x")).toBe("2x-1");
  const polyInt5 = new Polynomial([int1, int2, int3.negate(), int4.negate()]);
  expect(polyInt1.addPolynomial(polyInt5, 2).toString("x")).toBe("4x-2");
});
