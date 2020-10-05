// adds delay to function that is passed in
const debounce = (func, delay = 1000) => {
  let timeOutId;
  return (...args) => {
    console.log(...args);
    if (timeOutId) {
      clearTimeout(timeOutId);
    }
    timeOutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};
