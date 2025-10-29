const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limit watch scope to mobile directory only to avoid permission issues
config.watchFolders = [__dirname];

module.exports = config;

