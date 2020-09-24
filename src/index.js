// A dependency graph that contains any wasm must all be imported
// asynchronously. This `index.js` file does the single async import, so
// that no one else needs to worry about it again.
import("./main.js")
  // eslint-disable-next-line no-console
  .catch((e) => console.error("Error importing `index.js`:", e));
