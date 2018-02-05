/* -*- coding: utf-8 -*-

Copyright (c) 2018 Rafael Villar Burke <pachi@rvburke.com>

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

/* *** Biblioteca de propiedades de los elementos de la envolvente térmica *** */

// Propiedades de los vidrios

// Propiedades tomadas de UNE EN 13363-Apéndice A
// con añadidos calculados según https://www.onyxsolar.com/es/termica

export const ELEMENTOS = {
  huecos: {
    acristalamientos: {
      tipos: [
        // EN 13363-1 Anexo A - tabla A.1
        { name: "Vidrio sencillo", g_gl_n: 0.85, U_gl: 5.7 },
        { name: "Vidrio doble", g_gl_n: 0.75, U_gl: 3.0 },
        { name: "Vidrio doble bajoemisivo", g_gl_n: 0.67, U_gl: 1.6 },
        { name: "Triple vidrio", g_gl_n: 0.7, U_gl: 2.0 },
        {
          name: "Triple vidrio con dos capas de bajoemisivo",
          g_gl_n: 0.5,
          U_gl: 1.25
        },
        { name: "Doble ventana (vidrio sencillo)", g_gl_n: 0.75, U_gl: 3.2 }
      ],
      propiedades: {
        F_w: 0.9
      }
    },
    sombreamientos: {
      tipos: [
        { name: "Ninguno", type: "NONE" },
        { name: "Exterior", type: "EXT" },
        { name: "Integrado", type: "MED" },
        { name: "Interior", type: "INT" }
      ],
      propiedades: {
        transmitancia: [
          // EN 13363-1 Anexo A - tabla A.2
          { opacidad: "Opaco", tau_e_B: 0.0 },
          { opacidad: "Medianamente translúcido", tau_e_B: 0.2 },
          { opacidad: "Muy translúcido", tau_e_B: 0.4 }
        ],
        reflexion: [
          // EN 13363-1 Anexo A - tabla A.2
          { color: "blanco", opacidad: "Opaco", tau_e_B: 0.0, rho_e_B: 0.7 },
          { color: "blanco", opacidad: "Medianamente translúcido", tau_e_B: 0.2, rho_e_B: 0.6 },
          { color: "blanco", opacidad: "Muy translúcido", tau_e_B: 0.4, rho_e_B: 0.4 },
          { color: "pastel", opacidad: "Opaco", tau_e_B: 0.0, rho_e_B: 0.5 },
          { color: "pastel", opacidad: "Medianamente translúcido", tau_e_B: 0.2, rho_e_B: 0.4 },
          { color: "pastel", opacidad: "Muy translúcido", tau_e_B: 0.4, rho_e_B: 0.3 },
          { color: "oscuro", opacidad: "Opaco", tau_e_B: 0.0, rho_e_B: 0.3 },
          { color: "oscuro", opacidad: "Medianamente translúcido", tau_e_B: 0.2, rho_e_B: 0.2 },
          { color: "oscuro", opacidad: "Muy translúcido", tau_e_B: 0.4, rho_e_B: 0.2 },
          { color: "negro", opacidad: "Opaco", tau_e_B: 0.0, rho_e_B: 0.1 },
          { color: "negro", opacidad: "Medianamente translúcido", tau_e_B: 0.2, rho_e_B: 0.1 },
          { color: "negro", opacidad: "Muy translúcido", tau_e_B: 0.4, rho_e_B: 0.1 }
        ]
      }
    }
  }
};

// Factor de transmitancia de energía solar total - g_t
// con protección solar exterior - g_t_e
// con protección solar integrada - g_t_m
// con protección solar interior - g_t_i
// Parámetros:
// - U_gl: coeficiente de transmitancia de la energía solar total del acristalamiento [W/m2K]
// - g_gl_n: factor de transmitancia de energía solar a incidencia normal del acristalamiento [-]
// - tau_e_B: factor de transmitancia solar del dispositivo de protección solar [-]
// - rho_e_B: factor de reflexión solar de la cara del dispositivo de protección solar del lado de la radiación [-]

// Factor de transmitancia de energía solar total con protección solar exterior
export function g_t_e(U_gl, g_gl_n, tau_e_B, rho_e_B) {
  const alpha_e_B = 1 - tau_e_B - rho_e_B;
  const G = 1 / (1 / U_gl + 1 / 5 + 1 / 10); // W/m2K
  return tau_e_B * g_gl_n + alpha_e_B * G / 10 + tau_e_B * (1 - g_gl_n) * G / 5;
}

// Factor de transmitancia de energía solar total con protección solar interior
export function g_t_i(U_gl, g_gl_n, tau_e_B, rho_e_B) {
  const alpha_e_B = 1 - tau_e_B - rho_e_B;
  const G = 1 / (1 / U_gl + 1 / 30); // W/m2K
  return g_gl_n * (1 - g_gl_n * rho_e_B - alpha_e_B * G / 30);
}

// Factor de transmitancia de energía solar total con protección solar integrado
// Válido cuando:
// - El acristalamiento exterior no está recubierto
// - El acristalamiento interior está o no recubierto
export function g_t_m(U_gl, g_gl_n, tau_e_B, rho_e_B) {
  const alpha_e_B = 1 - tau_e_B - rho_e_B;
  const G = 1 / (1 / U_gl + 1 / 3); // W/m2K
  return tau_e_B * g_gl_n + g_gl_n * (alpha_e_B + (1 - g_gl_n) * rho_e_B) * G / 3;
}
