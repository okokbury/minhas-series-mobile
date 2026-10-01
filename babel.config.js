module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }], // faz o className funcionar
      'nativewind/babel',
    ],
  };
};