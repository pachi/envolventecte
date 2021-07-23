import { MathUtils, Matrix3, Matrix4, Vector2, Vector3 } from "three";

const { degToRad } = MathUtils;

// Punto, coordenadas de punto
// point { x, y, z }

// Rayo, defindo por dos puntos, P0 y P1
// ray { P0, P1 }

// Polígono (sin agujeros)
// polygon {
//     P[], // lista de puntos
//     count // número de puntos
// }
const EPSILON = 1e-5;

// Test 2D de punto en polígono
// http://erich.realtimerendering.com/ptinpoly/
// Cuenta el número de cruces haciendo raycasting desde el punto para ver si está dentro (cruces impares) o fuera (cruces pares)
// Evita el cálculo de las intersecciones y la división por cero viendo los cambios de signo
// https://stackoverflow.com/questions/217578/how-can-i-determine-whether-a-2d-point-is-within-a-polygon/2922778#2922778
// ver https://docs.rs/geo/0.2.6/src/geo/.cargo/registry/src/github.com-1ecc6299db9ec823/geo-0.2.6/src/algorithm/contains.rs.html#9-33
// https://docs.rs/geo/0.18.0/geo/algorithm/contains/trait.Contains.html
// Ver algunos casos límite en https://stackoverflow.com/a/63436180
function pointInPolygon2D(pt, poly) {
  const x = pt.x;
  const y = pt.y;
  let inside = false;

  let v_j = poly[poly.length - 1];
  let y_0 = v_j.y >= y;
  for (let i=0; i < poly.length; i++) {
    let v_i = poly[i];
    let y_1 = v_i.y >= y;
    // primero se mira si el lado cruza la linea horizontal en pt.y
    // y, si es así, comprobamos si se cruza también en x para detectar que se produe el cruce
    if (y_0 !== y_1) {
      if (
        (v_i.y - y) * (v_j.x - v_i.x) >= (v_i.x - x) * (v_j.y - v_i.y) ===
        y_1
      ) {
        inside = !inside;
      }
    }
    y_0 = y_1;
    v_j = v_i;
  }
  return inside;
}

// Calcula la existencia de intersección entre rayo y geometría, e indica el punto de intersección
//
// ray_origin: punto de origen del rayo en coordenadas globales (Vector3)
// ray_dir: dirección del rayo en coordenadas globales (Vector3)
// poly: polígono 2D (XY), Polygon: Vec[Point2, ...]
//
// - Transforma el rayo al espacio del polígono
// - Calcula el punto de intersección del rayo transformado con el plano XY
// - Comprueba si el punto está en el interior del polígono
// - Transforma el punto al espacio del rayo (coordenadas globales)
//
// Si no devolvemos el punto de intersección ahorraríamos una transformación
export function intersectPoly2D(ray_origin, ray_dir, geom) {
  // Matrices de transformación de geometría
  const trans = findGeomTransform(geom);
  const transInv = trans.invert();

  // Transformación inversa del rayo
  const inv_ray_o = ray_origin.clone().applyMatrix4(transInv);
  const inv_ray_d = ray_dir
    .clone()
    .applyMatrix4(new Matrix4().extractRotation(transInv));

  // Normal al polígono (2D)
  const n_p = findPoly2DNormal(geom.polygon);
  // Check if ray is parallel to the polygon
  const denominator = n_p.dot(inv_ray_d);
  if (Math.abs(denominator) < EPSILON) {
    return [false, null];
  }

  // Find intersection of ray with plane XY
  const poly_o_to_ray = new Vector3(
    geom.polygon[0].x,
    geom.polygon[0].y,
    0
  ).sub(inv_ray_o);
  const t = n_p.dot(poly_o_to_ray) / denominator;

  // Only take positive t (it's a ray)
  if (t < 0.0) {
    return [false, null];
  }
  let intersection_point = inv_ray_o
    // .clone() no lo necesitamos porque no se usa después ningún elemento del rayo
    .add(inv_ray_d.multiplyScalar(t));

  // Verify that the point falls inside the polygon
  const point2d = new Vector2(intersection_point.x, intersection_point.y);
  // TODO: Optimización previa posible: chequear antes si el punto está dentro de la bounding box 2D
  const point_is_inside = pointInPolygon2D(point2d, geom.polygon);

  // Transform back the intersection point
  intersection_point = point_is_inside
    ? intersection_point.applyMatrix4(trans)
    : null;

  return [point_is_inside, intersection_point, point2d];
}

// Normal al polígono plano
function findPoly2DNormal(poly) {
  const v0 = poly[1].clone().sub(poly[0]);
  const v1 = poly[2].clone().sub(poly[0]);
  return new Vector3(v0.x, v0.y, 0)
    .cross(new Vector3(v1.x, v1.y, 0))
    .normalize();
}

// Matriz de rotación del objeto
function findGeomTransform(geom) {
  const mtilt = new Matrix4().makeRotationX(degToRad(geom.tilt));
  const mazim = new Matrix4().makeRotationZ(degToRad(geom.azimuth));
  const mtran = new Matrix4().makeTranslation(
    geom.position.x,
    geom.position.y,
    geom.position.z
  );
  return mtran.multiply(mazim).multiply(mtilt);
}

// Calcula los puntos de origen en el hueco para el cálculo de fracción sombreada
//
// Parte de una retícula de 10x10 elementos, que daría un 1% de cobertura por cada celda
// Se podría optimizar la heurística, afinando el valor de N=10 en función del
// tamaño y proporción del hueco (p.e. para que sean más o menos cuadradas las celdas)
// aunque se pierda precisión en huecos pequeños la resolución sería similar en ambas direcciones
export function getWindowPoints(window, N = 10) {
  const {
    position: [x, y],
    width,
    height,
  } = window.geometry;
  const stepX = width / N;
  const stepY = height / N;
  const points = [];
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const px = x + (i + 0.5) * stepX;
      const py = y + (j + 0.5) * stepY;
      points.push(new Vector2(px, py));
    }
  }
  return points;
}

export function sunlitFraction(window, walls, shades, sun_azimuth, sun_altitude) {
  // Azimuth (S=0, E=90, W=-90)
  // Altura solar (Horiz=0, vert=90), en grados
  const sazim = (sun_azimuth * Math.PI) / 180;
  const salt = (sun_altitude * Math.PI) / 180;
  // Direction pointing towards the sun in the XYZ coordinate system (Z up, +X=E, +Y=N)
  const ray_dir = new Vector3(
    Math.cos(salt) * Math.sin(sazim),
    -Math.cos(salt) * Math.cos(sazim),
    Math.sin(salt)
  ).normalize();

  const winWall = walls.find((w) => w.id === window.wall);
  if (winWall === undefined) {
    throw `No se encuentra el muro al que pertenece el hueco ${window.name}`;
  }
  const { geometry } = winWall;
  const { tilt, azimuth, position, polygon } = geometry;
  // Conversión a coordenadas globales
  const wallTransform = transformMatrix(tilt, azimuth, position);
  // Conversión de coordenadas locales de muro a coordenadas de polígono de muro
  const wallLocal2WallPolyTransform = wallLocal2WallPolygon(polygon);

  // Compute window for window shading tests
  const points = getWindowPoints(window)
    .map((p) => p.applyMatrix3(wallLocal2WallPolyTransform))
    .map((p) => new Vector3(p.x, p.y, 0).applyMatrix4(wallTransform));

  let occluders = walls.concat(shades);

  let num = 0;
  let num_intersects = 0;
  for (let ray_orig of points) {
    num += 1;
    for (let w of occluders) {
      if (w.id === winWall.id) {
        continue;
      }
      const g = w.geometry;
      const geom = {
        tilt: g.tilt,
        azimuth: g.azimuth,
        position: new Vector3(g.position[0], g.position[1], g.position[2]),
        polygon: w.geometry.polygon.slice().map((p) => new Vector2(p[0], p[1])),
      };
      // eslint-disable-next-line no-unused-vars
      const [intersects, int_point, point2d] = intersectPoly2D(
        ray_orig,
        ray_dir,
        geom
      );
      if (intersects == true) {
        num_intersects += 1;
        // console.log(
        //   "Intersección con elemento oclusor: ",
        //   w.name,
        //   ", de rayo: ",
        //   ray_dir,
        //   ", punto 2D: ",
        //   point2d,
        //   ", punto 3D: ",
        //   int_point,
        //   ", en geometría: ",
        //   geom
        // );
        break;
      }
    }
  }
  // console.log(".", num_intersects, num);
  return 1 - num_intersects / num;
}

// Matriz de transformación de los elementos del edificio
// Traslada de coordenadas de muros a coordenadas globales (giros y desplazamientos)
function transformMatrix(tilt, azimuth, position) {
  const [x, y, z] = position;
  // Aplicamos la inclinación del muro
  const mtilt = new Matrix4().makeRotationX(degToRad(tilt));
  // Aplicamos el azimuth del muro
  const mazim = new Matrix4().makeRotationZ(degToRad(azimuth));
  // Aplicamos la traslación en coordenadas globales
  const mtran = new Matrix4().makeTranslation(x, y, z);

  return mtran.multiply(mazim).multiply(mtilt);
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
