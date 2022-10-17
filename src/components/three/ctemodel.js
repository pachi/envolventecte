import {
  BufferGeometry,
  EdgesGeometry,
  Group,
  LineSegments,
  MathUtils,
  Matrix3,
  Matrix4,
  Mesh,
  ShapeUtils,
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
/* eslint-disable no-undefined */
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
  buildingGroup.rotation.x = -Math.PI / 2;

  let wireframeGroup;
  const wfGroup = scene.getObjectByName("WireframeGroup");
  if (wfGroup) {
    wfGroup.remove(...wfGroup.children);
    wireframeGroup = wfGroup;
  } else {
    wireframeGroup = new Group();
    wireframeGroup.name = "WireframeGroup";
  }
  wireframeGroup.rotation.x = -Math.PI / 2;

  for (const wall of model.walls) {
    const { geometry } = wall;
    const { tilt, azimuth, position, polygon } = geometry;
    // Detecta muros sin definición geométrica completa
    if (!position || !polygon || tilt === undefined || azimuth === undefined) {
      continue;
    }
    if (polygon.length < 2) {
      // 1 punto o menos - nada
      console.log("Generación de geometría incorrecta de muro: ", wall);
      console.log("Sin suficientes datos de contorno: ", polygon);
      continue;
    }

    // TODO: Llevar generación de userData a funciones
    const wallSubtype = getWallSubtype(wall); // FLOOR | ROOF | WALL
    const wallBounds = wall.bounds; // ADIABATIC | GROUND | EXTERIOR | INTERIOR
    const wallData = {
      id: wall.id,
      name: wall.name,
      type: "Wall",
      bounds: wallBounds,
      subtype: wallSubtype,
    };

    // Conversión a coordenadas globales
    const wallTransform = transformMatrix(tilt, azimuth, position);
    // Conversión de coordenadas locales de muro a coordenadas de polígono de muro
    const wallLocal2WallPolyTransform = wallLocal2WallPolygon(polygon);

    // Muro
    const wallWindows = model.windows.filter((w) => w.wall === wall.id);

    const wallHoles = [];
    for (const window of wallWindows) {
      if (
        !window.geometry.position ||
        window.geometry.height * window.geometry.width === 0
      ) {
        continue;
      }

      // Contorno de muro en coordenadas de polígono de muro
      const winContour = getWindowContour(window, wallLocal2WallPolyTransform);
      const winMesh = meshFromCoords(winContour);
      winMesh.geometry.applyMatrix4(wallTransform);

      // Aplica retranqueo de huecos tomando normal del primer vértice
      setWindowMeshSetback(window, winMesh);

      // Asigna propiedades de hueco
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

      // Elige material según propiedades
      winMesh.material = chooseMaterial(winMesh);

      // Añadir la malla al grupo
      buildingGroup.add(winMesh);
      // Añadir el path a la lista de huecos del muro
      wallHoles.push(winContour);
    }

    const wallContour = polygon.map((p) => new Vector2(p[0], p[1]));
    const wallMesh = meshFromCoords(wallContour, wallHoles);
    wallMesh.geometry.applyMatrix4(wallTransform);

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
    const { tilt, azimuth, position, polygon } = shade.geometry;
    // Detecta sombras sin definición geométrica completa
    if (!position || !polygon || tilt === undefined || azimuth === undefined) {
      continue;
    }
    // Puntos insuficientes para generar una superficie
    if (polygon.length < 3) {
      continue;
    }

    const shadeTransform = transformMatrix(tilt, azimuth, position);
    const contour = polygon.map((p) => new Vector2(p[0], p[1]));
    const shadeMesh = meshFromCoords(contour);
    shadeMesh.geometry.applyMatrix4(shadeTransform);

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

// Construye malla a partir de lista de puntos (2D) de contorno y
// lista de paths de huecos ([Path([Vector2, ...])...])
// El contorno debe tener al menos 2 puntos (una línea)
function meshFromCoords(contour, holes = []) {
  const geom = new BufferGeometry();
  let points;
  if (contour.length < 3) {
    // 2 puntos - línea
    points = [contour[0], contour[1], contour[0]];
  } else if (contour.length == 3 && holes.length === 0) {
    // 3 puntos sin agujero - triángulo
    points = [contour[0], contour[1], contour[2]];
  } else if (contour.length === 4 && holes.length === 0) {
    // 4 puntos sin agujero - cuadrilátero
    points = [
      contour[0],
      contour[1],
      contour[2],
      contour[0],
      contour[2],
      contour[3],
    ];
  } else {
    // Triangula teniendo en cuenta el contorno y los agujeros
    // Genera los índices de vértices de la triangulación
    const triangles = ShapeUtils.triangulateShape(contour, holes);
    // Genera secuencia de 3 puntos a partir de los índices de triangulación
    const pointsAll = contour.slice(0).concat(...holes);
    points = [];
    for (let triangle of triangles) {
      for (let j = 0; j < 3; j++) {
        const vertex = pointsAll[triangle[j]];
        points.push(vertex);
      }
    }
  }

  geom.setFromPoints(points);
  geom.computeVertexNormals();

  const mesh = new Mesh(geom);
  mesh.castShadow = mesh.receiveShadow = true;

  return mesh;
}

// Obtener lista de puntos de contorno de un hueco
// Los datos de hueco están en coordenadas locales de muro y se transforman en
// coordenadas de polígono de muro
// La posición se refiere a la esquina inferior izquierda.
function getWindowContour(window, wallLocal2WallPolyTransform = null) {
  const {
    position: [x, y],
    width,
    height,
  } = window.geometry;
  // Generamos el hueco transformando las coordenadas a ejes locales de muro
  let contour = [
    new Vector2(x, y),
    new Vector2(x + width, y),
    new Vector2(x + width, y + height),
    new Vector2(x, y + height),
  ];
  if (wallLocal2WallPolyTransform) {
    contour = contour.map((p) => p.applyMatrix3(wallLocal2WallPolyTransform));
  }
  return contour;
}

// Aplica retranqueo a la malla del hueco
function setWindowMeshSetback(window, mesh) {
  // Aplica retranqueo de huecos tomando normal del primer vértice
  const winNormal = new Vector3().fromBufferAttribute(
    mesh.geometry.getAttribute("normal"),
    0
  );
  const winSetback = winNormal.multiplyScalar(-window.geometry.setback);
  mesh.geometry.translate(...winSetback.toArray());

  return mesh;
}

// Matriz de transformación de coordenadas locales de muro a coordenadas de su polígono 2D
// Nos sirve para pasar de las coordenadas locales del muro a las coordenadas del polígono de muro en 2D
// Se gira el eje X en la dirección del polígono de muro p1 - p0 y se traslada a p0 el origen
function wallLocal2WallPolygon(wall_polygon) {
  const v0 = wall_polygon[0];
  const v1 = wall_polygon[1];
  const dirX = new Vector2(v1[0] - v0[0], v1[1] - v0[1]);
  const angleX = dirX.angle();
  const c = Math.cos(angleX);
  const s = Math.sin(angleX);
  return new Matrix3().set(c, -s, v0[0], s, c, v0[1], 0, 0, 1);
}

// Matriz de transformación de los elementos del edificio
// Traslada de coordenadas de muros a coordenadas globales (giros y desplazamientos)
// y lleva del sistema de coordenadas X, Y al sistema X, -Z
function transformMatrix(tilt, azimuth, position) {
  const [x, y, z] = position;
  // Aplicamos la inclinación del muro
  const tilt_rot_mat = new Matrix4().makeRotationX(degToRad(tilt));
  // Aplicamos el azimuth del muro
  const azimuth_rot_mat = new Matrix4().makeRotationZ(degToRad(azimuth));
  // Aplicamos la traslación en coordenadas globales
  const trans_mat = new Matrix4().makeTranslation(x, y, z);

  return trans_mat.multiply(azimuth_rot_mat).multiply(tilt_rot_mat);
}

// Devuelve subtipo de muro según inclinación: ROOF | FLOOR | WALL
function getWallSubtype(wall) {
  if (Math.abs(Math.abs(wall.geometry.tilt) - 180) < 1e-3) {
    return "FLOOR";
  } else if (Math.abs(wall.geometry.tilt) < 1e-3) {
    return "ROOF";
  }

  return "WALL";
}
