module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['expo-router/babel', {
        appRoot: './app' // or './src/app' if that’s where your routes folder lives
      }]
    ],
  };
};
