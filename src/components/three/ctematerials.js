import { DoubleSide, LineBasicMaterial, MeshLambertMaterial } from "three";

// Material de bordes
export const material_lines = new LineBasicMaterial({
  name: "lines",
  color: 0x444444,
  linewidth: 1,
});
// Material doble cara - azul
export const material_select = new MeshLambertMaterial({
  name: "select",
  color: 0xff4444,
  side: DoubleSide,
});
// Sombras - violeta claro
export const material_shades = new MeshLambertMaterial({
  name: "shades",
  color: 0xa496ad,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Ventanas azul claro
export const material_windows = new MeshLambertMaterial({
  name: "windows",
  color: 0xade1ec,
  side: DoubleSide,
  transparent: true,
  opacity: 0.5,
});
// Elementos adiabáticos gris
export const material_adiabatic = new MeshLambertMaterial({
  name: "adiabatic",
  color: 0x777777,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Paredes ocre
export const material_walls = new MeshLambertMaterial({
  name: "walls",
  color: 0xeecf74,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Paredes terreno ocre oscuro
export const material_walls_ground = new MeshLambertMaterial({
  name: "walls_ground",
  color: 0xac8554,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Techos rojizo
export const material_roofs = new MeshLambertMaterial({
  name: "roofs",
  color: 0x7e3e3f,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Techos terreno rojizo oscuro
export const material_roofs_ground = new MeshLambertMaterial({
  name: "roofs_ground",
  color: 0x4f2d2d,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Suelos rosado claro
export const material_floors = new MeshLambertMaterial({
  name: "floors",
  color: 0xa97ac7,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Suelos terreno morado oscuro
export const material_floors_ground = new MeshLambertMaterial({
  name: "floors_ground",
  color: 0x673669,
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});

// Elige material en función del tipo de objeto
//
// Ahora mismo el material depende del tipo de elemento (Muro, cubierta, suelo, Window) y sus condiciones de contorno (ADIABATIC vs GROUND)
//
// TODO: Admitir más modos de representación:
// - matizar la selección actual para elementos con condiciones de contorno INTERIOR
// - en función de si el elemento pertenece o no a la envolvente térmica
// - en función de la U del elemento
export function chooseMaterial(obj) {
  const { type, bounds, subtype } = obj.userData;
  let material;
  if (type === "Wall") {
    if (bounds === "ADIABATIC") {
      material = material_adiabatic;
    } else if (subtype === "FLOOR") {
      if (bounds === "GROUND") {
        material = material_floors_ground;
      } else {
        material = material_floors;
      }
    } else if (subtype === "ROOF") {
      if (bounds === "GROUND") {
        material = material_roofs_ground;
      } else {
        material = material_roofs;
      }
    } else {
      if (bounds === "GROUND") {
        material = material_walls_ground;
      } else {
        material = material_walls;
      }
    }
  } else if (type === "Window") {
    material = material_windows;
  } else {
    console.log(
      `Elemento ${obj.name} (${obj.userData.type}), asignando material de selección por defecto`
    );
    material = material_select;
  }
  return material;
}
