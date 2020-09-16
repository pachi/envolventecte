/* -*- coding: utf-8 -*-

Copyright (c) 2016-2017 Rafael Villar Burke <pachi@rvburke.com>

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

import { action, observable, computed, decorate } from "mobx";
import { UserException, uuidv4 } from "../utils.js";
import {
  DEFAULT_SPACE,
  DEFAULT_TB,
  DEFAULT_WALL,
  DEFAULT_WINDOW,
} from "./defaults";

import radiationdata from "../zcraddata.json";
import example from "./example.json";

// Añade id's a archivo de ejemplo
const { spaces, walls, windows, thermal_bridges, wallcons, wincons } = example;

// Añade id's
for (const win in windows) {
  windows[win].id = uuidv4();
}
for (const wall in walls) {
  walls[wall].id = uuidv4();
}
for (const tb in thermal_bridges) {
  thermal_bridges[tb].id = uuidv4();
}
for (const sp in spaces) {
  spaces[sp].id = uuidv4();
}
for (const c in wallcons) {
  wallcons[c].id = uuidv4();
}
for (const c in wincons) {
  wincons[c].id = uuidv4();
}

export default class AppState {
  // Datos climáticos --------

  // Valores de radiación
  radiationdata = radiationdata;
  // Zona climática y otros metadatos
  meta = example.meta;

  // Datos geométricos y constructivos -----------

  // Coeficiente de caudal de aire de la parte opaca de la envolvente térmica a 100 Pa (m3/h/m2)
  Co100 = 16;
  // Espacios de la envolvente térmica
  spaces = example.spaces;
  // Opacos
  walls = example.walls;
  // Huecos
  windows = example.windows;
  // Construcciones de opacos
  wallcons = example.wallcons;
  // Construcciones de huecos
  wincons = example.wincons;

  // Puentes térmicos
  thermal_bridges = example.thermal_bridges;

  // Lista de errores -------
  errors = [];

  // Propiedades de datos climáticos ----------------
  get zoneslist() {
    return [...new Set(this.radiationdata.map((v) => v.zc))];
  }

  get orientations() {
    return [...new Set(this.radiationdata.map((v) => v.surfname))];
  }

  get climatedata() {
    return this.radiationdata.filter((v) => v.zc === this.meta.climate);
  }

  get climateTotRadJul() {
    return this.climatedata.reduce(
      (acc, v) => ({ ...acc, [v.surfname]: v.tot[6] }),
      {}
    );
  }

  // Constructores --------
  newHueco = DEFAULT_WINDOW;
  newOpaco = DEFAULT_WALL;
  newPT = DEFAULT_TB;
  newSpace = DEFAULT_SPACE;

  // Propiedades de datos de espacios ------------

  // Área útil de los espacios habitables en el interior de la envolvente térmica
  get Autil() {
    const nA = Object.values(this.spaces)
      .map(
        (s) =>
          s.multiplier *
          s.area *
          (s.inside_tenv ? 1.0 : 0.0) *
          (s.type !== "UNINHABITED" ? 1.0 : 0.0)
      )
      .reduce((acc, x) => acc + x, 0.0);
    return nA;
  }

  // Volumen neto de los espacios en el interior de la envolvente teŕmica
  get V_int() {
    const V = Object.values(this.spaces)
      .map(
        (s) =>
          s.multiplier * s.area * (s.inside_tenv ? 1.0 : 0.0) * s.height_net
      )
      .reduce((acc, x) => acc + x, 0.0);
    return V;
  }

  // Propiedades de datos de envolvente ---------
  get huecosA() {
    return Object.values(this.windows)
      .map((h) => Number(h.A))
      .reduce((a, b) => a + b, 0);
  }

  get huecosAU() {
    return Object.values(this.windows)
      .map((h) => Number(h.A) * Number(h.U))
      .reduce((a, b) => a + b, 0);
  }

  get opacosA() {
    return Object.values(this.walls)
      .map(
        (o) =>
          (o.bounds === "EXTERIOR" || o.bounds === "GROUND" ? 1.0 : 0.0) *
          (o.U === 0.0 ? 0.0 : 1.0) * // XXX: Elementos adiabáticos y no pertenecientes a la ET desde HULC (con 0.0 al no estar en KyG)
          Number(o.A)
      )
      .reduce((a, b) => a + b, 0);
  }

  get opacosAU() {
    return Object.values(this.walls)
      .map(
        (o) =>
          (o.bounds === "EXTERIOR" || o.bounds === "GROUND" ? 1.0 : 0.0) *
          Number(o.A) *
          Number(o.U)
      )
      .reduce((a, b) => a + b, 0);
  }

  get ptsL() {
    return Object.values(this.thermal_bridges)
      .map((h) => Number(h.L))
      .reduce((a, b) => a + b, 0);
  }

  get ptsPsiL() {
    return Object.values(this.thermal_bridges)
      .map((h) => Number(h.L) * Number(h.psi))
      .reduce((a, b) => a + b, 0);
  }

  get totalA() {
    return this.huecosA + this.opacosA;
  }

  get totalAU() {
    return this.huecosAU + this.opacosAU;
  }

  get K() {
    return (this.totalAU + this.ptsPsiL) / this.totalA;
  }

  get q_soljul() {
    return (climateTotRadJul) =>
      Object.values(this.windows)
        .map(
          (h) =>
            Number(h.Fshobst) *
            Number(h.gglshwi) *
            (1 - Number(h.Ff)) *
            Number(h.A) *
            climateTotRadJul[h.orientation]
        )
        .reduce((a, b) => a + b, 0) / this.Autil;
  }
  // Acciones --------

  // Agrupa superficie de huecos por tipos
  agrupaHuecos() {
    // TODO: esto no es correcto mientras no arreglemos los tipos
    const isequal = (h1, h2) =>
      h1.orientation === h2.orientation &&
      Number(h1.Ff) === Number(h2.Ff) &&
      Number(h1.U) === Number(h2.U) &&
      Number(h1.gglshwi) === Number(h2.gglshwi) &&
      Number(h1.gglwi) === Number(h2.gglwi);
    const huecosagrupados = [];
    for (let hueco of Object.values(this.windows)) {
      const h = huecosagrupados.find((e) => isequal(hueco, e));
      if (h) {
        h.Fshobst =
          (1.0 * (h.Fshobst * h.A + hueco.Fshobst * hueco.A)) / (h.A + hueco.A);
        h.A = 0.0 + h.A + hueco.A;
        h.name = h.name + ", " + hueco.name;
        h.id = uuidv4();
      } else {
        huecosagrupados.push(hueco);
      }
    }
    this.windows = Object.fromEntries(huecosagrupados.map((e) => [e.name, e]));
  }

  // Agrupa superficie de opacos por tipos
  agrupaOpacos() {
    // TODO: esto no es correcto mientras no arreglemos los tipos
    const isequal = (o1, o2) =>
      Number(o1.U) === Number(o2.U) && o1.bounds === o2.bounds;
    const opacosagrupados = [];
    for (let opaco of Object.values(this.walls)) {
      const o = opacosagrupados.find((e) => isequal(opaco, e));
      if (o) {
        o.A = o.A + opaco.A;
        o.name = o.name + ", " + opaco.name;
        o.id = uuidv4();
      } else {
        opacosagrupados.push(opaco);
      }
    }
    this.walls = Object.fromEntries(opacosagrupados.map((e) => [e.name, e]));
  }

  // Agrupa longitudes de puentes térmicos por tipos
  agrupaPts() {
    const isequal = (p1, p2) => Number(p1.psi) === Number(p2.psi);
    const ptsagrupados = [];
    for (let pt of Object.values(this.thermal_bridges)) {
      const p = ptsagrupados.find((e) => isequal(pt, e));
      if (p) {
        p.A = p.L + pt.L;
        p.name = p.name + ", " + pt.name;
        p.id = uuidv4();
      } else {
        ptsagrupados.push(pt);
      }
    }
    this.thermal_bridges = Object.fromEntries(
      ptsagrupados.map((e) => [e.name, e])
    );
  }

  // Importación y exportación de datos -------------

  // Serialización de los datos
  get asJSON() {
    const { meta, thermal_bridges, walls, windows, spaces } = this;

    // Eliminamos ids
    Object.values(windows).forEach((e) => delete e.id);
    Object.values(walls).forEach((e) => delete e.id);
    Object.values(thermal_bridges).forEach((e) => delete e.id);
    Object.values(spaces).forEach((e) => delete e.id);
    Object.values(wallcons).forEach((e) => delete e.id);
    Object.values(wincons).forEach((e) => delete e.id);

    return JSON.stringify(
      { meta, spaces, walls, windows, thermal_bridges, wallcons, wincons },
      null,
      2
    );
  }

  // Deserialización de datos desde JSON
  loadJSON(data) {
    // Lee datos
    try {
      const {
        meta = { climate: "D3" },
        spaces,
        walls,
        windows,
        thermal_bridges,
        wallcons,
        wincons,
      } = JSON.parse(data);
      if (
        !(
          typeof windows === "object" &&
          typeof walls === "object" &&
          typeof thermal_bridges === "object" &&
          typeof spaces === "object" &&
          typeof wallcons === "object" &&
          typeof wincons === "object"
        )
      ) {
        throw UserException("Formato incorrecto");
      }

      // Añade id's
      Object.values(windows).forEach((e) => {
        e.id = uuidv4();
      });
      Object.values(walls).forEach((e) => {
        e.id = uuidv4();
      });
      Object.values(thermal_bridges).forEach((e) => {
        e.id = uuidv4();
      });
      Object.values(spaces).forEach((e) => {
        e.id = uuidv4();
      });
      Object.values(wallcons).forEach((e) => {
        e.id = uuidv4();
      });
      Object.values(wincons).forEach((e) => {
        e.id = uuidv4();
      });

      // Almacena en store datos
      this.meta = meta;
      this.thermal_bridges = thermal_bridges;
      this.walls = walls;
      this.windows = windows;
      this.spaces = spaces;
      this.wallcons = wallcons;
      this.wincons = wincons;

      this.errors = [
        { type: "SUCCESS", msg: "Datos cargados correctamente." },
        {
          type: "INFO",
          msg: `Clima ${meta.climate}, Cargados ${
            Object.values(spaces).length
          } espacios, ${Object.values(walls).length} opacos, ${
            Object.values(windows).length
          } huecos, ${Object.values(thermal_bridges).length} PTs, ${
            Object.values(wallcons).length
          } construcciones de opacos y ${
            Object.values(wincons).length
          } construcciones de huecos`,
        },
      ];
    } catch (err) {
      this.errors = [
        {
          type: "DANGER",
          msg: `El archivo no contiene datos con un formato adecuado. ${err}`,
        },
      ];
    }
  }
}

decorate(AppState, {
  // Decorators
  // title: observable can be omitted, its is the default when using observable.object
  meta: observable,
  Co100: observable,
  spaces: observable,
  walls: observable,
  windows: observable,
  thermal_bridges: observable,
  wallcons: observable,
  wincons: observable,
  errors: observable,
  // Valores calculados
  Autil: computed,
  V_int: computed,
  zoneslist: computed,
  orientations: computed,
  climatedata: computed({ requiresReaction: true }),
  climateTotRadJul: computed({ requiresReaction: true }),
  huecosA: computed,
  huecosAU: computed,
  opacosA: computed,
  opacosAU: computed,
  ptsL: computed,
  ptsPsiL: computed,
  totalA: computed,
  totalAU: computed,
  K: computed,
  q_soljul: computed({ requiresReaction: true }),
  agrupaHuecos: action,
  agrupaOpacos: action,
  agrupaPts: action,
  asJSON: computed,
  loadJSON: action,
});
