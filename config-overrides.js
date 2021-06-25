// Config overrides for  react-app-rewired
// const path = require("path");

const wasmExtensionRegExp = /\.wasm$/;

module.exports = function override(config, _env) {
  // Make file-loader ignore WASM files
  config.resolve.extensions.push(".wasm");

  config.module.rules.forEach((rule) => {
    (rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.loader && oneOf.loader.indexOf("file-loader") >= 0) {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // Esto no es necesario con wasm-bindgen
  // const wasmExtensionRegExp = /\.wasm$/;
  // // add a dedicated loader for WASM
  // config.module.rules.push({
  //   test: wasmExtensionRegExp,
  //   include: path.resolve(__dirname, "src"),
  //   use: [{ loader: require.resolve("wasm-loader"), options: {} }],
  // });

  return config;
};
