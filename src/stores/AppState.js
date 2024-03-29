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

import { createContext } from "react";
import { action, observable, computed, makeObservable, configure } from "mobx";

import {
  energy_indicators,
  get_monthly_radiation_data,
  load_data_from_json,
  load_data_from_ctehexml,
  load_fshobst_data_from_kyg,
  purge_unused,
} from "wasm-envolventecte";

import {
  newShade,
  newSpace,
  newTb,
  newWall,
  newWallcons,
  newWindow,
  newWincons,
  newMaterial,
  newFrame,
  newGlass,
  defaultsSpace,
  defaultsWall,
  defaultsWindow,
  defaultsShade,
  defaultsWallcons,
  defaultsWincons,
  defaultsMaterial,
  defaultsGlass,
  defaultsFrame,
  newMeta,
  defaultsTb,
  newThermostat,
  newLoad,
  defaultsLoad,
  defaultsSysSetting,
  newScheduleDay,
  newScheduleYear,
  newScheduleWeek,
} from "./defaults";

// import radiationdata from "../zcraddata.json";
import example from "./example.json";
import { uuidv4 } from "../utils";
import * as types from "./types";

// DEBUG:
/* lint import/no-webpack-loader-syntax: off */
// import test_ctehexml from '!raw-loader!../test/casopracticof21_ventanas_cubierta_raras_rot45.ctehexml';
// import test_ctehexml from '!raw-loader!../test/casopracticof21_ventanas_cubierta_raras.ctehexml';
// import test_ctehexml from '!raw-loader!../test/prueba_cub_rotada.ctehexml';
// import test_ctehexml from '!raw-loader!../test/ventanas_cubierta.ctehexml';
// import test_ctehexml from '!raw-loader!../test/ventanas_cubierta_reducido.ctehexml';

// no obligamos a usar acciones para cambiar el estado. El default es "always".
// Ver https://mobx.js.org/configuration.html#enforceactions
configure({
  enforceActions: "never",
});

// Valores de radiación
const MONTHLYRADIATIONDATA = get_monthly_radiation_data();
export const EMPTY_ID = "00000000-0000-0000-0000-000000000000";

class AppState {
  // Datos climáticos --------

  // Zona climática y otros metadatos
  meta = newMeta();

  // Datos geométricos y constructivos -----------
  // Espacios de la envolvente térmica
  spaces = [];
  // Opacos
  walls = [];
  // Huecos
  windows = [];
  // Sombras
  shades = [];
  // Puentes térmicos
  thermal_bridges = [];
  // Construcciones de opacos y huecos
  cons = { wallcons: [], wincons: [], materials: [], glasses: [], frames: [] };

  // Datos de uso
  // Horarios
  schedules = { year: [], week: [], day: [] };
  // Cargas
  loads = [];
  // Consignas
  thermostats = [];

  // Lista de errores y avisos -------
  // Contiene objetos  { level: warninglevel, id: "element_id", msg: "my msg" }
  // donde warninglevel puede ser: SUCCESS | DANGER | WARNING | INFO (y corresponden a clases Bootstrap en minúsculas)
  errors = [];

  constructor() {
    makeObservable(this, {
      // Decorators
      // title: observable can be omitted, its is the default when using observable.object
      meta: observable,
      spaces: observable,
      walls: observable,
      windows: observable,
      shades: observable,
      thermal_bridges: observable,
      cons: observable,
      schedules: observable,
      loads: observable,
      thermostats: observable,
      errors: observable,

      // Valores calculados (resultan de modificaciones del estado)
      energy_indicators: computed({ requiresReaction: true }),
      zoneslist: computed,
      orientations: computed,
      warnings: computed,
      // TODO: estos dos se podrían llegar a eliminar si cambiamos climas y usamos los del wasm
      climatedata: computed({ requiresReaction: true }),
      climateTotRadJul: computed({ requiresReaction: true }),

      // Acciones (modifican el estado)
      addElement: action,
      duplicateElements: action,
      deleteElements: action,
      handleUpload: action,
      loadModel: action,
      clearModel: action,
      purgeModel: action,
      asJSON: computed,
      loadData: action,
    });
  }

  // Propiedades de datos climáticos ----------------
  get zoneslist() {
    return [...new Set(MONTHLYRADIATIONDATA.map((v) => v.zone))];
  }

  get orientations() {
    return [...new Set(MONTHLYRADIATIONDATA.map((v) => v.orientation))];
  }

  get climatedata() {
    return MONTHLYRADIATIONDATA.filter((v) => v.zone === this.meta.climate);
  }

  get climateTotRadJul() {
    return this.climatedata.reduce(
      (acc, v) => ({ ...acc, [v.orientation]: v.dir[6] + v.dif[6] }),
      {}
    );
  }

  get energy_indicators() {
    return energy_indicators(this.getModel());
  }

  // Acumula errores de la app y avisos de los cálculos
  get warnings() {
    return this.errors.concat(this.energy_indicators.warnings);
  }

  getElements(elementType) {
    switch (elementType) {
      case types.SPACE:
        return this.spaces;
      case types.WALL:
        return this.walls;
      case types.WINDOW:
        return this.windows;
      case types.THERMAL_BRIDGE:
        return this.thermal_bridges;
      case types.SHADE:
        return this.shades;
      case types.WALLCONS:
        return this.cons.wallcons;
      case types.WINCONS:
        return this.cons.wincons;
      case types.MATERIAL:
        return this.cons.materials;
      case types.GLASS:
        return this.cons.glasses;
      case types.FRAME:
        return this.cons.frames;
      case types.SCHEDULE_YEAR:
        return this.schedules.year;
      case types.SCHEDULE_WEEK:
        return this.schedules.week;
      case types.SCHEDULE_DAY:
        return this.schedules.day;
      case types.LOAD:
        return this.loads;
      case types.THERMOSTAT:
        return this.thermostats;
      default:
        return [];
    }
  }

  getIdNameMap(elementType) {
    const idNameMap = {};
    this.getElements(elementType).map((s) =>
      s.id != EMPTY_ID
        ? (idNameMap[s.id] = s.name)
        : (idNameMap[EMPTY_ID] = "-")
    );
    return idNameMap;
  }

  getElementOptions(elementType, addEmpty = false) {
    const opts = this.getElements(elementType).map(({ id, name }) => ({
      value: id,
      label: name,
    }));
    if (addEmpty) {
      opts.unshift({ value: "", label: "<Vacío>" });
    }
    return opts;
  }

  // Acciones --------

  // Añade un nuevo elemento del tipo indicado y devuelve su UUID
  addElement(elementType) {
    let el;
    switch (elementType) {
      case types.SPACE:
        el = newSpace();
        this.spaces.push(el);
        break;
      case types.WALL:
        el = newWall();
        this.walls.push(el);
        break;
      case types.WINDOW:
        el = newWindow();
        this.windows.push(el);
        break;
      case types.THERMAL_BRIDGE:
        el = newTb();
        this.thermal_bridges.push(el);
        break;
      case types.SHADE:
        el = newShade();
        this.shades.push(el);
        break;
      case types.WALLCONS:
        el = newWallcons();
        this.cons.wallcons.push(el);
        break;
      case types.WINCONS:
        el = newWincons();
        this.cons.wincons.push(el);
        break;
      case types.MATERIAL:
        el = newMaterial();
        this.cons.materials.push(el);
        break;
      case types.GLASS:
        el = newGlass();
        this.cons.glasses.push(el);
        break;
      case types.FRAME:
        el = newFrame();
        this.cons.frames.push(el);
        break;
      case types.LOAD:
        el = newLoad();
        this.loads.push(el);
        break;
      case types.THERMOSTAT:
        el = newThermostat();
        this.thermostats.push(el);
        break;
      case types.SCHEDULE_DAY:
        el = newScheduleDay();
        this.schedules.day.push(el);
        break;
      case types.SCHEDULE_WEEK:
        el = newScheduleWeek();
        this.schedules.week.push(el);
        break;
      case types.SCHEDULE_YEAR:
        el = newScheduleYear();
        this.schedules.year.push(el);
        break;
      default:
        break;
    }
    return el.id || EMPTY_ID;
  }

  // Duplica elementos seleccionados y devuelve UUIDs de los elementos generados
  duplicateElements(elementType, selection) {
    const container = this.getElements(elementType);

    const newIds = [];
    selection.forEach((id) => {
      const selectedIndex = container.findIndex((h) => h.id === id);
      if (selectedIndex !== -1) {
        const idx = selectedIndex >= 0 ? selectedIndex : 0;
        const selectedObj = container[idx];
        const newId = uuidv4();
        const dupObj = {
          ...selectedObj,
          name: selectedObj.name + " (dup.)",
          id: newId,
        };
        newIds.push(newId);
        container.splice(idx + 1, 0, dupObj);
      }
    });
    return newIds;
  }

  // Elimina los elementos seleccionados del tipo indicado y devuelve el UUID del nuevo elemento seleccionado (o null)
  deleteElements(elementType, selection) {
    const container = this.getElements(elementType);

    if (selection.length > 0) {
      const indices = container.reduce((acc, cur, idx) => {
        if (selection.includes(cur.id)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      const minidx = Math.max(0, Math.min(...indices) - 1);
      const filtered = container.filter((h) => !selection.includes(h.id));
      // usa replace: https://mobx.js.org/api.html#observablearray
      container.replace(filtered);
      // Selecciona el elemento anterior al primero seleccionado salvo que no queden elementos o sea el primero, o nada si no hay elementos
      if (filtered.length > 0) {
        return container[minidx].id;
      } else {
        return null;
      }
    }
  }

  // Mueve una posición hacia arriba el primer elemento seleccionado
  moveUpFirstSelectedElement(elementType, selection) {
    const container = this.getElements(elementType);

    if (selection.length === 0) return;
    selection = selection[0];

    const idx = container.findIndex((h) => selection.includes(h.id));
    if (idx < 1) return;
    const prev = container[idx - 1];
    const elem = container[idx];

    container.replace([
      ...container.slice(0, idx - 1),
      elem,
      prev,
      ...container.splice(idx + 1),
    ]);
  }

  // Mueve una posición hacia arriba el primer elemento seleccionado
  moveDownFirstSelectedElement(elementType, selection) {
    const container = this.getElements(elementType);

    if (selection.length === 0) return;
    selection = selection[0];

    const idx = container.findIndex((h) => selection.includes(h.id));
    if (idx > container.length - 2 || idx < 0) return;
    const elem = container[idx];
    const next = container[idx + 1];
    
    container.replace([
      ...container.slice(0, idx),
      next,
      elem,
      ...container.splice(idx + 2),
    ]);
  }

  // Recopila modelo desde el appstate
  getModel() {
    const {
      meta,
      spaces,
      walls,
      windows,
      shades,
      thermal_bridges,
      cons,
      schedules,
      loads,
      thermostats,
    } = this;
    return {
      meta,
      spaces,
      walls,
      windows,
      shades,
      thermal_bridges,
      cons,
      schedules,
      loads,
      thermostats,
    };
  }

  // Deja modelo limpio
  clearModel() {
    this.meta = newMeta();
    this.spaces = [];
    this.walls = [];
    this.windows = [];
    this.shades = [];
    this.thermal_bridges = [];
    this.cons = {
      wallcons: [],
      wincons: [],
      materials: [],
      glasses: [],
      frames: [],
    };
    this.schedules = { year: [], week: [], day: [] };
    this.loads = [];
    this.thermostats = [];
  }

  // Purga datos no usados del modelo
  purgeModel() {
    const { model: cleanModel, warnings } = purge_unused(this.getModel());
    this.loadModel(cleanModel);
    this.errors = warnings;
  }

  // Carga modelo JSON en el appstate
  loadModel(inputData) {
    const {
      meta = { climate: "D3" },
      spaces = [],
      walls = [],
      windows = [],
      shades = [],
      thermal_bridges = [],
      cons = {
        wallcons: [],
        wincons: [],
        materials: [],
        glasses: [],
        frames: [],
      },
      schedules = {
        year: [],
        week: [],
        day: [],
      },
      loads = [],
      thermostats = [],
    } = inputData;

    // Carga datos en el store
    // Asignamos valores por defecto de las propiedades que pueden ser omitidas
    this.meta = meta;
    this.thermal_bridges = thermal_bridges.map((tb) => ({
      ...defaultsTb,
      ...tb,
    }));
    this.walls = walls.map((w) => ({
      ...defaultsWall,
      ...w,
    }));
    this.windows = windows.map((w) => ({
      ...defaultsWindow,
      ...w,
    }));
    this.spaces = spaces.map((s) => ({
      ...defaultsSpace,
      ...s,
    }));
    this.shades = shades.map((w) => ({
      ...defaultsShade,
      ...w,
    }));
    this.cons = {
      wallcons: cons.wallcons.map((w) => ({
        ...defaultsWallcons,
        ...w,
      })),
      wincons: cons.wincons.map((w) => ({
        ...defaultsWincons,
        ...w,
      })),
      materials: cons.materials.map((w) => ({
        ...defaultsMaterial,
        ...w,
      })),
      glasses: cons.glasses.map((w) => ({
        ...defaultsGlass,
        ...w,
      })),
      frames: cons.frames.map((w) => ({
        ...defaultsFrame,
        ...w,
      })),
    };
    this.schedules = {
      year: schedules.year,
      week: schedules.week,
      day: schedules.day,
    };
    this.loads = loads.map((e) => ({ ...defaultsLoad, ...e }));
    this.thermostats = thermostats.map((e) => ({
      ...defaultsSysSetting,
      ...e,
    }));
  }

  // Importación y exportación de datos -------------

  // Serialización de los datos
  get asJSON() {
    const {
      meta,
      spaces,
      walls,
      windows,
      shades,
      thermal_bridges,
      cons,
      schedules,
      loads,
      thermostats,
    } = this;

    return JSON.stringify(
      {
        meta,
        spaces,
        walls,
        windows,
        shades,
        thermal_bridges,
        cons,
        schedules,
        loads,
        thermostats,
      },
      null,
      2
    );
  }

  // Carga datos desde lista de archivos subida, identificando el tipo
  handleUpload(acceptedFiles, purge = false) {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (rawData) => {
        if (
          file.name.includes("KyGananciasSolares.txt") ||
          file.path.includes("KyGananciasSolares.txt")
        ) {
          this.loadData(rawData.target.result, "FSHOBST");
        } else if (
          file.name.toLowerCase().includes(".ctehexml") ||
          file.path.toLowerCase().includes(".ctehexml")
        ) {
          this.loadData(rawData.target.result, "CTEHEXML", purge);
        } else {
          this.loadData(rawData.target.result, "JSON", purge);
        }
      };
      reader.readAsText(file);
    }
  }

  // Deserialización de datos desde
  // - JSON (mode = "JSON")
  // - CTEHEXML (mode="CTEHEXML")
  // - KyGananciasSolares.txt (mode="FSHOBST")
  loadData(data, mode, purge = false) {
    // Lee datos
    try {
      let inputData;
      let loadWarnings = [];
      if (mode === "FSHOBST") {
        inputData = load_fshobst_data_from_kyg(data);
      } else if (mode === "CTEHEXML") {
        const { model, warnings } = load_data_from_ctehexml(data, purge);
        loadWarnings = warnings;
        inputData = model;
      } else {
        const { model, warnings } = load_data_from_json(data, purge);
        loadWarnings = warnings;
        inputData = model;
      }

      if (mode === "CTEHEXML" || mode === "JSON") {
        this.loadModel(inputData);
        this.errors = [
          { level: "SUCCESS", id: null, msg: "Datos cargados correctamente." },
          ...loadWarnings,
          {
            level: "INFO",
            id: null,
            msg: [
              `Clima ${this.meta.climate}, Cargados: `,
              `${this.spaces.length} espacios, `,
              `${this.walls.length} opacos, `,
              `${this.windows.length} huecos, `,
              `${this.thermal_bridges.length} PTs, `,
              `${this.shades.length} elementos de sombra, `,
              `${this.cons.wallcons.length} construcciones de opacos, `,
              `${this.cons.wincons.length} construcciones de huecos, `,
              `${this.loads.length} definiciones de cargas y `,
              `${this.thermostats.length} definiciones de consignas`,
            ].join(""),
          },
        ];
      } else if (mode === "FSHOBST") {
        this.errors = [
          { level: "SUCCESS", id: null, msg: "Datos cargados correctamente." },
          {
            level: "INFO",
            id: null,
            msg: `Cargados ${inputData.length} factores de sombra de obstáculos remotos (F_sh;obst) de huecos`,
          },
        ];

        for (let window of this.windows) {
          let fshobst = inputData[window.name];
          if (fshobst === undefined || isNaN(fshobst)) {
            this.errors.push({
              level: "INFO:",
              id: null,
              msg: `Hueco ${window.name} sin datos de factor reductor por sombreamiento de obstáculos remotos F_sh;obst`,
            });
          } else {
            window.fshobst = fshobst;
          }
        }
      } else {
        this.errors = [
          {
            level: "INFO",
            id: null,
            msg: `No se han encontrado datos de modelo en el archivo.`,
          },
        ];
      }
    } catch (err) {
      this.errors = [
        {
          level: "DANGER",
          id: null,
          msg: `El archivo no contiene datos con un formato adecuado. ${err}`,
        },
      ];
    }
  }
}

const appstate = new AppState();

// // DEBUG: carga este caso para depurar
// appstate.loadData(test_ctehexml, "CTEHEXML");
appstate.loadModel(example);

export default createContext(appstate);
