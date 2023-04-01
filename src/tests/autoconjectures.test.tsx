import {
  compute_coefficients,
  construct_conjecture,
  convert_coefficients,
  convert_to_rationals,
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

const points1_mixed = [
  [
    // order 9
    {
      x: 2,
      y: 8,
    },
    {
      x: 1,
      y: 36,
    },
  ],
  [
    // order 5
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
    // order 4
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
    // order 8
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
    // order 7
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
    // order 3
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
    // order 6
    {
      x: 2,
      y: 5,
    },
    {
      x: 1,
      y: 15,
    },
  ],
];

const orders1_mixed = [9, 5, 4, 8, 7, 3, 6];

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

const rational_points3 = [
  [
    // order 3
    {
      x: Rational.fromNumber(2),
      y: Rational.fromNumber(2),
    },
  ],
  [
    // order 5
    {
      x: Rational.fromNumber(4),
      y: Rational.fromNumber(4),
    },
  ],
  [
    // order 7
    {
      x: Rational.fromNumber(6),
      y: Rational.fromNumber(6),
    },
  ],
  [
    // order 9
    {
      x: Rational.fromNumber(8),
      y: Rational.fromNumber(8),
    },
  ],
];

const pFloat1 = { x: 3.6, y: 2.4 };
const pFloat2 = { x: 4.36, y: 1.64 };
const pFloat3 = { x: 5.436, y: 0.0564 };
const pFloat4 = { x: 5.7436, y: 0.7436 };

const psFloat = [[pFloat1, pFloat2, pFloat3, pFloat4]];

test("convert_to_rationals", () => {
  const result = convert_to_rationals(points3);
  expect(result).toEqual(rational_points3);
});

test("convert_to_rationals_with_float", () => {
  const result = convert_to_rationals(psFloat);
  const expected = [
    [
      {
        x: new Rational(18, 5), // 3.6
        y: new Rational(12, 5), // 2.4
      },
      {
        x: new Rational(109, 25), // 4.36
        y: new Rational(41, 25), // 1.64
      },
      {
        x: new Rational(1359, 250), // 5.436
        y: new Rational(141, 2500), // 0.0564
      },
      {
        x: new Rational(14359, 2500), // 5.7436
        y: new Rational(1859, 2500), // 0.7436
      },
    ],
  ];
  expect(result).toEqual(expected);
});

test("compute_main_coefficients", () => {
  const result = compute_coefficients(convert_to_rationals(points1));
  expect(result).toEqual(main_coefficients1);
});

test("convert_main_coefficients", () => {
  const result = convert_coefficients(main_coefficients1, orders1);
  expect(result).toEqual(convert_to_rationals(converted_coefficients1));
});

test("compute_secondary_coefficients", () => {
  const result = compute_coefficients(
    convert_to_rationals(converted_coefficients1)
  );
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
    inequality.MORE,
    false
  );
  expect(result).toBe("y >= (-1/2n^{2}+3/2n-1)x+(n^{2}-2n+1)");
});

test("main_func", () => {
  const result1 = main_func(points1, orders1, searched_f.FX, inequality.MORE);
  expect(result1).toBe("y >= (-1/2n^{2}+3/2n-1)x+(n^{2}-2n+1)");

  const result2 = main_func(points2, orders2, searched_f.FY, inequality.LESS); // ERROR
  expect(result2).toBe("not correct, because lists not same length");

  const result3 = main_func(points3, orders2, searched_f.FY, inequality.LESS); // With odd orders
  expect(result3).toBe("x <= (n-1)");

  const result1_mixed = main_func(
    points1_mixed,
    orders1_mixed,
    searched_f.FX,
    inequality.MORE
  );
  expect(result1_mixed).toBe(result1);
});
