import React, { useContext, useRef, useEffect } from "react";
import { observer } from "mobx-react";
import { autorun } from "mobx";

import * as THREE from "three";
import {
  AmbientLight,
  AxesHelper,
  // CameraHelper,
  DirectionalLight,
  DirectionalLightHelper,
  GridHelper,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  ShadowMaterial,
  Shape,
  ShapeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { initObjectsFromModel } from "./ctemodel.js";
import GUIView from "./gui/GUIView";
import AppState from "../../stores/AppState";

const style = {
  display: "flex",
  flexFlow: "row",
  height: "60vh",
};

const ThreeView = () => {
  const appstate = useContext(AppState);
  // Referencia a nodo DOM en el que se monta el ThreeView
  const domNodeRef = useRef(null);
  // Referencia a nodo DOM del panel de control
  const guiPaneRef = useRef(null);
  // Referencia a Controles de cámara
  const cameraControlRef = useRef();

  const model = {
    walls: appstate.walls,
    windows: appstate.windows,
    shades: appstate.shades,
  };

  // Inicializa ThreeJS
  // Renderer
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  // Cámara
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 30, 50);
  camera.lookAt(new Vector3(0, 0, 0));
  camera.up.set(0, 1, 0); // Tenemos "arriba" en +Y (valor por defecto)

  // Escena
  const scene = new Scene();

  // Introduce suelo y luces
  initGround(scene);
  initLights(scene);

  // Al renderizar por primera vez:
  // - Monta control de cámara
  // - Monta panel de control general
  // - Configura visualización inicial (tamaño, aspect ratio, etc)
  // - Añade elemento del DOM del renderer
  // - Conecta eventos de teclado y mouse
  // - Inicia bucle de animación
  // - Devuelve destructor para ejecutar al desmontar el control
  useEffect(() => {
    const domNode = domNodeRef.current;

    // Control de cámara
    const cameraControl = new OrbitControls(camera, domNode);
    cameraControl.enableDamping = true;
    cameraControl.enabled = true;
    cameraControl.update();
    cameraControlRef.current = cameraControl;

    // Inicializa cámara
    camera.aspect = domNode.clientWidth / domNode.clientHeight;

    // Panel de control
    const gui = new GUIView(scene, guiPaneRef);

    // Renderer
    renderer.setSize(domNode.clientWidth, domNode.clientHeight, false);

    // Monta elemento en el DOM
    domNode.appendChild(renderer.domElement);

    // Conecta eventos de mouse y teclado
    domNode.addEventListener("keydown", (e) =>
      onKeyDown(e, gui, cameraControlRef)
    );
    domNode.addEventListener("pointerdown", (e) =>
      onPointerDown(e, domNodeRef, scene, camera, gui)
    );

    // Bucle de animación
    const animate = () => {
      if (cameraControl) cameraControl.update();
      resizeToDisplaySize(renderer, camera);
      renderer.render(scene, camera);
      return window.requestAnimationFrame(animate);
    };
    const requestID = animate();

    // Desmonta al eliminar el componente
    return () => {
      const cameraControl = cameraControlRef.current;
      window.cancelAnimationFrame(requestID);
      if (cameraControl) cameraControl.dispose();
      if (gui) gui.dispose();
      if (domNodeRef.current) {
        domNodeRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Actualización del modelo cuando este cambie
  useEffect(
    () =>
      autorun(() => {
        initObjectsFromModel(model, scene);
        updateCameraAndLight(scene, camera, cameraControlRef.current);
        updateGround(scene);
      }),
    [model, scene, camera]
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{ position: "absolute", top: 0, left: 0, width: "25%" }}
        ref={guiPaneRef}
      />
      {/* Tabindex es necesario para recibir eventos de teclado en un div */}
      <div style={style} ref={domNodeRef} tabIndex={-1} />
    </div>
  );
};

// Materiales para símbolo de norte y plano del suelo
const northSymbolCircleMaterial = new THREE.MeshLambertMaterial({
  color: 0x884444,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5,
});

const northSymbolArrowMaterial = new THREE.MeshLambertMaterial({
  color: 0x333333,
  side: THREE.DoubleSide,
});

const groundPlaneMaterial = new ShadowMaterial({
  color: 0x6c6c6c,
  opacity: 0.75,
});

// Crea símbolo de norte
const createNorthSymbol = (x, y) => {
  const radius = 1;
  const symbolGroup = new Group();
  symbolGroup.name = "NorthSymbol";

  const circle = new Mesh(
    new THREE.CircleGeometry(radius, 64),
    northSymbolCircleMaterial
  );
  symbolGroup.add(circle);

  const arrowShape = new Shape();
  arrowShape.moveTo(radius, 0);
  arrowShape.lineTo(0, radius);
  arrowShape.lineTo(-radius, 0);
  arrowShape.closePath();

  const arrow = new Mesh(
    new ShapeGeometry(arrowShape),
    northSymbolArrowMaterial
  );
  arrow.position.set(0, 0, 0.05);
  symbolGroup.add(arrow);

  symbolGroup.rotation.x = -Math.PI / 2;
  symbolGroup.position.set(x - 1, 0, y + 1);

  return symbolGroup;
};

// Genera elemento de suelo y rejilla
//
// ThreeJS: ejes X rojo, Y verde, Z azul
const initGround = (scene) => {
  const groundGroup = new Group();
  groundGroup.name = "GroundGroup";

  // Suelo de soporte transparente
  const ground = new Mesh(new PlaneGeometry(200, 200), groundPlaneMaterial);
  ground.name = "World_Ground";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;
  groundGroup.add(ground);

  // Grid helper con 40 divisiones de 1m
  const gridHelper = new GridHelper(40, 40, 0x0000ff, 0x808080);
  gridHelper.name = "GridHelper";
  gridHelper.position.set(0, 0, 0);
  // @ts-ignore
  gridHelper.material.setValues({ opacity: 0.25, transparent: true });
  groundGroup.add(gridHelper);

  // Axes helper
  groundGroup.add(new AxesHelper(10)); // X rojo, Y verde, Z azul

  // Símbolo de norte
  groundGroup.add(createNorthSymbol(0, 0));

  // Añade elementos a la escena
  scene.add(groundGroup);
};

// Actualiza elemento de suelo en función del tamaño del modelo cargado
const updateGround = (scene) => {
  const buildingGroup = scene.getObjectByName("BuildingGroup");
  const groundGroup = scene.getObjectByName("GroundGroup");
  const bbox = new THREE.Box3().setFromObject(buildingGroup);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bbox.getSize(size);
  bbox.getCenter(center);
  const maxSize = Math.max(size.x, size.z);

  // Suelo de soporte transparente
  const ground = new Mesh(
    new PlaneGeometry(2.5 * size.x, 2.5 * size.z),
    groundPlaneMaterial
  );
  ground.name = "World_Ground";
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.01;
  ground.receiveShadow = true;

  groundGroup.remove(scene.getObjectByName("World_Ground"));
  groundGroup.add(ground);

  // Grid helper
  const gridHelper = new GridHelper(
    maxSize + 2,
    maxSize + 2,
    0x0000ff,
    0x808080
  );
  gridHelper.name = "GridHelper";
  gridHelper.position.set(Math.round(center.x), 0, Math.round(center.z));
  // @ts-ignore
  gridHelper.material.setValues({ opacity: 0.25, transparent: true });

  groundGroup.remove(scene.getObjectByName("GridHelper"));
  groundGroup.add(gridHelper);

  groundGroup.remove(scene.getObjectByName("NorthSymbol"));
  groundGroup.add(createNorthSymbol(bbox.min.x, bbox.max.z));
};

// Posición solar para un azimuth y altura solar dados
// - azimuth (S=0, E=90, W=-90)
// - altura solar (Horiz=0, vert=90), en grados
// Usa una posición con distancia = 100m
// Coordenadas altura solar es sistema levógiro y con Y=arriba, X=Este, Z=Sur
const sunPos = (azimuth, altitude, dist = 100) => {
  const azim = (azimuth * Math.PI) / 180;
  const alt = (altitude * Math.PI) / 180;
  return new Vector3(
    Math.cos(alt) * Math.sin(azim),
    Math.sin(alt),
    Math.cos(alt) * Math.cos(azim)
  ).multiplyScalar(dist);
};

const initLights = (scene) => {
  const group = new Group();
  group.name = "LightsGroup";

  // Luz ambiente
  const light_amb = new AmbientLight(0xffffff, 2.0);
  light_amb.name = "AmbientLight";
  group.add(light_amb);

  // Luz direccional. Ajustamos el tamaño para que cubra la escena
  // y ajustamos el punto de cálculo de sombras para evitar aliasing
  const light = new DirectionalLight(0xffffff, 3.5);
  light.name = "Sun";
  light.shadow.normalBias = 0.05;
  light.shadow.bias = -0.00025;
  const d = 50;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 300; // Default 2000
  light.shadow.mapSize.width = 512 * 4; // Default 512
  light.shadow.mapSize.height = 512 * 4;
  light.position.copy(sunPos(19.5, 68.8));
  light.castShadow = true;
  group.add(light);
  // Helpers for shadow camera and directional light
  // scene.add(new CameraHelper(light.shadow.camera));
  group.add(new DirectionalLightHelper(light, 1, "red"));

  scene.add(group);
};

// Actualiza cámara para centrar en el edificio
//
// En gbxmlview puede haber una estrategia interesante para actualizar, usando:
// - una esfera en lugar de una caja (para calcular más fácil la distancia):
// - ajustando la escala de la luz direccional
// - moviendo el punto al que mira la luz direccional (en el centro de la esfera)
// https://github.com/ladybug-tools/spider-gbxml-tools/blob/7ade1e3bbdfa50f07ee35520d8d11e1bbc4e3757/spider-gbxml-viewer/v-0-17-07/core-thr-three/thru-threejs-utilities.js#L88
const updateCameraAndLight = (scene, camera, control) => {
  const obj = scene.getObjectByName("BuildingGroup");
  const bbox = new THREE.Box3().setFromObject(obj);
  const size = bbox.getSize(new THREE.Vector3());
  const center = bbox.getCenter(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.z);

  // Mira hacia el edificio
  const target = new Vector3(0, 0, 0);
  if (obj) {
    new THREE.Box3().setFromObject(obj).getCenter(target);
  }
  camera.lookAt(target);

  // Ajusta distancia para ajustarse a la pantalla
  const fitOffset = 1.2;
  const fitHeightDistance =
    maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = control.target
    .clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);
  control.maxDistance = distance * 10;
  control.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  // Copia la posición del control
  camera.position.copy(control.target).sub(direction);

  // Actualiza cámara y control
  control.update();

  // Coloca luces desde el centro del edificio
  const lights = scene.getObjectByName("LightsGroup");
  lights.position.x = center.x / 2;
  lights.position.y = center.y / 2;
  lights.position.z = center.z / 2;
};

const resizeToDisplaySize = (renderer, camera) => {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
};

// Gestiona entradas de teclado:
// CTRL + ALT + g / p - oculta panel
// CTRL + ALT + h - resitúa cámara en su posición original
// CTRL + ALT + i - Activa / desactiva modo de inspección de objetos
// Para poder conectar este manejador en un elemento div es necesario fijar la
// propiedad tabIndex=-1 (para que el elemento se sitúe fuera del flujo de foco de entrada)
// Ver https://webaim.org/techniques/keyboard/tabindex
const onKeyDown = (e, guiView, cameraControlRef) => {
  // CTRL + ALT + g || CTRL + ALT + p
  if (e.ctrlKey && e.altKey && (e.code === "KeyG" || e.code === "KeyP")) {
    if (guiView) guiView.toggle();
  }
  // CTRL + ALT + h
  if (e.ctrlKey && e.altKey && e.code === "KeyH") {
    const cameraControl = cameraControlRef.current;
    if (cameraControl) cameraControl.reset();
  }
  // CTRL + ALT + i
  if (e.ctrlKey && e.altKey && e.code === "KeyI") {
    if (guiView) {
      guiView.params.inspectMode = !guiView.params.inspectMode;
      guiView.pane.refresh();
    }
  }
};

// Muestra, en modo de inspección, una lista con los objetos bajo la localización del puntero
const onPointerDown = (e, domNodeRef, scene, camera, guiView) => {
  const domNode = domNodeRef.current;
  if (!guiView?.params?.inspectMode || !domNode) return;

  // Rectángulo del elemento
  const rect = domNode.getBoundingClientRect();
  // Coordenadas dentro del elemento X: [0, rect.width], Y: [0, rect.height]
  const xCoord = e.clientX - rect.left;
  const yCoord = e.clientY - rect.top;
  // Coordenadas X: [-1, 1], Y: [-1, 1]
  const posX = (xCoord / rect.width) * 2 - 1;
  const posY = -(yCoord / rect.height) * 2 + 1;
  // Genera intersecciones, obteniendo lista de objetos de más próximo a más lejano
  const pointer3D = new Vector3(posX, posY, 0.5);
  const raycaster = new Raycaster();
  raycaster.setFromCamera(pointer3D, camera);
  const intersects = raycaster.intersectObjects(
    scene.getObjectByName("BuildingGroup").children
  );

  // Actualiza elemento de la interfaz
  const el = getTextElement(document);
  if (intersects.length > 0) {
    const objectNames = intersects.map((v) => v.object.name);
    setTextData(guiView, el, e.clientX, e.clientY, objectNames);
  } else {
    setTextData(guiView, el, e.clientX, e.clientY, []);
  }
};

// Genera lista de elementos bajo el puntero y traslada a panel
const setTextData = (gui, el, x, y, data) => {
  el.innerHTML = "";
  if (data.length) {
    // const ul = document.createElement("ul");
    for (let name of data) {
      const li = document.createElement("li");
      li.style.listStyle = "none";
      li.style.padding = "3px 5px 3px 15px";
      li.innerHTML = name;
      li.onmouseover = (e) => {
        e.stopPropagation();
        const selected = e.target;
        // @ts-ignore
        selected.style.background = "#D4A017";
        // @ts-ignore
        gui.onselectedElementChange({ value: selected.textContent });
      };
      li.onmouseleave = (e) => {
        // @ts-ignore
        e.target.style.background = "none";
        gui.onselectedElementChange({
          value: gui.params.selectedElementName,
        });
      };
      li.onpointerdown = (e) => {
        e.stopPropagation();
        let selectedElement = "";
        // Solo seleccionamos con pulsación del botón izquierdo
        if (e.buttons === 1) {
          // @ts-ignore
          selectedElement = e.target.textContent;
        }
        gui.params.selectedElementName = selectedElement;
        gui.pane.refresh();
      };
      el.appendChild(li);
    }
  }
  el.style.left = x + "px";
  el.style.top = y + "px";
};

// Devuelve o genera el elemento de texto en la interfaz
function getTextElement(document) {
  const el = document.getElementById("inspect_dom_element");
  if (el) {
    return el;
  }
  const ll = document.createElement("ul");
  ll.id = "inspect_dom_element";
  ll.style.margin = "0";
  ll.style.padding = "0";
  ll.style.position = "absolute";
  ll.style.color = "black";
  ll.style.background = "#ffffffAA";
  ll.style.font = "13px Arial, Verdana, sans-serif";
  ll.style.zIndex = "100";
  ll.style.display = "block";
  document.body.appendChild(ll);
  return ll;
}

export default observer(ThreeView);
