export const truncateName = (str) => {
  if (str.length < 10) return str;

  return str.substring(0, 10) + "...";
};

export const bytesToMb = (num) => {
  return (num / 10e6).toFixed(3);
};
