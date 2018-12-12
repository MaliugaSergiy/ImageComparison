const isInRange = (x, range) => {
  const [min, max] = range;
  return x >= min && x <= max;
};
export default isInRange;
