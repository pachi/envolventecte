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
import radiationdata from "../zcraddata.json";
import { uuidv4, UserException } from "../utils.js";

const DEFAULT_ENVELOPE = {
  windows: [
    {
      id: uuidv4(),
      name: "Huecos norte",
      orientation: "N",
      A: 42.38,
      U: 2.613,
      Ff: 0.25,
      gglshwi: 0.67,
      gglwi: 0.67,
      Fshobst: 1.0,
      C_100: 27.0,
    },
    {
      id: uuidv4(),
      name: "Huecos este",
      orientation: "E",
      A: 17.11,
      U: 2.613,
      Ff: 0.25,
      gglshwi: 0.67,
      gglwi: 0.67,
      Fshobst: 0.82,
      C_100: 27.0,
    },
    {
      id: uuidv4(),
      name: "Huecos sur",
      orientation: "S",
      A: 46.83,
      U: 2.613,
      Ff: 0.25,
      gglshwi: 0.67,
      gglwi: 0.67,
      Fshobst: 0.67,
      C_100: 27.0,
    },
    {
      id: uuidv4(),
      name: "Huecos oeste",
      orientation: "W",
      A: 17.64,
      U: 2.613,
      Ff: 0.25,
      gglshwi: 0.67,
      gglwi: 0.67,
      Fshobst: 0.82,
      C_100: 27.0,
    },
  ],
  walls: [
    { id: uuidv4(), A: 418.0, U: 0.211, btrx: 1.0, name: "Cubierta" },
    { id: uuidv4(), A: 534.41, U: 0.271, btrx: 1.0, name: "Fachada" },
    { id: uuidv4(), A: 418.0, U: 0.246, btrx: 1.0, name: "Solera" },
  ],
  thermal_bridges: [
    { id: uuidv4(), L: 487.9, psi: 0.1, name: "PT forjado-fachada" },
    { id: uuidv4(), L: 181.7, psi: 0.28, name: "PT solera-fachada" },
    { id: uuidv4(), L: 124.5, psi: 0.24, name: "PT cubierta-fachada" },
    { id: uuidv4(), L: 468.8, psi: 0.05, name: "PT contorno huecos" },
  ],
};

const DEFAULT_WINDOW = () => ({
  id: uuidv4(),
  name: "Hueco nuevo",
  orientation: "N",
  A: 1.0,
  U: 1.0,
  Ff: 0.2,
  gglshwi: 0.67,
  gglwi: 0.67,
  Fshobst: 1.0,
  C_100: 27.0,
});

const DEFAULT_WALL = () => ({
  id: uuidv4(),
  A: 1.0,
  U: 0.2,
  btrx: 1.0,
  name: "Elemento opaco",
});

const DEFAULT_TB = () => ({
  id: uuidv4(),
  L: 1.0,
  psi: 0.05,
  name: "PT por defecto",
});

export default class AppState {
  // Datos climáticos

  // Valores de radiación
  radiationdata = radiationdata;
  // Zona climática
  climate = "D3";

  // Datos geométricos y constructivos

  // Área útil
  Autil = 1674;
  // Volumen interno a la envolvente térmica
  V = 4519;
  // Coeficiente de caudal de aire de la parte opaca de la envolvente térmica a 100 Pa (m3/h/m2)
  Co100 = 16;
  // Elementos de la envolvente térmica
  envelope = DEFAULT_ENVELOPE;

  // Lista de errores
  errors = [];

  // Propiedades de datos climáticos
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

  // Constructores
  newHueco = DEFAULT_WINDOW;
  newOpaco = DEFAULT_WALL;
  newPT = DEFAULT_TB;

  // Propiedades de datos de envolvente
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
      .map((o) => Number(o.btrx) * Number(o.A))
      .reduce((a, b) => a + b, 0);
  }

  get opacosAU() {
    return this.envelope.walls
      .map((o) => Number(o.btrx) * Number(o.A) * Number(o.U))
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
        h.id = uuidv4();
        h.name = h.name + ", " + hueco.name;
      } else {
        huecosagrupados.push(hueco);
      }
    }
    this.envelope.windows.replace(huecosagrupados);
  }

  // Agrupa superficie de opacos por tipos
  agrupaOpacos() {
    const isequal = (o1, o2) =>
      Number(o1.U) === Number(o2.U) && Number(o1.btrx) === Number(o2.btrx);
    const opacosagrupados = [];
    for (let opaco of this.envelope.walls) {
      const o = opacosagrupados.find((e) => isequal(opaco, e));
      if (o) {
        o.A = o.A + opaco.A;
        o.id = uuidv4();
        o.name = o.name + ", " + opaco.name;
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
        p.id = uuidv4();
        p.name = p.name + ", " + pt.name;
      } else {
        ptsagrupados.push(pt);
      }
    }
    this.envelope.thermal_bridges.replace(ptsagrupados);
  }

  // Serialización y deserialización
  get asJSON() {
    const { Autil, envelope, climate } = this;
    return JSON.stringify({ Autil, climate, envelope }, null, 2);
  }

  loadJSON(data) {
    try {
      const { Autil, climate = "D3", envelope } = JSON.parse(data);
      const { windows, walls, thermal_bridges } = envelope;
      if (
        !(
          Autil &&
          envelope &&
          Array.isArray(windows) &&
          Array.isArray(walls) &&
          Array.isArray(thermal_bridges)
        )
      ) {
        throw UserException("Formato incorrecto");
      }
      this.climate = climate;
      this.Autil = Number(Autil);
      this.envelope = envelope;
      this.errors = [
        { type: "SUCCESS", msg: "Datos cargados correctamente." },
        {
          type: "INFO",
          msg:
            `Autil: ${Autil} m², Elementos: ` +
            `${windows.length} huecos, ${walls.length} opacos, ${
              thermal_bridges.length
            } PTs.`,
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
  Autil: observable,
  V: observable,
  Co100: observable,
  envelope: observable,
  errors: observable,
  // Valores calculados
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
