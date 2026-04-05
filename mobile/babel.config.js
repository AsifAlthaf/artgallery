module.exports = function (api) {
  const isTest = api.env('test');
  api.cache(true);
  
  const presets = [
    ["babel-preset-expo", { 
      jsxImportSource: "nativewind",
      unstable_transformProfile: isTest ? 'default' : undefined,
    }],
  ];

  // Only add nativewind/babel in non-test environments
  if (!isTest) {
    presets.push("nativewind/babel");
  }

  const plugins = isTest 
    ? [
        ["module-resolver", {
          alias: {
            "react-native-worklets/plugin": "./tests/mock-worklets-plugin.js",
            "react-native-worklets-core/plugin": "./tests/mock-worklets-plugin.js",
            "react-native-reanimated/plugin": "./tests/mock-worklets-plugin.js",
          }
        }]
      ] 
    : ["react-native-reanimated/plugin", "react-native-worklets-core/plugin"];

  return {
    presets,
    plugins,
  };
};
