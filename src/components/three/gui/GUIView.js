import { Pane } from "tweakpane";
import { MeshLambertMaterial, DoubleSide, Plane, Vector3, Box3 } from "three";

// Material doble cara - azul
const material_select = new MeshLambertMaterial({
  color: 0xff4444,
  side: DoubleSide,
});

// Plano para clipping global (por render)
// Podría haber un clipping local (por material)
// https://stackoverflow.com/a/36558152
// Para una gestión más completa de un plano Z ver
// https://github.com/agviegas/IFC.js/commit/9be223de323e6acd936d9493eda5753a4ffe8183
const globalClippingPlane = new Plane(new Vector3(0, -1, 0), 1);

export default class GUIView {
  constructor(renderer, scene, containerRef) {
    this.renderer = renderer;
    this.scene = scene;

    this.params = {
      inspectMode: false,
      opacity: 1.0,
      selectedElementName: "",
      showExteriorRoofs: true,
      showExteriorWalls: true,
      showExteriorFloors: true,
      showExteriorWindows: true,
      showInteriorWalls: true,
      showGroundWalls: true,
      showAdiabaticWalls: true,
      showShades: true,
      zClipping: false,
      zClippingValue: 0.5,
    };
    this.lastSelected = null;

    this.initPane(containerRef.current);
    this.pane.hidden = false;
  }

  dispose() {
    this.pane.dispose();
  }

  initPane(container) {
    this.pane = new Pane({
      title: "Visor EnvolventeCTE",
      expanded: false,
      container,
    });

    // Apartado de inspección
    const folder = this.pane.addFolder({ title: "Inspección de elementos" });
    // TODO: modo de renderizado (transmitancia, condiciones de contorno)
    // folder.addInput(this, 'renderSelected', { label: 'render', options: this.renderOptions }).on('change', this.onRenderChange.bind(this));
    folder.addInput(this.params, "inspectMode", {
      label: "Modo de inspección",
    });
    folder
      .addInput(this.params, "selectedElementName", {
        label: "Resalta elemento",
      })
      .on("change", this.onselectedElementChange.bind(this));

    // Apartado de visualización
    const folder2 = this.pane.addFolder({
      title: "Visualización",
    });

    folder2
      .addInput(this.params, "opacity", {
        label: "Opacidad",
        min: 0.0,
        max: 1.0,
        step: 0.1,
      })
      .on("change", this.onOpacityChange.bind(this));

    folder2
      .addInput(this.params, "showExteriorRoofs", {
        label: "Cubiertas exteriores",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showExteriorWalls", {
        label: "Muros exteriores",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showExteriorFloors", {
        label: "Suelos exteriores",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showExteriorWindows", {
        label: "Huecos exteriores",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showInteriorWalls", {
        label: "Elementos interiores",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showGroundWalls", {
        label: "Elementos terreno",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showAdiabaticWalls", {
        label: "Elementos Adiabáticos",
      })
      .on("change", this.onVisibilityChange.bind(this));

    folder2
      .addInput(this.params, "showShades", {
        label: "Sombras",
      })
      .on("change", this.onVisibilityChange.bind(this));

    // Apartado de clipping
    const folder3 = this.pane.addFolder({
      title: "Sección por plano Z",
    });
    folder3
      .addInput(this.params, "zClipping", {
        label: "Cortar por plano Z",
      })
      .on("change", () => {
        if (this.params.zClipping) {
          // Se activa el corte por plano Z
          this.renderer.clippingPlanes = [globalClippingPlane];

          // Calcula valores extremos de Z (-Y en threejs) y fija max - 2 como punto de corte
          const bbox = new Box3().setFromObject(
            this.scene.getObjectByName("BuildingGroup")
          );
          const zCut = Math.round(bbox.max.y) - 2;
          this.params.zClippingValue = zCut;
          globalClippingPlane.setComponents(0, -zCut, 0, 1);

          // Genera slider para seleccionar altura de corte
          this.clippingValueController = folder3
            .addInput(this.params, "zClippingValue", {
              label: "Cota (Z) de corte",
              min: Math.round(bbox.min.y) - 1,
              max: Math.round(bbox.max.y) + 1,
              step: 0.25,
            })
            .on("change", (event) => {
              globalClippingPlane.setComponents(0, -event.value, 0, 1);
            });
        } else {
          // Se desactiva el corte por plano Z
          this.renderer.clippingPlanes = [];
          this.clippingValueController.dispose();
        }
      });
  }

  toggle() {
    if (!this.pane.hidden) {
      this.pane.hidden = true;
    } else {
      this.pane.hidden = false;
    }
  }

  onOpacityChange(event) {
    const buildingObjects = this.scene.getObjectByName("BuildingGroup");
    buildingObjects.traverse((child) => {
      if (child.material && child.userData.type !== "Window") {
        child.material.opacity = event.value;
      }
    });
  }

  onselectedElementChange(event) {
    // Limpia última selección
    if (this.lastSelected) {
      this.lastSelected.material = this.lastSelected.userData.oldMaterial;
    }
    // Selecciona nuevo elemento
    const element = this.scene
      .getObjectByName("BuildingGroup")
      .getObjectByName(event.value);
    if (element) {
      this.lastSelected = element;
      this.lastSelected.userData.oldMaterial = element.material;
      element.material = material_select;
    }
  }

  onVisibilityChange(event) {
    // "showExteriorFloors","showExteriorWindows","showInteriorWalls","showGroundWalls","showAdiabaticWalls","showShades",
    const key = event.presetKey;
    let selector;
    if (key === "showExteriorRoofs") {
      selector = (bounds, type, subtype) =>
        bounds === "EXTERIOR" && type === "Wall" && subtype === "ROOF";
    } else if (key === "showExteriorWalls") {
      selector = (bounds, type, subtype) =>
        bounds === "EXTERIOR" && type === "Wall" && subtype === "WALL";
    } else if (key === "showExteriorFloors") {
      selector = (bounds, type, subtype) =>
        bounds === "EXTERIOR" && type === "Wall" && subtype === "FLOOR";
    } else if (key === "showExteriorWindows") {
      selector = (bounds, type, _subtype) =>
        bounds === "EXTERIOR" && type === "Window";
    } else if (key === "showInteriorWalls") {
      selector = (bounds, _type, _subtype) => bounds === "INTERIOR";
    } else if (key === "showGroundWalls") {
      selector = (bounds, _type, _subtype) => bounds === "GROUND";
    } else if (key === "showAdiabaticWalls") {
      selector = (bounds, _type, _subtype) => bounds === "ADIABATIC";
    } else if (key === "showShades") {
      selector = (_bounds, type, _subtype) => type === "Shade";
    } else {
      return;
    }
    const buildingObjects = this.scene.getObjectByName("BuildingGroup");
    buildingObjects.traverse((child) => {
      const {
        userData: { bounds, type, subtype },
      } = child;
      if (selector(bounds, type, subtype)) {
        child.visible = event.value;
      }
    });
  }
}
