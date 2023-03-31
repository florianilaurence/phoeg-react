import {
  compute_coefficients,
  construct_conjecture,
  convert_coefficients,
  get_longer,
  inequality,
  main_func,
  searched_f,
} from "../components/autoconjectures/result/utils/autoconjectures";
import Rational from "../components/autoconjectures/result/utils/rational";

const points1 = [
  [
    {
      x: 2,
      y: 2,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  [
    {
      x: 2,
      y: 3,
    },
    {
      x: 1,
      y: 6,
    },
  ],
  [
    {
      x: 2,
      y: 4,
    },
    {
      x: 1,
      y: 10,
    },
  ],
  [
    {
      x: 2,
      y: 5,
    },
    {
      x: 1,
      y: 15,
    },
  ],
  [
    {
      x: 2,
      y: 6,
    },
    {
      x: 1,
      y: 21,
    },
  ],
  [
    {
      x: 2,
      y: 7,
    },
    {
      x: 1,
      y: 28,
    },
  ],
  [
    {
      x: 2,
      y: 8,
    },
    {
      x: 1,
      y: 36,
    },
  ],
];

const orders1 = [3, 4, 5, 6, 7, 8, 9];

const main_coefficients1 = [
  [Rational.fromNumber(4), Rational.fromNumber(-1)],
  [Rational.fromNumber(9), Rational.fromNumber(-3)],
  [Rational.fromNumber(16), Rational.fromNumber(-6)],
  [Rational.fromNumber(25), Rational.fromNumber(-10)],
  [Rational.fromNumber(36), Rational.fromNumber(-15)],
  [Rational.fromNumber(49), Rational.fromNumber(-21)],
  [Rational.fromNumber(64), Rational.fromNumber(-28)],
];

const converted_coefficients1 = [
  [
    {
      x: 3,
      y: 4,
    },
    {
      x: 4,
      y: 9,
    },
    {
      x: 5,
      y: 16,
    },
    {
      x: 6,
      y: 25,
    },
    {
      x: 7,
      y: 36,
    },
    {
      x: 8,
      y: 49,
    },
    {
      x: 9,
      y: 64,
    },
  ],
  [
    {
      x: 3,
      y: -1,
    },
    {
      x: 4,
      y: -3,
    },
    {
      x: 5,
      y: -6,
    },
    {
      x: 6,
      y: -10,
    },
    {
      x: 7,
      y: -15,
    },
    {
      x: 8,
      y: -21,
    },
    {
      x: 9,
      y: -28,
    },
  ],
];

const secondary_coefficients1 = [
  [Rational.fromNumber(1), Rational.fromNumber(-2), Rational.fromNumber(1)],
  [Rational.fromNumber(-1), new Rational(3, 2), new Rational(-1, 2)],
];

const diff_lenght_coeffs = [
  [Rational.fromNumber(1), Rational.fromNumber(2)],
  [Rational.fromNumber(1), Rational.fromNumber(2), Rational.fromNumber(3)],
  [
    Rational.fromNumber(1),
    Rational.fromNumber(2),
    Rational.fromNumber(3),
    Rational.fromNumber(4),
  ],
  [Rational.fromNumber(1), Rational.fromNumber(2)],
];

const points2 = [
  [
    {
      x: 2,
      y: 2,
    },
    {
      x: 1,
      y: 3,
    },
  ],
  [
    {
      x: 2,
      y: 3,
    },
    {
      x: 1,
      y: 6,
    },
  ],
];

const orders2 = [3, 5, 7, 9];

const points3 = [
  [
    // order 3
    {
      x: 2,
      y: 2,
    },
  ],
  [
    // order 5
    {
      x: 4,
      y: 4,
    },
  ],
  [
    // order 7
    {
      x: 6,
      y: 6,
    },
  ],
  [
    // order 9
    {
      x: 8,
      y: 8,
    },
  ],
];

test("compute_main_coefficients", () => {
  const result = compute_coefficients(points1);
  expect(result).toEqual(main_coefficients1);
});

test("convert_main_coefficients", () => {
  const result = convert_coefficients(main_coefficients1, orders1);
  expect(result).toEqual(converted_coefficients1);
});

test("compute_secondary_coefficients", () => {
  const result = compute_coefficients(converted_coefficients1);
  expect(result).toEqual(secondary_coefficients1);
});

test("get_longer", () => {
  const result = get_longer(diff_lenght_coeffs);
  const expected = [
    Rational.fromNumber(1),
    Rational.fromNumber(2),
    Rational.fromNumber(3),
    Rational.fromNumber(4),
  ];
  expect(result).toEqual(expected);
});

test("construct_conjecture", () => {
  const result = construct_conjecture(
    main_coefficients1,
    secondary_coefficients1,
    searched_f.FX,
    inequality.MORE
  );
  expect(result).toBe("y >= (-1/2n^2+3/2n-1)x+(n^2-2n+1)");
});

test("main_func", () => {
  const result1 = main_func(points1, orders1, searched_f.FX, inequality.MORE);
  expect(result1).toBe("y >= (-1/2n^2+3/2n-1)x+(n^2-2n+1)");

  const result2 = main_func(points2, orders2, searched_f.FY, inequality.LESS); // ERROR
  expect(result2).toBe("not correct, because lists not same length");

  const result3 = main_func(points3, orders2, searched_f.FY, inequality.LESS); // With odd orders
  expect(result3).toBe("x <= (n-1)");
});
