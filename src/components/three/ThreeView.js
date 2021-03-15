import React, { Component, useContext, useEffect } from "react";
import { observer } from "mobx-react-lite";

import * as THREE from "three";
import {
  AmbientLight,
  AxesHelper,
  CameraHelper,
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

class Viewport extends Component {
  componentDidMount() {
    this.sceneSetup();
    this.initGround();
    initObjectsFromModel(this.props.model, this.scene);
    this.updateCamera();
    this.initLights();
    // Añade GUI
    this.gui = new GUIView(this, this.guipane);
    this.animate();
  }

  shouldComponentUpdate(nextProps, nextState) {
    initObjectsFromModel(nextProps.model, this.scene);
    return true;
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestID);
    this.control.dispose();
    this.mount.removeChild(this.renderer.domElement);
  }

  sceneSetup = () => {
    // Incializa ThreeJS
    this.scene = new Scene();

    // Cámara
    this.camera = new PerspectiveCamera(
      50,
      this.mount.clientWidth / this.mount.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 30, 50);
    this.camera.lookAt(new Vector3(0, 0, 0));

    // Renderer
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true /*, canvas=this.canvas */,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.mount.clientWidth,
      this.mount.clientHeight,
      false
    );
    this.renderer.shadowMap.enabled = true;

    // Controles
    this.control = new OrbitControls(this.camera, this.mount);
    this.control.enableDamping = true;
    this.control.enabled = true;
    this.control.update();

    this.mount.appendChild(this.renderer.domElement);
  };

  // Genera elemento de suelo y rejilla
  //
  // ThreeJS: ejes X rojo, Y verde, Z azul
  initGround = () => {
    const groundGroup = new Group();
    groundGroup.name = "GroundGroup";

    // Suelo de soporte transparente
    const ground = new Mesh(
      new PlaneGeometry(200, 200, 100, 100),
      new ShadowMaterial({ color: 0x6c6c6c })
    );
    ground.name = "World_Ground";
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    groundGroup.add(ground);

    // Grid helper
    const gridHelper = new GridHelper(40, 40, 0x0000ff, 0x808080);
    gridHelper.position.set(0, 0, 0);
    // @ts-ignore
    gridHelper.material.setValues({ opacity: 0.25, transparent: true });
    groundGroup.add(gridHelper);

    // Axes helper
    groundGroup.add(new AxesHelper(10)); // X rojo, Y verde, Z azul

    // Añade elementos a la escena
    this.scene.add(groundGroup);
  };

  initLights = () => {
    const scene = this.scene;
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

  updateCamera = () => {
    const obj = this.scene.getObjectByName("BuildingGroup");
    let target;
    if (obj) {
      target = new THREE.Box3().setFromObject(obj);
    } else {
      target = new Vector3(0, 0, 0);
    }
    this.camera.lookAt(target);
  };

  // Actualiza entradas del controlador y renderiza
  animate = () => {
    this.renderRequested = false;
    if (this.control) this.control.update();
    this.resizeToDisplaySize();
    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.animate);
  };

  resizeToDisplaySize = () => {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  };

  // Gestiona entradas de teclado:
  // CTRL + ALT + g / p - oculta panel
  // CTRL + ALT + h - resitua cámara en su posición original
  // CTRL + ALT + i - Activa / desactiva modo de inspección de objetos
  // Para poder conectar este manejador en un elemento div es necesario fijar la
  // propiedad tabIndex=-1 (para que el elemento se sitúe fuera del flujo de foco de entrada)
  // Ver https://webaim.org/techniques/keyboard/tabindex
  keydown(e) {
    // CTRL + ALT + g || CTRL + ALT + p
    if (e.ctrlKey && e.altKey && (e.code === "KeyG" || e.code === "KeyP")) {
      if (this.gui) this.gui.toggle();
    }
    // CTRL + ALT + h
    if (e.ctrlKey && e.altKey && e.code === "KeyH") {
      if (this.control) this.control.reset();
    }
    // CTRL + ALT + i
    if (e.ctrlKey && e.altKey && e.code === "KeyI")
      if (this.gui) {
        this.gui.params.inspectMode = !this.gui.params.inspectMode;
        this.gui.pane.refresh();
      }
  }

  // Muestra, en modo de inspección, una lista con los objetos bajo la localización del puntero
  pointerdown(e) {
    if (this.gui.params.inspectMode === false) return;
    // Rectángulo del elemento
    var rect = this.mount.getBoundingClientRect();
    // Coordenadas dentro del elemento X: [0, rect.width], Y: [0, rect.height]
    const xCoord = e.clientX - rect.left;
    const yCoord = e.clientY - rect.top;
    // Coordenadas X: [-1, 1], Y: [-1, 1]
    const posX = (xCoord / rect.width) * 2 - 1;
    const posY = -(yCoord / rect.height) * 2 + 1;
    // Genera intersecciones, obteniendo lista de objetos de más próximo a más lejano
    const pointer3D = new Vector3(posX, posY, 0.5);
    const raycaster = new Raycaster();
    raycaster.setFromCamera(pointer3D, this.camera);
    const intersects = raycaster.intersectObjects(
      this.scene.getObjectByName("BuildingGroup").children
    );

    // Actualiza elemento de la interfaz
    const el = getTextElement(document);
    if (intersects.length > 0) {
      const objectNames = intersects.map((v) => v.object.name);
      this.setTextData(el, e.clientX, e.clientY, objectNames);
    } else {
      this.setTextData(el, e.clientX, e.clientY, []);
    }
  }

  setTextData(el, x, y, data) {
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
          this.gui.onselectedElementChange({ value: selected.textContent });
        };
        li.onmouseleave = (e) => {
          // @ts-ignore
          e.target.style.background = "none";
          this.gui.onselectedElementChange({
            value: this.gui.params.selectedElementName,
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
          this.gui.params.selectedElementName = selectedElement;
          this.gui.pane.refresh();
        };
        el.appendChild(li);
      }
    }
    el.style.left = x + "px";
    el.style.top = y + "px";
  }

  render() {
    return (
      <div style={{ position: "relative" }}>
        <div
          style={{ position: "absolute", top: 0, left: 0, width: "25%" }}
          ref={(ref) => (this.guipane = ref)}
        />
        {/* Tabindex es necesario para recibir eventos de teclado en un div */}
        <div
          style={style}
          ref={(ref) => (this.mount = ref)}
          onPointerDown={this.pointerdown.bind(this)}
          tabIndex={-1}
          onKeyDown={this.keydown.bind(this)}
        />
      </div>
    );
  }
}

// Devuelve o genera el elemento de texto en la interfaz
function getTextElement(document) {
  const el = document.getElementById("inspect_dom_element");
  if (el) {
    return el;
  } else {
    const el = document.createElement("ul");
    el.id = "inspect_dom_element";
    el.style.margin = "0";
    el.style.padding = "0";
    el.style.position = "absolute";
    el.style.color = "black";
    el.style.background = "#ffffffAA";
    el.style.font = "13px Arial, Verdana, sans-serif";
    el.style.zIndex = "100";
    el.style.display = "block";
    document.body.appendChild(el);
    return el;
  }
}

const ThreeView = observer(() => {
  const appstate = useContext(AppState);
  const {
    // meta,
    walls,
    windows,
    shades,
  } = appstate;
  return (
    <Viewport
      model={{
        // meta: {...meta},
        walls: walls.slice(),
        windows: windows.slice(),
        shades: shades.slice(),
      }}
    />
  );
});

export default ThreeView;
