// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Use a different port to avoid conflicts
config.server = {
  port: 8082
};

module.exports = config;
