// La versión web usa SQLite compilado a WebAssembly (expo-sqlite), así que Metro
// tiene que tratar los archivos .wasm como assets.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('wasm');

module.exports = config;
