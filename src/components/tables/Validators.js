/* -*- coding: utf-8 -*-

Copyright (c) 2016-2022 Rafael Villar Burke <pachi@rvburke.com>

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

// Validadores ---------------------------------------------------------------
// https://www.ag-grid.com/javascript-data-grid/value-setters/#value-setter
// Ver validación más compleja en https://blog.ag-grid.com/user-input-validation-with-ag-grid/

// Comprueba que el valor es un número y no es negativo
export const validateNonNegNumber = ({ newValue, data, colDef }) => {
  if (newValue == null || newValue == "" || isNaN(newValue) || newValue < 0.0) {
    // Debe introducir un valor numérico mayor o igual que cero
    return false;
  } else {
    data[colDef.field] = newValue;
    return true;
  }
};

// Comprueba que el valor es un número
export const validateNumber = ({ newValue, data, colDef }) => {
  if (newValue == null || newValue == "" || isNaN(newValue)) {
    // Debe introducir un valor numérico
    return false;
  } else {
    data[colDef.field] = newValue;
    return true;
  }
};

// Comprueba que el valor es un número entero
export const validateIntegerNumber = ({ newValue, data, colDef }) => {
  if (
    newValue == null ||
    newValue == "" ||
    isNaN(newValue) ||
    Number(newValue) % 1 !== 0
  ) {
    // Debe introducir un número entero
    return false;
  } else {
    data[colDef.field] = newValue;
    return true;
  }
};
