import { SimplifiedCoordinate } from "../../../../store/reducers/main_reducer";
import NumRat from "../../../../utils/numRat";
import { lagrange } from "./lagrange";
import Polynomial from "./polynomial";

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

// Compute main coefficients ie f which pass by each points for each order
export const compute_coefficients = (
  points: Array<Array<SimplifiedCoordinate>>,
  inRational: boolean,
  decimalNb: number
): Array<Array<NumRat>> => {
  const result: Array<Array<NumRat>> = [];
  for (let i = 0; i < points.length; i++) {
    const current_n_points = points[i];
    if (current_n_points.length === 1) result.push([current_n_points[0].y]);
    else
      result.push(
        lagrange(current_n_points, inRational, decimalNb).coefficients
      );
  }
  return result;
};

// Convert main coefficients to list of list of points {x: order, y: coefficient | 0}
export const convert_coefficients = (
  coeffs: Array<Array<NumRat>>,
  orders: Array<number>
): Array<Array<SimplifiedCoordinate>> => {
  const result: Array<Array<SimplifiedCoordinate>> = [];
  const max_num_coeffs = coeffs[coeffs.length - 1].length - 1;
  for (let coeff_num = 0; coeff_num <= max_num_coeffs; coeff_num++) {
    const current: Array<SimplifiedCoordinate> = [];

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      const current_coeff = coeffs[i][coeff_num];
      current.push({
        x: new NumRat(order),
        y: current_coeff ? current_coeff : new NumRat(0),
      });
    }
    result.push(current);
  }
  return result;
};

export const get_longer = (coeffs: Array<Array<NumRat>>): Array<NumRat> => {
  let result: Array<NumRat> = coeffs[0];
  for (let i = 1; i < coeffs.length; i++) {
    if (coeffs[i].length > result.length) result = coeffs[i];
  }
  return result;
};

// Construct all conjectures from main and secondary coefficients
export const construct_conjecture = (
  main_coeffs: Array<Array<NumRat>>,
  secondary_coeffs: Array<Array<NumRat>>,
  f: searched_f,
  ineq: inequality | inequality_latex,
  inLatex: boolean
): string => {
  const order_pols: Array<string> = [];
  for (let order_coeff of secondary_coeffs) {
    const temp_pol = new Polynomial(order_coeff);

    order_pols.push(temp_pol.toString("n", inLatex));
  }

  const temp_pol = new Polynomial(get_longer(main_coeffs));

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
  points: Array<Array<SimplifiedCoordinate>>,
  orders: Array<number>,
  f: searched_f,
  ineq: inequality | inequality_latex,
  inLatex: boolean = false,
  inRational: boolean = false,
  decimalNb: number
): string => {
  if (points.length !== orders.length)
    return "not correct, because lists not same length";

  let main_coefficients: Array<Array<NumRat>>;
  if (f === searched_f.FY) {
    const new_points: Array<Array<SimplifiedCoordinate>> = [];
    //Exchange x and y in points (search x in function of y)
    points.forEach((order_points) => {
      const temp_points: Array<SimplifiedCoordinate> = [];
      order_points.forEach((point) => {
        let temp = { x: point.y, y: point.x };
        temp_points.push(temp);
      });
      new_points.push(temp_points);
    });
    main_coefficients = compute_coefficients(new_points, inRational, decimalNb);
  } else {
    main_coefficients = compute_coefficients(points, inRational, decimalNb);
  }

  const converted = convert_coefficients(main_coefficients, orders);
  const secondary_coefficients = compute_coefficients(
    converted,
    inRational,
    decimalNb
  );

  return construct_conjecture(
    main_coefficients,
    secondary_coefficients,
    f,
    ineq,
    inLatex
  );
};
