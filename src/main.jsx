import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./components/App";

import { set_panic_hook, set_log_hook } from "wasm-envolventecte";

set_panic_hook();
set_log_hook("warn");

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
