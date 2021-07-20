/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { createContext } from "react";
import { action, observable, computed, makeObservable, configure } from "mobx";

import { uuidv4 } from "../utils.js";
import {
  he1_indicators,
  load_data_from_json,
  load_data_from_ctehexml,
  load_fshobst_data_from_kyg,
  get_radiationdata,
} from "wasm-envolventecte";

import {
  DEFAULT_SHADE,
  DEFAULT_SPACE,
  DEFAULT_TB,
  DEFAULT_WALL,
  DEFAULT_WALLCONS,
  DEFAULT_WINDOW,
  DEFAULT_WINCONS,
} from "./defaults";

// import radiationdata from "../zcraddata.json";
import example from "./example.json";

// DEBUG:
/* lint import/no-webpack-loader-syntax: off */
// import test_ctehexml from '!raw-loader!../test/casopracticof21_ventanas_cubierta_raras_rot45.ctehexml';
// import test_ctehexml from '!raw-loader!../test/casopracticof21_ventanas_cubierta_raras.ctehexml';
// import test_ctehexml from '!raw-loader!../test/prueba_cub_rotada.ctehexml';
// import test_ctehexml from '!raw-loader!../test/ventanas_cubierta.ctehexml';
// import test_ctehexml from '!raw-loader!../test/ventanas_cubierta_reducido.ctehexml';

// no obligamos a usar acciones para cambiar el estado. El default es "always".
// Ver https://mobx.js.org/configuration.html#enforceactions
configure({
  enforceActions: "never",
});

// Valores de radiación
const RADIATIONDATA = get_radiationdata();

class AppState {
  // Datos climáticos --------

  // Zona climática y otros metadatos
  meta = example.meta;

  // Datos geométricos y constructivos -----------
  // Espacios de la envolvente térmica
  spaces = example.spaces;
  // Opacos
  walls = example.walls;
  // Huecos
  windows = example.windows;
  // Sombras
  shades = example.shades;
  // Construcciones de opacos
  wallcons = example.wallcons;
  // Construcciones de huecos
  wincons = example.wincons;

  // Puentes térmicos
  thermal_bridges = example.thermal_bridges;

  // Lista de errores y avisos -------
  // Contiene objetos  { level: warninglevel, id: "element_id", msg: "my msg" }
  // donde warninglevel puede ser: SUCCESS | DANGER | WARNING | INFO (y corresponden a clases Bootstrap en minúsculas)
  errors = [];

  constructor() {
    makeObservable(this, {
      // Decorators
      // title: observable can be omitted, its is the default when using observable.object
      meta: observable,
      spaces: observable,
      walls: observable,
      windows: observable,
      shades: observable,
      thermal_bridges: observable,
      wallcons: observable,
      wincons: observable,
      errors: observable,
      // Valores calculados
      he1_indicators: computed({ requiresReaction: true }),
      zoneslist: computed,
      orientations: computed,
      warnings: computed,
      // TODO: estos dos se podrían llegar a eliminar si cambiamos climas y usamos los del wasm
      climatedata: computed({ requiresReaction: true }),
      climateTotRadJul: computed({ requiresReaction: true }),
      agrupaHuecos: action,
      agrupaOpacos: action,
      agrupaPts: action,
      clearModel: action,
      asJSON: computed,
      loadData: action,
    });
  }

  // Propiedades de datos climáticos ----------------
  get zoneslist() {
    return [...new Set(RADIATIONDATA.map((v) => v.zone))];
  }

  get orientations() {
    return [...new Set(RADIATIONDATA.map((v) => v.orientation))];
  }

  get climatedata() {
    return RADIATIONDATA.filter((v) => v.zone === this.meta.climate);
  }

  get climateTotRadJul() {
    return this.climatedata.reduce(
      (acc, v) => ({ ...acc, [v.orientation]: v.dir[6] + v.dif[6] }),
      {}
    );
  }

  get he1_indicators() {
    const { meta, thermal_bridges, walls, windows, spaces, wallcons, wincons } =
      this;

    return he1_indicators({
      meta,
      spaces,
      walls,
      windows,
      thermal_bridges,
      wallcons,
      wincons,
    });
  }

  // Acumula errores de la app y avisos de los cálculos
  get warnings() {
    return this.errors.concat(this.he1_indicators.warnings);
  }

  // Pertenencia de un muro a la envolvente térmica
  // TODO: llevar a wasm, que devolvería lista de ids de muros en la ET y solamente comprobaríamos si está en esa lista el id.
  /* eslint-disable no-undefined */
  wall_is_inside_tenv(wall) {
    const spaces_list = this.spaces;
    const space = spaces_list.find((s) => s.id === wall.space);
    // 1. El muro no pertenece a ningún espacio -> fuera
    if (space === undefined) {
      return false;
    }

    const spacenxt = spaces_list.find((s) => s.id === wall.nextto);
    // 2. Muro que no es interior en un espacio exterior -> fuera
    if (wall.bounds !== "INTERIOR" && space.inside_tenv === false) {
      return false;
    }
    // 3. Muro interior que separa dos espacios o exteriores o interiores -> fuera
    if (
      wall.bounds === "INTERIOR" &&
      spacenxt !== undefined &&
      space.inside_tenv === spacenxt.inside_tenv
    ) {
      return false;
    }
    // 4. Caso mal definido con space !== null y spacenxt === null -> fuera
    if (wall.bounds === "INTERIOR" && spacenxt === undefined) {
      return false;
    }
    // 5. Resto de casos
    return true;
  }

  // Constructores --------
  newHueco = DEFAULT_WINDOW;
  newOpaco = DEFAULT_WALL;
  newPT = DEFAULT_TB;
  newShade = DEFAULT_SHADE;
  newSpace = DEFAULT_SPACE;
  newWallCons = DEFAULT_WALLCONS;
  newWinCons = DEFAULT_WINCONS;

  // Acciones --------

  // Agrupa superficie de huecos por tipos
  agrupaHuecos() {
    const isequal = (h1, h2) => h1.cons === h2.cons && h1.wall === h2.wall;
    const huecosagrupados = [];
    for (let hueco of this.windows) {
      const h = huecosagrupados.find((e) => isequal(hueco, e));
      if (h) {
        h.fshobst =
          (1.0 * (h.fshobst * h.A + hueco.fshobst * hueco.A)) / (h.A + hueco.A);
        h.A = 0.0 + h.A + hueco.A;
        h.name = h.name + ", " + hueco.name;
        h.id = uuidv4();
      } else {
        huecosagrupados.push(hueco);
      }
    }
    this.windows = huecosagrupados;
  }

  // Agrupa superficie de opacos por tipos (y reescribimos referencias en huecos)
  agrupaOpacos() {
    const isequal = (o1, o2) =>
      o1.bounds === o2.bounds &&
      o1.cons === o2.cons &&
      o1.space === o2.space &&
      o1.nextto === o2.nextto &&
      o1.geometry.azimuth === o2.geometry.azimuth &&
      o1.geometry.tilt === o2.geometry.tilt &&
      o1.geometry.position === o2.geometry.position &&
      o1.geometry.polygon === o2.geometry.polygon;
    const opacosagrupados = [];
    for (let opaco of this.walls) {
      const o = opacosagrupados.find((e) => isequal(opaco, e));
      if (o) {
        const oldid = o.id;
        const newid = uuidv4();
        o.A = o.A + opaco.A;
        o.name = o.name + ", " + opaco.name;
        o.id = newid;
        // Reescribimos referencias a los anteriores id
        for (let w of this.windows) {
          if (w.wall === oldid || w.wall === opaco.id) {
            w.wall = newid;
          }
        }
      } else {
        opacosagrupados.push(opaco);
      }
    }
    this.walls = opacosagrupados;
  }

  // Agrupa longitudes de puentes térmicos por tipos
  agrupaPts() {
    const isequal = (p1, p2) => Number(p1.psi) === Number(p2.psi);
    const ptsagrupados = [];
    for (let pt of this.thermal_bridges) {
      const p = ptsagrupados.find((e) => isequal(pt, e));
      if (p) {
        p.A = p.L + pt.L;
        p.name = p.name + ", " + pt.name;
        p.id = uuidv4();
      } else {
        ptsagrupados.push(pt);
      }
    }
    this.thermal_bridges = ptsagrupados;
  }

  // Deja modelo limpio
  clearModel() {
    this.meta = {
      name: "Modelo vacío",
      is_new_building: true,
      is_dwelling: true,
      num_dwellings: 1,
      climate: "D3",
      global_ventilation_l_s: 0,
      n50_test_ach: null,
      d_perim_insulation: 0,
      rn_perim_insulation: 0,
    };
    this.spaces = [];
    this.walls = [];
    this.windows = [];
    this.shades = [];
    this.thermal_bridges = [];
    this.wallcons = [];
    this.wincons = [];
  }

  // Importación y exportación de datos -------------

  // Serialización de los datos
  get asJSON() {
    const {
      meta,
      spaces,
      walls,
      windows,
      shades,
      thermal_bridges,
      wallcons,
      wincons,
    } = this;

    return JSON.stringify(
      {
        meta,
        spaces,
        walls,
        windows,
        shades,
        thermal_bridges,
        wallcons,
        wincons,
      },
      null,
      2
    );
  }

  // Deserialización de datos desde
  // - JSON (mode = "JSON")
  // - CTEHEXML (mode="CTEHEXML")
  // - KyGananciasSolares.txt (mode="FSHOBST")
  loadData(data, mode) {
    // Lee datos
    try {
      let inputData;
      if (mode === "FSHOBST") {
        inputData = load_fshobst_data_from_kyg(data);
      } else if (mode === "CTEHEXML") {
        inputData = load_data_from_ctehexml(data);
      } else {
        inputData = load_data_from_json(data);
      }

      if (mode === "CTEHEXML" || mode === "JSON") {
        const {
          meta = { climate: "D3" },
          spaces,
          walls,
          windows,
          shades,
          thermal_bridges,
          wallcons,
          wincons,
        } = inputData;

        // Carga datos en el store
        this.meta = meta;
        this.thermal_bridges = thermal_bridges;
        this.walls = walls;
        this.windows = windows;
        this.spaces = spaces;
        this.shades = shades;
        this.wallcons = wallcons;
        this.wincons = wincons;

        this.errors = [
          { level: "SUCCESS", id: null, msg: "Datos cargados correctamente." },
          {
            level: "INFO",
            id: null,
            msg: `Clima ${meta.climate}, Cargados ${spaces.length} espacios, ${walls.length} opacos, ${windows.length} huecos, ${thermal_bridges.length} PTs, ${shades.length} elementos de sombra, ${wallcons.length} construcciones de opacos y ${wincons.length} construcciones de huecos`,
          },
        ];
      } else if (mode === "FSHOBST") {
        this.errors = [
          { level: "SUCCESS", id: null, msg: "Datos cargados correctamente." },
          {
            level: "INFO",
            id: null,
            msg: `Cargados ${inputData.length} factores de sombra de obstáculos remotos (F_shobst) de huecos`,
          },
        ];

        for (let window of this.windows) {
          let fshobst = inputData[window.name];
          if (fshobst === undefined || isNaN(fshobst)) {
            this.errors.push({
              level: "INFO:",
              id: null,
              msg: `Hueco ${window.name} sin datos de factor reductor por sombreamiento de obstáculos remotos F_sh;obst`,
            });
          } else {
            window.fshobst = fshobst;
          }
        }
      } else {
        this.errors = [
          {
            level: "INFO",
            id: null,
            msg: `No se han encontrado datos de modelo en el archivo.`,
          },
        ];
      }
    } catch (err) {
      this.errors = [
        {
          level: "DANGER",
          id: null,
          msg: `El archivo no contiene datos con un formato adecuado. ${err}`,
        },
      ];
    }
  }
}

const appstate = new AppState();

// // DEBUG: carga este caso para depurar
// appstate.loadData(test_ctehexml, "CTEHEXML");

export default createContext(appstate);
