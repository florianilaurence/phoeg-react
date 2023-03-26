import { lagrange, Point } from "./lagrange";
import Polynomial from "./polynomial";

export enum searched_f {
  FX,
  FY,
}

export enum inequality {
  MORE = ">=",
  LESS = "<=",
}

const compute_main_coefficients = (
  points: Array<Array<Point>>,
  orders: Array<number>
): Array<Array<number>> => {
  const result: Array<Array<number>> = [];
  for (let i = 0; i < orders.length; i++) {
    const current_n_points = points[i];
    if (current_n_points.length === 1) result.push([current_n_points[0].y]);
    else result.push(lagrange(current_n_points).coefficients);
  }

  return result;
};

const convert_coefficients = (
  main_coefficients: Array<Array<number>>,
  orders: Array<number>
): Array<Array<Point>> => {
  const result: Array<Array<Point>> = [];
  const max_num_coeffs =
    main_coefficients[main_coefficients.length - 1].length - 1;
  for (let coeff_num = 0; coeff_num <= max_num_coeffs; coeff_num++) {
    const current: Array<Point> = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const current_coeff = main_coefficients[i][coeff_num];
      current.push({ x: order, y: current_coeff ? current_coeff : 0 });
    }
    result.push(current);
  }
  return result;
};

const compute_secondary_coefficients = (
  points: Array<Array<Point>>
): Array<Array<number>> => {
  const result: Array<Array<number>> = [];
  for (let i = 0; i < points.length; i++) {
    const current_points = points[i];
    if (current_points.length === 1) {
      result.push([current_points[0].y]);
    } else {
      result.push(lagrange(current_points).coefficients);
    }
  }
  return result;
};

const construct_conjecture = (
  main_coefficients: Array<Array<number>>,
  secondary_coefficients: Array<Array<number>>,
  f: searched_f,
  ineq: inequality
): string => {
  const order_pols: Array<string> = [];
  for (let order_coeff of secondary_coefficients) {
    const temp_pol = new Polynomial(order_coeff, order_coeff.length - 1);
    order_pols.push(temp_pol.string_replace_x("n"));
  }
  const main_coeff = main_coefficients[main_coefficients.length - 1];
  const temp_pol = new Polynomial(main_coeff, main_coeff.length - 1);
  let res: string = f === searched_f.FY ? "x " : "y ";
  res += ineq === inequality.LESS ? "<= " : ">= ";
  res += temp_pol.string_replace_coeff(
    order_pols,
    f === searched_f.FY ? "y" : "x"
  );
  return res;
};

export const main_func = (
  points: Array<Array<Point>>,
  orders: Array<number>,
  f: searched_f,
  ineq: inequality
): string => {
  //TODO: change to ERROR
  if (points.length !== orders.length)
    return "not correct, because lists not same length";

  let main_coefficients: Array<Array<number>>;
  if (f === searched_f.FY) {
    const new_points: Array<Array<Point>> = [];
    //Exchange x and y in points (search x in function of y)
    points.forEach((order_points) => {
      const temp_points: Array<Point> = [];
      order_points.forEach((point) => {
        let temp = { x: point.y, y: point.x };
        temp_points.push(temp);
      });
      new_points.push(temp_points);
    });
    main_coefficients = compute_main_coefficients(new_points, orders);
  } else {
    main_coefficients = compute_main_coefficients(points, orders);
  }
  const converted = convert_coefficients(main_coefficients, orders);
  const secondary_coefficients = compute_secondary_coefficients(converted);
  return construct_conjecture(
    main_coefficients,
    secondary_coefficients,
    f,
    ineq
  );
};
