import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

import { set_panic_hook } from "wasm-envolventecte";

set_panic_hook();

ReactDOM.render(<App />, document.getElementById("root"));
