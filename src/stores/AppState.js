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

import { observable } from 'mobx';
import radiationdata from '../zcraddata.json';
import { uuidv4 } from '../utils.js';

export const RadState = observable({
  radiationdata,
  climate: 'D3',
  zoneslist: [...new Set(radiationdata.map(v => v.zc))],
  orientations: [...new Set(radiationdata.map(v => v.surfname))],
  get climatedata() {
    return radiationdata.filter(v => v.zc === this.climate);
  },
  get climateTotRadJul() {
    return this.climatedata.reduce((acc, v) => ({ ...acc, [v.surfname]: v.tot[6] }), {});
  }
});

export const AppState = observable({
  Autil: 1674,
  envolvente: {
    huecos: [
      {
        id: uuidv4(), nombre: 'Huecos norte', orientacion: 'N',
        A: 42.38, U: 2.613, Ff: 0.25, gglshwi: 0.67, Fshobst: 1.00
      },
      {
        id: uuidv4(), nombre: 'Huecos este', orientacion: 'E',
        A: 17.11, U: 2.613, Ff: 0.25, gglshwi: 0.67, Fshobst: 0.82
      },
      {
        id: uuidv4(), nombre: 'Huecos sur', orientacion: 'S',
        A: 46.83, U: 2.613, Ff: 0.25, gglshwi: 0.67, Fshobst: 0.67
      },
      {
        id: uuidv4(), nombre: 'Huecos oeste', orientacion: 'W',
        A: 17.64, U: 2.613, Ff: 0.25, gglshwi: 0.67, Fshobst: 0.82
      }
    ],
    opacos: [
      { id: uuidv4(), A: 418.00, U: 0.211, btrx: 1.0, nombre: 'Cubierta' },
      { id: uuidv4(), A: 534.41, U: 0.271, btrx: 1.0, nombre: 'Fachada' },
      { id: uuidv4(), A: 418.00, U: 0.246, btrx: 1.0, nombre: 'Solera' }
    ],
    pts: [
      { id: uuidv4(), L: 487.9, psi: 0.10, nombre: 'PT forjado-fachada' },
      { id: uuidv4(), L: 181.7, psi: 0.28, nombre: 'PT solera-fachada' },
      { id: uuidv4(), L: 124.5, psi: 0.24, nombre: 'PT cubierta-fachada' },
      { id: uuidv4(), L: 468.8, psi: 0.05, nombre: 'PT contorno huecos' }
    ]
  },

  errors: [],

  // Propiedades calculadas
  get huecosA() { return this.envolvente.huecos.map(h => Number(h.A)).reduce((a, b) => a + b, 0); },
  get huecosAU() { return this.envolvente.huecos.map(h => Number(h.A) * Number(h.U)).reduce((a, b) => a + b, 0); },
  get opacosA() { return this.envolvente.opacos.map(o => Number(o.btrx) * Number(o.A)).reduce((a, b) => a + b, 0); },
  get opacosAU() { return this.envolvente.opacos.map(o => Number(o.btrx) * Number(o.A) * Number(o.U)).reduce((a, b) => a + b, 0); },
  get ptsL() { return this.envolvente.pts.map(h => Number(h.L)).reduce((a, b) => a + b, 0); },
  get ptsPsiL() { return this.envolvente.pts.map(h => Number(h.L) * Number(h.psi)).reduce((a, b) => a + b, 0); },
  get totalA() { return this.huecosA + this.opacosA; },
  get totalAU() { return this.huecosAU + this.opacosAU; },
  get K() { return (this.totalAU + this.ptsPsiL) / this.totalA; },

  // Devolvemos funciones con el this apropiado para hacer autorreferencia
  get Qsoljul() {
    return climateTotRadJul => this.envolvente.huecos
      .map(h =>
        Number(h.Fshobst) * Number(h.gglshwi)
        * (1 - Number(h.Ff)) * Number(h.A) * climateTotRadJul[h.orientacion])
      .reduce((a, b) => a + b, 0);
  },
  get qsj() { return climateTotRadJul => this.Qsoljul(climateTotRadJul) / this.Autil; }
});
