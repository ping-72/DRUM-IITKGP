/* Min-Max Normalization
 * Normalizes an array of values to a range [0, 1] */
export function minMaxNormalize(values) {
  if (!values) {
    throw new Error('Values must be provided');
  }
  const min = Math.min(...values);
  const max = Math.max(...values);

  return values.map((value) => (value - min) / (max - min));
}

/* Z-score Normalization
 * Formula: (value - mean) / stdDev */
export function zScoreNormalize(values) {
  if (!values) {
    throw new Error('Values must be provided');
  }
  const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((acc, value) => acc + Math.pow(value - mean, 2), 0) / values.length);
  return values.map((value) => (value - mean) / stdDev);
}
