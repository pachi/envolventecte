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

const fs = require("fs");
const path = require("path");
const { soljs, met } = require("soljs");

// Orientaciones para las que se realizan los cálculos
const ORIENTACIONES = [
  // Area, slope, azimuth, name
  { beta: 0, gamma: 0, name: "Horiz." },
  { beta: 90, gamma: -135, name: "NE" },
  { beta: 90, gamma: -90, name: "E" },
  { beta: 90, gamma: -45, name: "SE" },
  { beta: 90, gamma: 0, name: "S" },
  { beta: 90, gamma: 45, name: "SW" },
  { beta: 90, gamma: 90, name: "W" },
  { beta: 90, gamma: 135, name: "NW" },
  { beta: 90, gamma: 180, name: "N" }
];

// Meses de cálculo
const MESES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// Zonas climáticas para las que se realizan los cálculos
const CLIMATEZONES = met.CLIMATEZONES;

function findClimasDir(args) {
  let climasdirarg = args.slice(2).find(v => v.startsWith("climasdir="));
  if (climasdirarg) {
    climasdirarg = path.resolve(__dirname, climasdirarg.split("climasdir=")[1]);
    const stats = fs.statSync(climasdirarg);
    if (!stats.isDirectory()) {
      console.log(`No se encuentra el directorio ${climasdirarg}.`);
      process.exit();
    }
  } else {
    process.exit();
  }
  return climasdirarg;
}

// Calcula radiación horaria directa y difusa en una superficie orientada y con albedo
//
// latitude: latitud de la localización
// hourlydata: datos climáticos horarios (.data de climadata)
// surf: descripción de la superficie orientada (nombre, inclinación, azimuth)
//       { name: 'NW', beta: [0, 180], gamma: [-180, 180] }
// albedo: reflectancia del entorno [0.0, 1.0]
function radiationForSurface(latitude, surf, albedo, hourlydata) {
  return hourlydata.map(d => {
    // Calcula altura solar = 90 - cenit y
    // corregir problema numérico con altitud solar = 0
    const salt = 90 - d.cenit;
    const rdir = soljs.gsolbeam(d.rdirhor, salt);
    const dir = soljs.idirtot(
      d.mes,
      d.dia,
      d.hora,
      rdir,
      d.rdifhor,
      salt,
      latitude,
      surf.beta,
      surf.gamma
    );
    const dif = soljs.idiftot(
      d.mes,
      d.dia,
      d.hora,
      rdir,
      d.rdifhor,
      salt,
      latitude,
      surf.beta,
      surf.gamma,
      albedo
    );
    return { mes: d.mes, dia: d.dia, hora: d.hora, dir, dif, tot: dir + dif };
  });
}

// Calcula valores mensuales de radiación para el clima y la superficie dados
//
// metdata: datos climáticos, incluyendo metadatos y datos horarios ({ meta, data })
// surf: descripción de la superficie orientada (nombre, inclinación, azimuth)
//       { name: 'NW', beta: [0, 180], gamma: [-180, 180] }
function monthlyRadiationForSurface(metdata, surf) {
  const albedo = 0.2;
  const surfHourlyRadiation = radiationForSurface(
    metdata.meta.latitud,
    surf,
    albedo,
    metdata.data
  );

  const mesesdata = MESES.map(imes => {
    const monthRadiation = surfHourlyRadiation.filter(d => d.mes === imes);
    // 1) Irradiación solar mensual acumulada (directa, difusa y total) [kWh/m2·mes]
    const dir = monthRadiation.map(v => v.dir).reduce((a, b) => a + b) / 1000;
    const dif = monthRadiation.map(v => v.dif).reduce((a, b) => a + b) / 1000;
    const tot = dir + dif;
    // 2) Factores mensuales de reducción del sombreamiento móvil f_sh_with [fracción]
    // Fracción de tiempo del mes con sombra activada (sum(I | I > I_lim) / sum(I)) con I = I_dir + I_dif
    // - I > 200 W/m2 (control automático)
    // - I > 300 W/m2 (control manual)
    // - I > 500 W/m2 (temporada de calefacción)
    const totover200 = monthRadiation.reduce(
      (acc, v) => (v.dir + v.dif > 200 ? acc + (v.dir + v.dif) : acc),
      0
    );
    const totover300 = monthRadiation.reduce(
      (acc, v) => (v.dir + v.dif > 300 ? acc + (v.dir + v.dif) : acc),
      0
    );
    const totover500 = monthRadiation.reduce(
      (acc, v) => (v.dir + v.dif > 500 ? acc + (v.dir + v.dif) : acc),
      0
    );
    // NOTA: Multiplicamos tot por 1000 para convertir kwh a W
    const f_shwith200 = tot > 0 ? totover200 / (tot * 1000) : 0;
    const f_shwith300 = tot > 0 ? totover300 / (tot * 1000) : 0;
    const f_shwith500 = tot > 0 ? totover500 / (tot * 1000) : 0;
    // dir, dif, tot, en kWh/m2/mes
    return { dir, dif, tot, f_shwith200, f_shwith300, f_shwith500 };
  });

  return {
    zc: metdata.meta.zc,
    surfname: surf.name,
    surfbeta: surf.beta,
    surfgamma: surf.gamma,
    dir: mesesdata.map(m => m.dir),
    dif: mesesdata.map(m => m.dif),
    tot: mesesdata.map(m => m.tot),
    f_shwith200: mesesdata.map(m => m.f_shwith200),
    f_shwith300: mesesdata.map(m => m.f_shwith300),
    f_shwith500: mesesdata.map(m => m.f_shwith500)
  };
}

const CLIMASDIR = findClimasDir(process.argv);

// Lista de valores de radiación para la zona y orientaciones dadas
function computeZoneDataList(zona, orientaciones) {
  const datalines = fs.readFileSync(`${CLIMASDIR}/zona${zona}.met`, "utf-8");
  const metdata = met.parsemet(datalines);
  return orientaciones.map(surf => monthlyRadiationForSurface(metdata, surf));
}

const datalist = CLIMATEZONES.map(zona =>
  computeZoneDataList(zona, ORIENTACIONES)
).reduce((x, y) => x.concat(y), []);

const jsonstring = JSON.stringify(
  datalist,
  (key, val) => (val.toFixed ? Number(val.toFixed(2)) : val),
  " "
);

fs.writeFile("zcraddata.json", jsonstring, err => {
  if (err) throw err;
  console.log("Se han guardado los resultados en el archivo zcraddata.json");
});
