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

/* *** Precalcula datos de radiación por zonas y orientación kwh/m2/mes

Genera el archivo de radiación zcraddata.json al ejecutar:

   $ node computezcdata.js climasdir=../../climascte

 ****/

const fs = require('fs');
const path = require('path');
const { soljs, met } = require('soljs');

// Orientaciones para las que se realizan los cálculos
const ORIENTACIONES = [
  // Area, slope, azimuth, name
  { beta: 0, gamma: 0, name: 'Horiz.' },
  { beta: 90, gamma: -135, name: 'NE' },
  { beta: 90, gamma: -90, name: 'E' },
  { beta: 90, gamma: -45, name: 'SE' },
  { beta: 90, gamma: 0, name: 'S' },
  { beta: 90, gamma: 45, name: 'SW' },
  { beta: 90, gamma: 90, name: 'W' },
  { beta: 90, gamma: 135, name: 'NW' },
  { beta: 90, gamma: 180, name: 'N' }
];

// Meses de cálculo
const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


const args = process.argv.slice(2);
let CLIMASDIR = args.find(v => v.startsWith('climasdir='));
if (CLIMASDIR) {
  CLIMASDIR = path.resolve(__dirname, CLIMASDIR.split('climasdir=')[1]);
  const stats = fs.statSync(CLIMASDIR);
  if (!stats.isDirectory()) {
    console.log(`No se encuentra el directorio ${ CLIMASDIR }.`);
    process.exit();
  }
} else {
  process.exit();
}


// Calcula radiación directa y difusa en una superficie orientada y con albedo
//
// latitude: latitud de la localización
// hourlydata: datos climáticos horarios (.data de climadata)
// surf: descripción de la superficie orientada (inclinación, azimuth)
//       { beta: [0, 180], gamma: [-180, 180] }
// albedo: reflectancia del entorno [0.0, 1.0]
function radiationForSurface(latitude, surf, albedo, hourlydata) {
  return hourlydata.map(
    d => {
      // Calcula altura solar = 90 - cenit y
      // corregir problema numérico con altitud solar = 0
      const salt = 90 - d.cenit;
      const rdir = soljs.gsolbeam(d.rdirhor, salt);
      const dir = soljs.idirtot(d.mes, d.dia, d.hora, rdir, d.rdifhor, salt,
                                latitude, surf.beta, surf.gamma);
      const dif = soljs.idiftot(d.mes, d.dia, d.hora, rdir, d.rdifhor, salt,
                                latitude, surf.beta, surf.gamma, albedo);
      return { mes: d.mes, dia: d.dia, hora: d.hora, dir, dif, tot: dir + dif };
    });
}


// Acumulados mensuales para el clima y la superficie dados
function monthlyRadiationForSurface(metdata, surf) {
  const albedo = 0.2;
  const surfRadiation = radiationForSurface(metdata.meta.latitud,
                                            surf, albedo, metdata.data);
  const mesesdata = MESES.map(imes => {
    const monthRadiation = surfRadiation.filter(d => d.mes === imes);
    const dir = monthRadiation.map(v => v.dir).reduce((a, b) => a + b) / 1000;
    const dif = monthRadiation.map(v => v.dif).reduce((a, b) => a + b) / 1000;
    const tot = dir + dif;
    // dir, dif, tot, en kWh/m2/mes
    return { dir, dif, tot };
  });

  return { zc: metdata.meta.zc,
           surfname: surf.name,
           surfbeta: surf.beta,
           surfgamma: surf.gamma,
           dir: mesesdata.map(m => m.dir),
           dif: mesesdata.map(m => m.dif),
           tot: mesesdata.map(m => m.tot)
  };
}

let datalist = [];
met.CLIMATEZONES.map(zona => {
  const metpath = `${ CLIMASDIR }/zona${ zona }.met`;
  const datalines = fs.readFileSync(metpath, 'utf-8');
  const metdata = met.parsemet(datalines);
  const zonevalues = ORIENTACIONES
    .map(surf => monthlyRadiationForSurface(metdata, surf));
  datalist = datalist.concat(zonevalues);
});

const jsonstring = JSON
  .stringify(datalist,
             (key, val) => val.toFixed ? Number(val.toFixed(2)) : val,
             ' ');

fs.writeFile('zcraddata.json', jsonstring,
  (err) => {
    if (err) throw err;
    console.log('Se han guardado los resultados en el archivo zcraddata.json');
  }
);
