import React from "react";
import ReactDOM from "react-dom";
import { App } from "./components/App";
import "./index.css";

// Investigar https://rustwasm.github.io/wasm-bindgen/examples/hello-world.html#indexjs
// https://rustwasm.github.io/wasm-bindgen/examples/without-a-bundler.html
// Ver --target web de wasm-bindgen
import { set_panic_hook, set_log_hook } from "wasm-envolventecte";

set_panic_hook();
set_log_hook("warn");

ReactDOM.render(<App />, document.getElementById("root"));
