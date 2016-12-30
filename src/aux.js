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

import { soljs, met } from 'soljs';

export const ZONESLIST = met.CLIMATEZONES;

// Orientaciones
export const ORIENTACIONES = [
  // Area, slope, azimuth, name
  { beta: 0, gamma: 0, name: 'Horiz.' },
  { beta: 90, gamma: -135, name: 'NE' },
  { beta: 90, gamma: -90, name: 'E' },
  { beta: 90, gamma: -45, name: 'SE' },
  { beta: 90, gamma: 0, name: 'S' },
  { beta: 90, gamma: 45, name: 'SW' },
  { beta: 90, gamma: 90, name: 'W' },
  { beta: 90, gamma: 135, name: 'NW' },
  { beta: 90, gamma: 180, name: 'N' },
  { beta: 0, gamma: 0, name: 'USUARIO' }
];

export const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


// Calcula radiación directa y difusa en una superficie orientada y con albedo
//
// latitude: latitud de la localización
// hourlydata: datos climáticos horarios (.data de climadata)
// surf: descripción de la superficie orientada (inclinación, azimuth)
//       { beta: [0, 180], gamma: [-180, 180] }
// albedo: reflectancia del entorno [0.0, 1.0]
export function radiationForSurface(latitude, surf, albedo, hourlydata) {
  return hourlydata.map(
    d => {
      // Calcula altura solar = 90 - cenit y
      // corregir problema numérico con altitud solar = 0
      const salt = (d.cenit !== 90) ? 90 - d.cenit : 90 - 89.95;
      const rdir = soljs.gsolbeam(d.rdirhor, salt);
      const dir = soljs.idirtot(d.mes, d.dia, d.hora, rdir, d.rdifhor, salt,
                                latitude, surf.beta, surf.gamma);
      const dif = soljs.idiftot(d.mes, d.dia, d.hora, rdir, d.rdifhor, salt,
                                latitude, surf.beta, surf.gamma, albedo);
      return { mes: d.mes, dia: d.dia, hora: d.hora, dir, dif, tot: dir + dif };
    });
}

// Acumulados mensuales para el clima y la superficie dados
export function monthlyRadiationForSurface(metdata, surf) {
  const albedo = 0.2;
  const latitud = metdata.meta.latitud;
  const data = metdata.data;
  const surfRadiation = radiationForSurface(latitud, surf, albedo, data);
  return MESES.map(imes => {
    let monthRadiation = surfRadiation.filter(d => d.mes === imes);
    // dir, dif, en kWh/m2/mes
    return { imes,
             surf,
             dir: monthRadiation.map(v => v.dir).reduce((a, b) => a + b) / 1000,
             dif: monthRadiation.map(v => v.dif).reduce((a, b) => a + b) / 1000 };
  });
}
