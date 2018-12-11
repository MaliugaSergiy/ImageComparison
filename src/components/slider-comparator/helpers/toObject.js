const toObject = source => {
  let result = {};

  for (let key in source) {
    result[key] = source[key];
  }

  return result;
};

export default toObject;
