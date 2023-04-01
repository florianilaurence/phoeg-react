import Polynomial from "../components/autoconjectures/result/utils/polynomial";
import Rational from "../components/autoconjectures/result/utils/rational";

const ratN2 = Rational.fromNumber(-2);
const ratN1 = Rational.fromNumber(-1);
const rat0 = Rational.fromNumber(0);
const rat1 = Rational.fromNumber(1);
const rat2 = Rational.fromNumber(2);
const rat3 = Rational.fromNumber(3);

const pol1 = new Polynomial([rat3, ratN1, rat2, rat0, ratN2]);
const pol2 = new Polynomial([ratN2, ratN1, rat3]);
const pol3 = new Polynomial([rat1, rat1]);
const pol4 = new Polynomial([ratN1, rat1]);
const pol5 = new Polynomial([rat0, rat1]);

test("toString", () => {
  expect(pol1.toString("x")).toBe("-2x^{4}+2x^{2}-x+3");
  expect(pol2.toString("x")).toBe("3x^{2}-x-2");
  expect(pol5.toString("x")).toBe("x");
});

test("evaluate", () => {
  expect(pol1.evaluate(ratN1).toNumber()).toBe(4);
  expect(pol1.evaluate(rat0).toNumber()).toBe(3);
  expect(pol1.evaluate(rat1).toNumber()).toBe(2);
  expect(pol1.evaluate(rat2).toNumber()).toBe(-23);
});

test("addPolynomial", () => {
  expect(pol1.addPolynomial(pol2).toString("x")).toBe("-2x^{4}+5x^{2}-2x+1");
});

test("multiplyPolynomial", () => {
  expect(pol3.multiplyPolynomial(pol4).toString("x")).toBe("x^{2}-1");
  expect(pol1.multiplyPolynomial(pol4).toString("x")).toBe(
    "-2x^{5}+2x^{4}+2x^{3}-3x^{2}+4x-3"
  );
  expect(pol5.multiplyPolynomial(pol4).toString("x")).toBe("x^{2}-x");
});

test("divideRational", () => {
  expect(pol1.divideRational(rat2).toString("x")).toBe("-x^{4}+x^{2}-1/2x+3/2");
});

test("toStringReplaceCoeffs", () => {
  const coeffPol1 = new Polynomial([ratN1, rat1]); // n-1
  const coeffPol2 = new Polynomial([rat0, rat1]); // n
  const coeffs = [coeffPol2.toString("n"), coeffPol1.toString("n")];
  expect(pol4.toStringReplaceCoeffs("x", coeffs)).toBe("(n-1)x+(n)");
});

test("simplify", () => {
  const pol6 = new Polynomial([ratN1, rat1, rat0, rat0]);
  const result = pol6.simplify();
  const expected = new Polynomial([ratN1, rat1]);
  expect(result).toEqual(expected);
});
