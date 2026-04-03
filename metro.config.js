const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

const nativeWindConfig = withNativeWind(config, { input: './global.css' });

// Force CJS builds for packages whose ESM builds use import.meta
// (which Metro cannot handle). Exact paths verified against each package.
const CJS_MAP = {
  'i18next': 'i18next/dist/cjs/i18next.js',
  'react-i18next': 'react-i18next/dist/commonjs/index.js',
  'zustand': 'zustand/index.js',
  'zustand/middleware': 'zustand/middleware.js',
  'zustand/react': 'zustand/react.js',
  'zustand/vanilla': 'zustand/vanilla.js',
};

const defaultResolve = nativeWindConfig.resolver.resolveRequest;
nativeWindConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (CJS_MAP[moduleName]) {
    return {
      filePath: path.resolve(__dirname, 'node_modules', CJS_MAP[moduleName]),
      type: 'sourceFile',
    };
  }
  if (defaultResolve) return defaultResolve(context, moduleName, platform);
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = nativeWindConfig;
