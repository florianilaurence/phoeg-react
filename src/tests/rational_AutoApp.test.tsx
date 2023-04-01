import Rational from "../components/autoconjectures/result/utils/rational";

const rat1 = new Rational(2, 5);
const rat2 = new Rational(6, 2);
const rat3 = new Rational(1, 2);
const rat4 = new Rational(2, 3);
const rat5 = new Rational(-1, 2);
const rat6 = new Rational(1, -2);
const rat7 = Rational.fromNumber(3);
const rat8 = Rational.fromNumber(0.5);

test("toString", () => {
  expect(rat1.toString()).toBe("2/5");
  expect(rat2.toString()).toBe("3");
  expect(rat5.toString()).toBe("-1/2");
  expect(rat6.toString()).toBe("-1/2");
  expect(rat7.toString()).toBe("3");
});

test("fromNumber", () => {
  expect(rat7.toString()).toBe("3");
  expect(rat8.toString()).toBe("1/2");
});

test("addRational", () => {
  const newRat = rat1.addRational(rat2);
  expect(newRat.toString()).toBe("17/5");
});

test("multiplyRational", () => {
  const newRat1 = rat1.multiplyRational(rat2);
  expect(newRat1.toString()).toBe("6/5");
  const newRat2 = rat1.multiplyRational(rat3);
  expect(newRat2.toString()).toBe("1/5");
});

test("divideRational", () => {
  const newRat1 = rat1.divideRational(rat2);
  expect(newRat1.toString()).toBe("2/15");
  const newRat2 = rat1.divideRational(rat3);
  expect(newRat2.toString()).toBe("4/5");
  const newRat3 = rat1.divideRational(rat4);
  expect(newRat3.toString()).toBe("3/5");
});

test("gcd", () => {
  expect(Rational.gcd(2, 5)).toBe(1);
  expect(Rational.gcd(6, 2)).toBe(2);
  expect(Rational.gcd(1, 2)).toBe(1);
  expect(Rational.gcd(2, 3)).toBe(1);
});

test("toNumber", () => {
  expect(rat3.toNumber()).toBe(0.5);
});

test("powNumber", () => {
  const newRat = rat1.powNumber(3);
  expect(newRat.toString()).toBe("8/125");
});
