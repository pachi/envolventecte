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

import { extendObservable } from 'mobx';
import radiationdata from '../zcraddata.json';

export default class AppState {
  constructor() {
    extendObservable(
      this,
      {
        radiationdata,
        climate: 'D3',
        zoneslist: [...new Set(radiationdata.map(v => v.zc))],
        orientations: [...new Set(radiationdata.map(v => v.surfname))],
        get climatedata() {
          return radiationdata.filter(v => v.zc === this.climate);
        },
        get climateTotRad() {
          return this.climatedata
            .reduce((obj, d) => {
              obj[d.surfname] = d.tot[6];
              return obj
            }, {});
        },
        Autil: 1674,
        envolvente: {
          huecos: [
            { nombre: 'Huecos norte', orientacion: 'N',
              A: 42.38, U: 2.613, Ff: 0.2, ggl: 0.67, Fshobst: 1.00, Fshgl: 0.3 },
            { nombre: 'Huecos este', orientacion: 'E',
              A: 17.11, U: 2.613, Ff: 0.2, ggl: 0.67, Fshobst: 0.82, Fshgl: 0.3 },
            { nombre: 'Huecos sur', orientacion: 'S',
              A: 46.83, U: 2.613, Ff: 0.2, ggl: 0.67, Fshobst: 0.67, Fshgl: 0.3 },
            { nombre: 'Huecos oeste', orientacion: 'W',
              A: 17.64, U: 2.613, Ff: 0.2, ggl: 0.67, Fshobst: 0.82, Fshgl: 0.3 }
          ],
          opacos: [
            { A: 418.00, U: 0.211, nombre: 'Cubierta' },
            { A: 534.41, U: 0.271, nombre: 'Fachada' },
            { A: 418.00, U: 0.246, nombre: 'Solera' }
          ],
          pts: [
            { L: 487.9, psi: 0.10, nombre: 'PT forjado-fachada' },
            { L: 181.7, psi: 0.28, nombre: 'PT solera-fachada' },
            { L: 124.5, psi: 0.24, nombre: 'PT cubierta-fachada' },
            { L: 468.8, psi: 0.05, nombre: 'PT contorno huecos' }
          ]
        }
      }
    );
  }
}
