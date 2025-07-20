const currentTime = () => {
  const now = new Date();

  const result = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    hours: now.getHours(),
    minutes: now.getMinutes(),
    seconds: now.getSeconds(),
  };

  for (const key in result) {
    result[key] = addZero(result[key]);
  }

  return result;
};

const addZero = (num) => {
  // Helper function to add leading zero to single-digit numbers
  // return num > 9 ? num : "0" + num
  return num.toString().padStart(2, "0");
};

module.exports = currentTime;
