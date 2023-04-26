//TODO: Write tests for NumRat class

import NumRat from "../utils/numRat";

const numRatInt1 = new NumRat(1);
const numRatInt2 = new NumRat(2);

const numRatRatio1 = new NumRat(1, 2);
const numRatRatio2 = new NumRat(2, 3);
const numRatRatio3 = new NumRat(2, 8);

const numRatFloat1 = new NumRat(1.5);
const numRatFloat2 = new NumRat(2.5);

const numRatIntNeg1 = new NumRat(-1);

const numRatRatioNeg1 = new NumRat(-1, 2);
const numRatRatioNeg2 = new NumRat(1, -2);
const numRatRatioNeg3 = new NumRat(-2, 8);

const numRatFloatNeg1 = new NumRat(-1.5);

const numRatFloat3 = new NumRat(1.3333333333);
const numRatFloat4 = new NumRat(1.89699693);
const numRatFloat5 = new NumRat(1.0005);

test("toStringNoLatex", () => {
  expect(numRatInt1.toString()).toBe("1");
  expect(numRatRatio1.toString()).toBe("1/2");
  expect(numRatFloat1.toString()).toBe("1.5");
  expect(numRatRatio3.toString()).toBe("1/4");
  expect(numRatIntNeg1.toString()).toBe("-1");
  expect(numRatRatioNeg1.toString()).toBe("-1/2");
  expect(numRatRatioNeg2.toString()).toBe("-1/2");
  expect(numRatRatioNeg3.toString()).toBe("-1/4");
  expect(numRatFloatNeg1.toString()).toBe("-1.5");
});

test("toStringLatex", () => {
  expect(numRatInt1.toString(true)).toBe("1");
  expect(numRatRatio1.toString(true)).toBe("\\frac{1}{2}");
  expect(numRatFloat1.toString(true)).toBe("1.5");
});

test("getValue", () => {
  expect(numRatInt1.getValue()).toBe(1);
  expect(numRatRatio1.getValue()).toBe(0.5);
  expect(numRatFloat1.getValue()).toBe(1.5);
});

test("add", () => {
  expect(numRatInt1.add(numRatInt2).getValue()).toBe(3);
  expect(numRatRatio1.add(numRatRatio2).getValue()).toBe(7 / 6);
  expect(numRatFloat1.add(numRatFloat2).getValue()).toBe(4);
  expect(numRatInt1.add(numRatRatio1).getValue()).toBe(3 / 2);
  expect(numRatRatio1.add(numRatInt1).getValue()).toBe(3 / 2);
  expect(numRatFloat1.add(numRatInt1).getValue()).toBe(2.5);
  expect(numRatInt1.add(numRatFloat1).getValue()).toBe(2.5);
});

test("multiply", () => {
  expect(numRatInt1.multiply(numRatInt2).getValue()).toBe(2);
  expect(numRatRatio1.multiply(numRatRatio2).getValue()).toBe(1 / 3);
  expect(numRatRatio1.multiply(numRatInt1).getValue()).toBe(1 / 2);
  expect(numRatInt1.multiply(numRatRatio1).getValue()).toBe(1 / 2);
  expect(numRatFloat1.multiply(numRatFloat2).getValue()).toBe(3.75);
  expect(numRatFloat1.multiply(numRatInt1).getValue()).toBe(1.5);
  expect(numRatInt1.multiply(numRatFloat1).getValue()).toBe(1.5);
});

test("powNumber", () => {
  expect(numRatInt1.powNumber(2).getValue()).toBe(1);
  expect(numRatRatio1.powNumber(2).getValue()).toBe(Math.pow(0.5, 2));
  expect(numRatFloat1.powNumber(2).getValue()).toBe(2.25);
});

test("divideFloat", () => {
  const n1 = new NumRat(0.25);
  const n2 = new NumRat(2);
  const n3 = new NumRat(4);
  const n4 = new NumRat(0.5);

  expect(n1.divideFloat(n2).getValue()).toBe(0.125);
  expect(n1.divideFloat(n1).getValue()).toBe(1);
  expect(n1.divideFloat(n4).getValue()).toBe(0.5);
  expect(n2.divideFloat(n3).getValue()).toBe(0.5);
  expect(n3.divideFloat(n1).getValue()).toBe(16);
});

test("divideRational", () => {
  const n1 = new NumRat(2);
  const n2 = new NumRat(4);
  const n3 = new NumRat(1, 2);
  const n4 = new NumRat(1, 4);

  expect(n1.divideRational(n2).toString()).toBe("1/2");
  expect(n1.divideRational(n3).toString()).toBe("4");
  expect(n2.divideRational(n1).toString()).toBe("2");
  expect(n3.divideRational(n1).toString()).toBe("1/4");
  expect(n4.divideRational(n1).toString()).toBe("1/8");
});

test("negate", () => {
  expect(numRatInt1.negate().getValue()).toBe(-1);
  expect(numRatRatio1.negate().getValue()).toBe(-0.5);
  expect(numRatRatio2.negate().toString()).toBe("-2/3");
  expect(numRatFloat1.negate().getValue()).toBe(-1.5);
  expect(numRatIntNeg1.negate().getValue()).toBe(1);
  expect(numRatRatioNeg1.negate().getValue()).toBe(0.5);
  expect(numRatRatioNeg2.negate().toString()).toBe("1/2");
  expect(numRatRatioNeg3.negate().toString()).toBe("1/4");
  expect(numRatFloatNeg1.negate().getValue()).toBe(1.5);
});

test("round", () => {
  expect(numRatFloat3.round(2).getValue()).toBe(1.33);
  expect(numRatFloat4.round(2).getValue()).toBe(1.9);
  expect(numRatFloat5.round(3).getValue()).toBe(1.001);
});
