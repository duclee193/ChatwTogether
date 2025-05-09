module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Đảm bảo các plugin được định nghĩa đúng
    ],
  };
};
