import React, { useContext, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { autorun } from "mobx";

import * as THREE from "three";
import {
  AmbientLight,
  AxesHelper,
  // CameraHelper,
  DirectionalLight,
  // DirectionalLightHelper,
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
  const mountRef = useRef(null);
  const guiPaneRef = useRef(null);

  const model = {
    walls: appstate.walls,
    windows: appstate.windows,
    shades: appstate.shades,
  };

  // Incializa ThreeJS
  const scene = new Scene();
  const renderer = new WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  // Cámara
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 30, 50);
  camera.lookAt(new Vector3(0, 0, 0));

  // Controles
  const cameraControl = useRef();

  // Introduce suelo y luces
  initGround(scene);
  initLights(scene);

  useEffect(() => {
    const ref = mountRef.current;

    // Incializa cámara
    camera.aspect = ref.clientWidth / ref.clientHeight;

    // Renderer
    renderer.setSize(ref.clientWidth, ref.clientHeight, false);

    // Controles
    const control = new OrbitControls(camera, ref);
    control.enableDamping = true;
    control.enabled = true;
    control.update();
    cameraControl.current = control;

    // Panel de control
    const gui = new GUIView(scene, guiPaneRef);

    // Monta elemento en el DOM
    ref.appendChild(renderer.domElement);

    // Conecta eventos del panel de control
    mountRef.current.addEventListener("keydown", (e) =>
      onKeyDown(e, gui, control)
    );
    mountRef.current.addEventListener("pointerdown", (e) =>
      onPointerDown(e, mountRef, scene, camera, gui)
    );

    // Bucle de animación
    const animate = () => {
      if (control) control.update();
      resizeToDisplaySize(renderer, camera);
      renderer.render(scene, camera);
      return window.requestAnimationFrame(animate);
    };

    const requestID = animate();

    // Desmonta al eliminar el componente
    return () => {
      window.cancelAnimationFrame(requestID);
      if (control) control.dispose();
      if (gui) gui.dispose();
      ref.removeChild(renderer.domElement);
    };
  }, [scene, camera, renderer]);

  useEffect(
    () =>
      autorun(() => {
        const control = cameraControl.current;
        initObjectsFromModel(model, scene);
        updateCamera(scene, camera, control);
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
      <div style={style} ref={mountRef} tabIndex={-1} />
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

const initLights = (scene) => {
  // Luz ambiente
  const light_amb = new AmbientLight(0xffffff, 0.6);
  scene.add(light_amb);

  // Luz direccional. Ajustamos el tamaño para que cubra la escena
  // y ajustamos el punto de cálculo de sombras para evitar aliasing
  const light = new DirectionalLight(0xffffff, 1);
  // light.shadow.normalBias = 0.05;
  light.shadow.bias = -0.0005;
  const d = 50;
  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;
  light.shadow.camera.far = 200; // Default 2000
  light.shadow.mapSize.width = 2048; // Default 512
  light.shadow.mapSize.height = 2048;
  light.position.set(60, 100, 40);
  light.castShadow = true;
  scene.add(light);

  // Helpers for shadow camera and directional light
  // scene.add(new CameraHelper(light.shadow.camera));
  // scene.add(new DirectionalLightHelper(light));
};

const updateCamera = (scene, camera, control) => {
  const obj = scene.getObjectByName("BuildingGroup");
  const bbox = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  bbox.getSize(size);
  bbox.getCenter(center);
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
// CTRL + ALT + h - resitua cámara en su posición original
// CTRL + ALT + i - Activa / desactiva modo de inspección de objetos
// Para poder conectar este manejador en un elemento div es necesario fijar la
// propiedad tabIndex=-1 (para que el elemento se sitúe fuera del flujo de foco de entrada)
// Ver https://webaim.org/techniques/keyboard/tabindex
const onKeyDown = (e, gui, control) => {
  // CTRL + ALT + g || CTRL + ALT + p
  if (e.ctrlKey && e.altKey && (e.code === "KeyG" || e.code === "KeyP")) {
    if (gui) gui.toggle();
  }
  // CTRL + ALT + h
  if (e.ctrlKey && e.altKey && e.code === "KeyH") {
    if (control) control.reset();
  }
  // CTRL + ALT + i
  if (e.ctrlKey && e.altKey && e.code === "KeyI") {
    if (gui) {
      gui.params.inspectMode = !gui.params.inspectMode;
      gui.pane.refresh();
    }
  }
};

// Muestra, en modo de inspección, una lista con los objetos bajo la localización del puntero
const onPointerDown = (e, ref, scene, camera, gui) => {
  const currentRef = ref.current;
  if (!gui || gui.params.inspectMode === false || !currentRef) return;
  // Rectángulo del elemento
  const rect = currentRef.getBoundingClientRect();
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
    setTextData(gui, el, e.clientX, e.clientY, objectNames);
  } else {
    setTextData(gui, el, e.clientX, e.clientY, []);
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
