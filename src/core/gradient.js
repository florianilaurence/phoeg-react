export const GRADIENT =  [
    [0, 0, 255, 30],
    [50, 255, 255, 30],
    [100, 255, 0, 30]
];

export const pickColorIntoGradient = (gradient, per) => {
  if (per < 0 || per > 100)
    return

  let i = 1;
  while (gradient[i][0] < per)
    i += 1;

  let d1 = per - gradient[i - 1][0];
  let d2 = gradient[i][0] - per;
  let d = gradient[i][0] - gradient[i - 1][0];
  let p1 = d2 / d;
  let p2 = d1 / d;

  let r = gradient[i - 1][1] * p1 + gradient[i][1] * p2;
  let g = gradient[i - 1][2] * p1 + gradient[i][2] * p2;
  let b = gradient[i - 1][3] * p1 + gradient[i][3] * p2;

  return `rgb(${r},${g},${b})`
}
