import {
  compute_coefficients,
  construct_conjecture,
  convert_coefficients,
  get_longer,
  inequality,
  main_func,
  searched_f,
} from "../components/autoconjectures/result/utils/autoconjectures";
import NumRat from "../utils/numRat";

const pointsInt = [
  [
    { x: new NumRat(2), y: new NumRat(2) },
    { x: new NumRat(1), y: new NumRat(3) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(3) },
    { x: new NumRat(1), y: new NumRat(6) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(4) },
    { x: new NumRat(1), y: new NumRat(10) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(5) },
    { x: new NumRat(1), y: new NumRat(15) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(6) },
    { x: new NumRat(1), y: new NumRat(21) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(7) },
    { x: new NumRat(1), y: new NumRat(28) },
  ],
  [
    { x: new NumRat(2), y: new NumRat(8) },
    { x: new NumRat(1), y: new NumRat(36) },
  ],
];

const pointsRat = [
  [
    { x: new NumRat(1, 2), y: new NumRat(15, 2) },
    { x: new NumRat(1, 3), y: new NumRat(6) },
  ],
  [
    { x: new NumRat(1), y: new NumRat(20) },
    { x: new NumRat(2), y: new NumRat(36) },
  ],
  [
    { x: new NumRat(1, 2), y: new NumRat(35, 2) },
    { x: new NumRat(1), y: new NumRat(30) },
  ],
  [
    { x: new NumRat(1, 2), y: new NumRat(24) },
    { x: new NumRat(1, 3), y: new NumRat(18) },
  ],
];

const pointsFloat = [
  [
    { x: new NumRat(0.5), y: new NumRat(7.5) },
    { x: new NumRat(0.33), y: new NumRat(6) },
  ],
  [
    { x: new NumRat(1), y: new NumRat(20) },
    { x: new NumRat(2), y: new NumRat(36) },
  ],
  [
    { x: new NumRat(0.5), y: new NumRat(17.5) },
    { x: new NumRat(1), y: new NumRat(30) },
  ],
  [
    { x: new NumRat(0.5), y: new NumRat(24) },
    { x: new NumRat(0.33), y: new NumRat(18) },
  ],
];

const ordersForInt = [3, 4, 5, 6, 7, 8, 9];

const ordersForRatAndFloat = [3, 4, 5, 6];

const coeffsForInt = [
  [new NumRat(4), new NumRat(-1)],
  [new NumRat(9), new NumRat(-3)],
  [new NumRat(16), new NumRat(-6)],
  [new NumRat(25), new NumRat(-10)],
  [new NumRat(36), new NumRat(-15)],
  [new NumRat(49), new NumRat(-21)],
  [new NumRat(64), new NumRat(-28)],
];

const coeffsForRat = [
  [new NumRat(3), new NumRat(9)],
  [new NumRat(4), new NumRat(16)],
  [new NumRat(5), new NumRat(25)],
  [new NumRat(6), new NumRat(36)],
];

const coeffsForFloat = [
  [new NumRat(3.09), new NumRat(8.82)],
  [new NumRat(4), new NumRat(16)],
  [new NumRat(5), new NumRat(25)],
  [new NumRat(6.36), new NumRat(35.28)],
];

const convertedForInt = [
  [
    { x: new NumRat(3), y: new NumRat(4) },
    { x: new NumRat(4), y: new NumRat(9) },
    { x: new NumRat(5), y: new NumRat(16) },
    { x: new NumRat(6), y: new NumRat(25) },
    { x: new NumRat(7), y: new NumRat(36) },
    { x: new NumRat(8), y: new NumRat(49) },
    { x: new NumRat(9), y: new NumRat(64) },
  ],
  [
    { x: new NumRat(3), y: new NumRat(-1) },
    { x: new NumRat(4), y: new NumRat(-3) },
    { x: new NumRat(5), y: new NumRat(-6) },
    { x: new NumRat(6), y: new NumRat(-10) },
    { x: new NumRat(7), y: new NumRat(-15) },
    { x: new NumRat(8), y: new NumRat(-21) },
    { x: new NumRat(9), y: new NumRat(-28) },
  ],
];

const convertedForRat = [
  [
    { x: new NumRat(3), y: new NumRat(3) },
    { x: new NumRat(4), y: new NumRat(4) },
    { x: new NumRat(5), y: new NumRat(5) },
    { x: new NumRat(6), y: new NumRat(6) },
  ],
  [
    { x: new NumRat(3), y: new NumRat(9) },
    { x: new NumRat(4), y: new NumRat(16) },
    { x: new NumRat(5), y: new NumRat(25) },
    { x: new NumRat(6), y: new NumRat(36) },
  ],
];

const convertedForFloat = [
  [
    { x: new NumRat(3), y: new NumRat(3.09) },
    { x: new NumRat(4), y: new NumRat(4) },
    { x: new NumRat(5), y: new NumRat(5) },
    { x: new NumRat(6), y: new NumRat(6.36) },
  ],
  [
    { x: new NumRat(3), y: new NumRat(8.82) },
    { x: new NumRat(4), y: new NumRat(16) },
    { x: new NumRat(5), y: new NumRat(25) },
    { x: new NumRat(6), y: new NumRat(35.28) },
  ],
];

test("compute_coefficients with only integers", () => {
  const result = compute_coefficients(pointsInt, true, 0);
  expect(result).toStrictEqual(coeffsForInt);
});

test("compute_coefficients with only rationals", () => {
  const result = compute_coefficients(pointsRat, true, 0);
  expect(result).toStrictEqual(coeffsForRat);
});

test("compute_coefficients with only floats", () => {
  const result = compute_coefficients(pointsFloat, false, 2);
  expect(result).toStrictEqual(coeffsForFloat);
});

test("convert_coefficients with only integers", () => {
  const result = convert_coefficients(coeffsForInt, ordersForInt);
  expect(result).toStrictEqual(convertedForInt);
});

test("convert_coefficients with rationals", () => {
  const result = convert_coefficients(coeffsForRat, ordersForRatAndFloat);
  expect(result).toStrictEqual(convertedForRat);
});

test("convert_coefficients with floats", () => {
  const result = convert_coefficients(coeffsForFloat, ordersForRatAndFloat);
  expect(result).toStrictEqual(convertedForFloat);
});

//TODO: implement get_longer test with coefficients of different length

test("get_longer with only integers", () => {
  const result = get_longer(coeffsForInt);
  expect(result).toStrictEqual(coeffsForInt[0]);
});

//TODO: implement construct_conjecture test

test("construct_conjecture with only integers", () => {
  const result = construct_conjecture(
    coeffsForInt,
    compute_coefficients(convertedForInt, true, 0),
    searched_f.FX,
    inequality.LESS,
    false
  );
  expect(result).toStrictEqual("y <= (-1/2n^{2}+3/2n-1)x+(n^{2}-2n+1)");
});

test("construct_conjecture with rationals", () => {
  const result = construct_conjecture(
    coeffsForRat,
    compute_coefficients(convertedForRat, true, 0),
    searched_f.FX,
    inequality.LESS,
    false
  );
  expect(result).toStrictEqual("y <= (n^{2})x+(n)");
});

test("construct_conjecture with floats", () => {
  // PROBLEM OF OVERFITTING ...
  // const result = construct_conjecture(
  //   coeffsForFloat,
  //   compute_coefficients(convertedForFloat, false, 0),
  //   searched_f.FX,
  //   inequality.LESS,
  //   false
  // );
  // expect(result).toStrictEqual("y <= (n^{2})x+(n)");
});

//TODO: implement main_func test

test("main_func with only integers", () => {
  const result = main_func(
    pointsInt,
    ordersForInt,
    searched_f.FX,
    inequality.LESS,
    false,
    true,
    0
  );
  expect(result).toStrictEqual("y <= (-1/2n^{2}+3/2n-1)x+(n^{2}-2n+1)");
});

test("main_func with rationals", () => {
  const result = main_func(
    pointsRat,
    ordersForRatAndFloat,
    searched_f.FX,
    inequality.LESS,
    false,
    true,
    0
  );
  expect(result).toStrictEqual("y <= (n^{2})x+(n)");
});

//______> test with floats
