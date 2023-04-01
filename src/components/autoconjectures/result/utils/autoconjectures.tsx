import { lagrange } from "./lagrange";
import Polynomial from "./polynomial";
import Rational from "./rational";

export enum searched_f {
  FX,
  FY,
}

export enum inequality {
  MORE = ">=",
  LESS = "<=",
}

export enum inequality_latex {
  MORE = "\\ge",
  LESS = "\\le",
}

export interface RationalPoint {
  x: Rational;
  y: Rational;
}

export interface Point {
  x: number;
  y: number;
}

// Compute main coefficients ie f which pass by each points for each order
export const compute_coefficients = (
  points: Array<Array<RationalPoint>>
): Array<Array<Rational>> => {
  const result: Array<Array<Rational>> = [];
  for (let i = 0; i < points.length; i++) {
    const current_n_points = points[i];
    if (current_n_points.length === 1) result.push([current_n_points[0].y]);
    else result.push(lagrange(current_n_points).coefficients);
  }
  return result;
};

// Convert main coefficients to list of list of points {x: order, y: coefficient | 0}
export const convert_coefficients = (
  coeffs: Array<Array<Rational>>,
  orders: Array<number>
): Array<Array<RationalPoint>> => {
  const result: Array<Array<RationalPoint>> = [];
  const max_num_coeffs = coeffs[coeffs.length - 1].length - 1;
  for (let coeff_num = 0; coeff_num <= max_num_coeffs; coeff_num++) {
    const current: Array<RationalPoint> = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const current_coeff = coeffs[i][coeff_num];
      current.push({
        x: Rational.fromNumber(order),
        y: current_coeff ? current_coeff : Rational.fromNumber(0),
      });
    }
    result.push(current);
  }
  return result;
};

export const get_longer = (coeffs: Array<Array<Rational>>): Array<Rational> => {
  let result: Array<Rational> = coeffs[0];
  for (let i = 1; i < coeffs.length; i++) {
    if (coeffs[i].length > result.length) result = coeffs[i];
  }
  return result;
};

// Construct all conjectures from main and secondary coefficients
export const construct_conjecture = (
  main_coefficients: Array<Array<Rational>>,
  secondary_coefficients: Array<Array<Rational>>,
  f: searched_f,
  ineq: inequality | inequality_latex,
  inLatex: boolean
): string => {
  const order_pols: Array<string> = [];
  for (let order_coeff of secondary_coefficients) {
    const temp_pol = new Polynomial(order_coeff);
    order_pols.push(temp_pol.toString("n", inLatex));
  }

  const main_coeff = get_longer(main_coefficients); // Get the longest list of coefficients
  const temp_pol = new Polynomial(main_coeff);

  let res: string = f === searched_f.FY ? "x " : "y ";
  res += ineq + " ";
  res += temp_pol.toStringReplaceCoeffs(
    f === searched_f.FY ? "y" : "x",
    order_pols,
    inLatex
  );

  return res;
};

// Main function called from outside
export const main_func = (
  points: Array<Array<Point>>,
  orders: Array<number>,
  f: searched_f,
  ineq: inequality | inequality_latex,
  inLatex: boolean = false
): string => {
  if (points.length !== orders.length)
    return "not correct, because lists not same length";

  const rational_points = convert_to_rationals(points);
  let main_coefficients: Array<Array<Rational>>;
  if (f === searched_f.FY) {
    const new_points: Array<Array<RationalPoint>> = [];
    //Exchange x and y in points (search x in function of y)
    rational_points.forEach((order_points) => {
      const temp_points: Array<RationalPoint> = [];
      order_points.forEach((point) => {
        let temp = { x: point.y, y: point.x };
        temp_points.push(temp);
      });
      new_points.push(temp_points);
    });
    main_coefficients = compute_coefficients(new_points);
  } else {
    main_coefficients = compute_coefficients(rational_points);
  }

  const converted = convert_coefficients(main_coefficients, orders);
  const secondary_coefficients = compute_coefficients(converted);

  return construct_conjecture(
    main_coefficients,
    secondary_coefficients,
    f,
    ineq,
    inLatex
  );
};

export const convert_to_rationals = (
  points: Array<Array<Point>>
): Array<Array<RationalPoint>> => {
  const result: Array<Array<RationalPoint>> = [];
  for (let i = 0; i < points.length; i++) {
    const current_n_points = points[i];
    const current: Array<RationalPoint> = [];
    for (let j = 0; j < current_n_points.length; j++) {
      current.push({
        x: Rational.fromNumber(current_n_points[j].x),
        y: Rational.fromNumber(current_n_points[j].y),
      });
    }
    result.push(current);
  }
  return result;
};
