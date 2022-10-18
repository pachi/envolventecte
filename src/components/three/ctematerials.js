import { DoubleSide, LineBasicMaterial, MeshLambertMaterial } from "three";

const colorMap = {
  Generic: 0x0000ff, // Genérico (líneas)
  Line: 0x444444, // Bordes (líneas)
  Selection: 0xff4444, // Selección
  Shade: 0xa496ad, // Sombras
  Window: 0xade1ec, // Ventanas
  Adiabatic: 0x777777, // Adiabático
  WallExt: 0xeecf74, // Paredes exterior
  WallInt: 0xffce9d, // Paredes interior
  WallGnd: 0xac8554, // Paredes terreno
  RoofExt: 0x953e3f, // Techos exterior
  RoofInt: 0xa54e4f, // Techos interior
  RoofGnd: 0x5f2f2d, // Techos terreno
  FloorExt: 0x893649, // Suelos exterior
  FloorInt: 0x89627f, // Suelos interior
  FloorGnd: 0x673659, // Suelos terreno
};

// Material genérico de líneas
export const material_generic_lines = new LineBasicMaterial({
  name: "generic_lines",
  color: colorMap["Generic"],
  linewidth: 1,
});

// Material de bordes
export const material_lines = new LineBasicMaterial({
  name: "lines",
  color: colorMap["Line"],
  linewidth: 1,
});
// Material selección
export const material_select = new MeshLambertMaterial({
  name: "select",
  color: colorMap["Selection"],
  side: DoubleSide,
});
// Sombras - violeta claro
export const material_shades = new MeshLambertMaterial({
  name: "shades",
  color: colorMap["Shade"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Ventanas azul claro
export const material_windows = new MeshLambertMaterial({
  name: "windows",
  color: colorMap["Window"],
  side: DoubleSide,
  transparent: true,
  opacity: 0.5,
});
// Elementos adiabáticos gris
export const material_adiabatic = new MeshLambertMaterial({
  name: "adiabatic",
  color: colorMap["Adiabatic"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Paredes ocre
export const material_walls = new MeshLambertMaterial({
  name: "walls",
  color: colorMap["WallExt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Paredes interior ocre claro
export const material_walls_interior = new MeshLambertMaterial({
  name: "walls_interior",
  color: colorMap["WallInt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Paredes terreno ocre oscuro
export const material_walls_ground = new MeshLambertMaterial({
  name: "walls_ground",
  color: colorMap["WallGnd"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Techos rojizo
export const material_roofs = new MeshLambertMaterial({
  name: "roofs",
  color: colorMap["RoofExt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Techos interior rojizo claro
export const material_roofs_interior = new MeshLambertMaterial({
  name: "roofs_interior",
  color: colorMap["RoofInt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Techos terreno rojizo oscuro
export const material_roofs_ground = new MeshLambertMaterial({
  name: "roofs_ground",
  color: colorMap["RoofGnd"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Suelos con aire exterior rosado
export const material_floors = new MeshLambertMaterial({
  name: "floors",
  color: colorMap["FloorExt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Suelos interior rosado claro
export const material_floors_interior = new MeshLambertMaterial({
  name: "floors_interior",
  color: colorMap["FloorInt"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Suelos terreno morado oscuro
export const material_floors_ground = new MeshLambertMaterial({
  name: "floors_ground",
  color: colorMap["FloorGnd"],
  side: DoubleSide,
  transparent: true,
  opacity: 1.0,
});

// Elige material en función del tipo de objeto
//
// Ahora mismo el material depende del tipo de elemento (Muro, cubierta, suelo, Window) y sus condiciones de contorno (ADIABATIC vs GROUND)
//
// TODO: Admitir más modos de representación:
// - en función de si el elemento pertenece o no a la envolvente térmica
// - en función de la U del elemento
export function getMaterial(mesh) {
  const { type, bounds, subtype } = mesh.userData;
  let material;
  if (type === "Wall") {
    if (bounds === "ADIABATIC") {
      material = material_adiabatic;
    } else if (subtype === "FLOOR") {
      if (bounds === "GROUND") {
        material = material_floors_ground;
      } else if (bounds === "INTERIOR") {
        material = material_floors_interior;
      } else {
        material = material_floors;
      }
    } else if (subtype === "ROOF") {
      if (bounds === "GROUND") {
        material = material_roofs_ground;
      } else if (bounds === "INTERIOR") {
        material = material_roofs_interior;
      } else {
        material = material_roofs;
      }
    } else {
      if (bounds === "GROUND") {
        material = material_walls_ground;
      } else if (bounds === "INTERIOR") {
        material = material_walls_interior;
      } else {
        material = material_walls;
      }
    }
  } else if (type === "Window") {
    material = material_windows;
  } else if (type === "Shade") {
    material = material_shades;
  } else {
    console.log(
      `Elemento ${mesh.name} (${mesh.userData.type}), asignando material de selección por defecto`
    );
    material = material_select;
  }
  return material;
}
