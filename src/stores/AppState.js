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
const { walls, windows, thermal_bridges } = example.envelope;
const example_spaces = example.spaces;
// Añade id's
windows.forEach((e) => {
  e.id = uuidv4();
});
walls.forEach((e) => {
  e.id = uuidv4();
});
thermal_bridges.forEach((e) => {
  e.id = uuidv4();
});
example_spaces.forEach((e) => {
  e.id = uuidv4();
});
const example_envelope = { walls, windows, thermal_bridges };

export default class AppState {
  // Datos climáticos --------

  // Valores de radiación
  radiationdata = radiationdata;
  // Zona climática
  climate = example.climate;

  // Datos geométricos y constructivos -----------

  // Coeficiente de caudal de aire de la parte opaca de la envolvente térmica a 100 Pa (m3/h/m2)
  Co100 = 16;
  // Elementos de la envolvente térmica
  envelope = example_envelope;
  // Espacios de la envolvente térmica
  spaces = example_spaces;

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
    return this.radiationdata.filter((v) => v.zc === this.climate);
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
    const nA = this.spaces
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
    const V = this.spaces
      .map(
        (s) =>
          s.multiplier * s.area * (s.inside_tenv ? 1.0 : 0.0) * s.height_net
      )
      .reduce((acc, x) => acc + x, 0.0);
    return V;
  }

  // Propiedades de datos de envolvente ---------
  get huecosA() {
    return this.envelope.windows
      .map((h) => Number(h.A))
      .reduce((a, b) => a + b, 0);
  }

  get huecosAU() {
    return this.envelope.windows
      .map((h) => Number(h.A) * Number(h.U))
      .reduce((a, b) => a + b, 0);
  }

  get opacosA() {
    return this.envelope.walls
      .map(
        (o) =>
          (o.bounds === "EXTERIOR" || o.bounds === "GROUND" ? 1.0 : 0.0) *
          (o.U === 0.0 ? 0.0 : 1.0) * // XXX: Elementos adiabáticos y no pertenecientes a la ET desde HULC (con 0.0 al no estar en KyG)
          Number(o.A)
      )
      .reduce((a, b) => a + b, 0);
  }

  get opacosAU() {
    return this.envelope.walls
      .map(
        (o) =>
          (o.bounds === "EXTERIOR" || o.bounds === "GROUND" ? 1.0 : 0.0) *
          Number(o.A) *
          Number(o.U)
      )
      .reduce((a, b) => a + b, 0);
  }

  get ptsL() {
    return this.envelope.thermal_bridges
      .map((h) => Number(h.L))
      .reduce((a, b) => a + b, 0);
  }

  get ptsPsiL() {
    return this.envelope.thermal_bridges
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

  get Qsoljul() {
    return (climateTotRadJul) =>
      this.envelope.windows
        .map(
          (h) =>
            Number(h.Fshobst) *
            Number(h.gglshwi) *
            (1 - Number(h.Ff)) *
            Number(h.A) *
            climateTotRadJul[h.orientation]
        )
        .reduce((a, b) => a + b, 0);
  }

  get qsj() {
    return (climateTotRadJul) => this.Qsoljul(climateTotRadJul) / this.Autil;
  }
  // Acciones --------

  // Agrupa superficie de huecos por tipos
  agrupaHuecos() {
    const isequal = (h1, h2) =>
      h1.orientation === h2.orientation &&
      Number(h1.Ff) === Number(h2.Ff) &&
      Number(h1.U) === Number(h2.U) &&
      Number(h1.gglshwi) === Number(h2.gglshwi) &&
      Number(h1.gglwi) === Number(h2.gglwi);
    const huecosagrupados = [];
    for (let hueco of this.envelope.windows) {
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
    this.envelope.windows.replace(huecosagrupados);
  }

  // Agrupa superficie de opacos por tipos
  agrupaOpacos() {
    const isequal = (o1, o2) =>
      Number(o1.U) === Number(o2.U) && o1.bounds === o2.bounds;
    const opacosagrupados = [];
    for (let opaco of this.envelope.walls) {
      const o = opacosagrupados.find((e) => isequal(opaco, e));
      if (o) {
        o.A = o.A + opaco.A;
        o.name = o.name + ", " + opaco.name;
        o.id = uuidv4();
      } else {
        opacosagrupados.push(opaco);
      }
    }
    this.envelope.walls.replace(opacosagrupados);
  }

  // Agrupa longitudes de puentes térmicos por tipos
  agrupaPts() {
    const isequal = (p1, p2) => Number(p1.psi) === Number(p2.psi);
    const ptsagrupados = [];
    for (let pt of this.envelope.thermal_bridges) {
      const p = ptsagrupados.find((e) => isequal(pt, e));
      if (p) {
        p.A = p.L + pt.L;
        p.name = p.name + ", " + pt.name;
        p.id = uuidv4();
      } else {
        ptsagrupados.push(pt);
      }
    }
    this.envelope.thermal_bridges.replace(ptsagrupados);
  }

  // Importación y exportación de datos -------------

  // Serialización de los datos
  get asJSON() {
    const {
      climate,
      envelope: { windows, walls, thermal_bridges },
      spaces,
    } = this;

    // Eliminamos ids
    windows.forEach((e) => delete e.id);
    walls.forEach((e) => delete e.id);
    thermal_bridges.forEach((e) => delete e.id);
    spaces.forEach((e) => delete e.id);

    return JSON.stringify(
      { climate, envelope: { windows, walls, thermal_bridges }, spaces },
      null,
      2
    );
  }

  // Deserialización de datos desde JSON
  loadJSON(data) {
    // Lee datos
    try {
      const { climate = "D3", envelope, spaces } = JSON.parse(data);
      const { windows, walls, thermal_bridges } = envelope;
      if (
        !(
          envelope &&
          Array.isArray(windows) &&
          Array.isArray(walls) &&
          Array.isArray(thermal_bridges) &&
          Array.isArray(spaces)
        )
      ) {
        throw UserException("Formato incorrecto");
      }

      // Añade id's
      windows.forEach((e) => {
        e.id = uuidv4();
      });
      walls.forEach((e) => {
        e.id = uuidv4();
      });
      thermal_bridges.forEach((e) => {
        e.id = uuidv4();
      });
      spaces.forEach((e) => {
        e.id = uuidv4();
      });

      // Almacena en store datos
      this.climate = climate;
      this.envelope = { envelope: { windows, walls, thermal_bridges } };
      this.spaces = spaces;
      this.errors = [
        { type: "SUCCESS", msg: "Datos cargados correctamente." },
        {
          type: "INFO",
          msg: `Cargados ${windows.length} huecos, ${walls.length} opacos, ${thermal_bridges.length} PTs, ${spaces.length} espacios, clima ${climate}`,
        },
      ];
    } catch (err) {
      this.errors = [
        {
          type: "DANGER",
          msg: "El archivo no contiene datos con un formato adecuado.",
        },
      ];
    }
  }
}

decorate(AppState, {
  // Decorators
  // title: observable can be omitted, its is the default when using observable.object
  climate: observable,
  Co100: observable,
  envelope: observable,
  spaces: observable,
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
  Qsoljul: computed({ requiresReaction: true }),
  qsj: computed({ requiresReaction: true }),
  agrupaHuecos: action,
  agrupaOpacos: action,
  agrupaPts: action,
  asJSON: computed,
  loadJSON: action,
});
