import {
  EdgesGeometry,
  Group,
  LineSegments,
  MathUtils,
  Matrix4,
  Mesh,
  Shape,
  ShapeGeometry,
  Vector2,
  Vector3,
} from "three";
import {
  chooseMaterial,
  material_lines,
  material_shades,
} from "./ctematerials.js";

const { degToRad } = MathUtils;

// Genera geometría del modelo
//
// El modelo maneja dos espacios de coordenadas, el global y el local de muro
// Además, los ejes del modelo son en X,Y (inclinación, azimuth)
// pero en ThreeJS usamos X,-Z
// ThreeJS: ejes X rojo, Y verde, Z azul
export function initObjectsFromModel(model, scene) {
  let buildingGroup;
  const bGroup = scene.getObjectByName("BuildingGroup");
  if (bGroup) {
    bGroup.remove(...bGroup.children);
    buildingGroup = bGroup;
  } else {
    buildingGroup = new Group();
    buildingGroup.name = "BuildingGroup";
  }

  let wireframeGroup;
  const wfGroup = scene.getObjectByName("WireframeGroup");
  if (wfGroup) {
    wfGroup.remove(...wfGroup.children);
    wireframeGroup = wfGroup;
  } else {
    wireframeGroup = new Group();
    wireframeGroup.name = "WireframeGroup";
  }

  for (const wall of model.walls) {
    const { tilt, azimuth, geometry } = wall;
    if (!geometry) {
      continue;
    }
    const { position, polygon } = geometry;

    const wallSubtype = getWallSubtype(wall); // FLOOR | ROOF | WALL
    const wallBounds = wall.bounds; // ADIABATIC | GROUND | EXTERIOR | INTERIOR
    const wallData = {
      id: wall.id,
      name: wall.name,
      type: "Wall",
      bounds: wallBounds,
      subtype: wallSubtype,
    };

    const wallTransform = transformMatrix(tilt, azimuth, position);

    // Muro
    const wallShape = new Shape(polygon.map((p) => new Vector2(p[0], p[1])));
    const wallWindows = model.windows.filter((w) => w.wall === wall.id);

    for (const window of wallWindows) {
      const winShape = windowShape(window);
      const winMesh = meshFromShape(winShape, wallTransform);
      winMesh.name = window.name;
      winMesh.userData = {
        id: window.id,
        name: window.name,
        type: "Window",
        bounds: wallBounds,
        subtype: wallSubtype,
        parent: wall.name,
        parentId: wall.id,
      };
      winMesh.material = chooseMaterial(winMesh);
      // Aplica retranqueo de huecos
      // TODO: no generamos todavía los elementos laterales
      const winNormal = buffergeometryNormal(winMesh.geometry).clone();
      const winSetback = winNormal.multiplyScalar(-window.geometry.setback);
      winMesh.geometry.translate(...winSetback.toArray());

      // Añadir al grupo
      buildingGroup.add(winMesh);
      // Añadir como hueco al muro
      wallShape.holes.push(winShape);
    }

    const wallMesh = meshFromShape(wallShape, wallTransform);
    wallMesh.name = wall.name;
    wallMesh.userData = wallData;
    wallMesh.material = chooseMaterial(wallMesh);

    buildingGroup.add(wallMesh);

    // Añade wireframe
    const wireframe = new LineSegments(
      new EdgesGeometry(wallMesh.geometry),
      material_lines
    );
    wireframe.renderOrder = 1; // wireframes en segundo lugar
    wireframeGroup.add(wireframe);
  }

  // Sombras
  const shades = model.shades || [];
  for (let shade of shades) {
    const { tilt, azimuth, position, polygon } = shade;
    const shadeTransform = transformMatrix(tilt, azimuth, position);
    const shadeShape = new Shape(polygon.map((p) => new Vector2(p[0], p[1])));
    const shadeMesh = meshFromShape(shadeShape, shadeTransform);
    shadeMesh.name = shade.name;
    shadeMesh.material = material_shades;
    shadeMesh.userData = {
      id: shade.id,
      name: shade.name,
      type: "Shade",
    };
    buildingGroup.add(shadeMesh);
  }

  // Añade elementos a la escena
  scene.add(buildingGroup);
  scene.add(wireframeGroup);
}

// Genera Mesh desde Shape, asignando capacidad de recibir y generar sombras y generando normales
function meshFromShape(shape, transform) {
  const winGeom = new ShapeGeometry(shape).applyMatrix4(transform);
  winGeom.computeVertexNormals();
  const winMesh = new Mesh(winGeom);
  winMesh.receiveShadow = true;
  winMesh.castShadow = true;
  return winMesh;
}

// Normal del vértice idx de un buffergeometry
//
// Genera un Vector3 para el BufferAttribute 'normal' del elemento idx
function buffergeometryNormal(geometry, idx = 0) {
  const vA = geometry.index.getX(idx);
  const normalAttr = geometry.getAttribute("normal");
  const normal = new Vector3().fromBufferAttribute(normalAttr, vA);
  return normal;
}

// Generar el Shape de un hueco a partir de los datos de posición, ancho y alto
// La forma se genera en coordenadas de muro
function windowShape(window) {
  const {
    position: [x, y],
    width,
    height,
  } = window.geometry;
  return new Shape([
    new Vector2(x, y),
    new Vector2(x + width, y),
    new Vector2(x + width, y + height),
    new Vector2(x, y + height),
  ]);
}

// Matriz de transformación de los elementos del edificio
// Traslada de coordenadas de muros a coordenadas globales (giros y desplazamientos)
// y lleva del sistema de coordenadas X, Y al sistema X, -Z
function transformMatrix(tilt, azimuth, position) {
  const [x, y, z] = position;
  // Aplicamos la inclinación del muro
  const mtilt = new Matrix4().makeRotationX(degToRad(tilt));
  // Aplicamos el azimuth del muro
  const mazim = new Matrix4().makeRotationZ(degToRad(azimuth));
  // Aplicamos la traslación en coordenadas globales
  const mtran = new Matrix4().makeTranslation(x, y, z);
  // Cambiamos la disposición de ejes de X,Y a X,-Z
  const mflipz = new Matrix4().makeRotationX(-Math.PI / 2);

  return mflipz.multiply(mtran).multiply(mazim).multiply(mtilt);
}

// Devuelve subtipo de muro según inclinación: ROOF | FLOOR | WALL
function getWallSubtype(wall) {
  if (Math.abs(Math.abs(wall.tilt) - 180) < 1e-3) {
    return "FLOOR";
  } else if (Math.abs(wall.tilt) < 1e-3) {
    return "ROOF";
  } else {
    return "WALL";
  }
}
