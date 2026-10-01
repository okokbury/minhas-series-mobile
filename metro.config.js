const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Aqui o global.css é ligado ao app.
module.exports = withNativeWind(config, { input: './global.css' });