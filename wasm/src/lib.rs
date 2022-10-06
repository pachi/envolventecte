use std::{collections::BTreeMap, convert::TryFrom};

use bemodel::{self, climatedata, Model, VERSION};
use hulc::{ctehexml, kyg};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just
    // `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen]
pub fn get_version() -> String {
    VERSION.to_string()
}

#[wasm_bindgen]
pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

#[wasm_bindgen]
#[allow(unused_variables)]
pub fn set_log_hook(level: &str) {
    // When the `console_log` feature is enabled, we can call the
    // `set_log_hook` function at least once during initialization, and then
    // we will get our log messages redirected to the console..
    //
    // For more details see
    // https://crates.io/crates/console_log
    #[cfg(feature = "console_log")]
    console_log::init_with_level(match level {
        "trace" => log::Level::Trace,
        "debug" => log::Level::Debug,
        "info" => log::Level::Info,
        "warn" => log::Level::Warn,
        _ => log::Level::Error,
    })
    .expect("error initializing log");
}

/// Carga datos de radiación acumulada mensual
#[wasm_bindgen]
pub fn get_monthly_radiation_data() -> Result<JsValue, JsValue> {
    let data = climatedata::MONTHLYRADDATA.lock().unwrap().clone();
    let res = JsValue::from_serde(&data).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Calcula indicadores de HE1
#[wasm_bindgen]
pub fn energy_indicators(model_js: &JsValue) -> Result<JsValue, JsValue> {
    let model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
    let indicators = model.energy_indicators();
    let js_indicators = JsValue::from_serde(&indicators).map_err(|e| e.to_string())?;
    Ok(js_indicators)
}

// /// Actualiza factor de reducción por obstáculos remotos
// #[wasm_bindgen]
// pub fn update_fshobst(model_js: &JsValue) -> Result<JsValue, JsValue> {
//     let mut model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
//     model.update_fshobst();
//     let res = JsValue::from_serde(&model).map_err(|e| e.to_string())?;
//     Ok(res)
// }

/// Carga datos desde cadena de texto JSON
#[wasm_bindgen]
pub fn load_data_from_json(data: &str) -> Result<JsValue, JsValue> {
    let model = Model::from_json(data).map_err(|e| e.to_string())?;
    let res = JsValue::from_serde(&model).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Carga datos desde cadena de texto .ctehexml
#[wasm_bindgen]
pub fn load_data_from_ctehexml(data: &str) -> Result<JsValue, JsValue> {
    let ctehexmldata = ctehexml::parse_with_catalog(data).map_err(|e| e.to_string())?;
    let model = Model::try_from(&ctehexmldata).map_err(|e| e.to_string())?;
    let res = JsValue::from_serde(&model).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Carga datos desde cadena de texto KyGananciasSolares.txt
#[wasm_bindgen]
pub fn load_fshobst_data_from_kyg(data: &str) -> Result<JsValue, JsValue> {
    let kygdata = kyg::parse(data).map_err(|e| e.to_string())?;
    let fshobst: BTreeMap<String, f32> = kygdata
        .windows
        .iter()
        .map(|(name, win)| (name.clone(), win.fshobst))
        .collect();
    let res = JsValue::from_serde(&fshobst).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Espacio por defecto
#[wasm_bindgen]
pub fn new_space() -> JsValue {
    JsValue::from_serde(&bemodel::Space::default()).unwrap()
}

/// Opaco por defecto
#[wasm_bindgen]
pub fn new_wall() -> JsValue {
    JsValue::from_serde(&bemodel::Wall::default()).unwrap()
}

/// Hueco por defecto
#[wasm_bindgen]
pub fn new_window() -> JsValue {
    JsValue::from_serde(&bemodel::Window::default()).unwrap()
}

/// Sombra por defecto
#[wasm_bindgen]
pub fn new_shade() -> JsValue {
    JsValue::from_serde(&bemodel::Shade::default()).unwrap()
}

/// Puente térmico por defecto
#[wasm_bindgen]
pub fn new_thermalbridge() -> JsValue {
    JsValue::from_serde(&bemodel::ThermalBridge::default()).unwrap()
}

/// Construcción de opaco por defecto
#[wasm_bindgen]
pub fn new_wallcons() -> JsValue {
    JsValue::from_serde(&bemodel::WallCons::default()).unwrap()
}

/// Construcción de hueco por defecto
#[wasm_bindgen]
pub fn new_wincons() -> JsValue {
    JsValue::from_serde(&bemodel::WinCons::default()).unwrap()
}

/// Material de opaco por defecto
#[wasm_bindgen]
pub fn new_material() -> JsValue {
    JsValue::from_serde(&bemodel::Material::default()).unwrap()
}

/// Vidrio por defecto
#[wasm_bindgen]
pub fn new_glass() -> JsValue {
    JsValue::from_serde(&bemodel::Glass::default()).unwrap()
}

/// Marco por defecto
#[wasm_bindgen]
pub fn new_frame() -> JsValue {
    JsValue::from_serde(&bemodel::Frame::default()).unwrap()
}

/// Metadatos por defecto
#[wasm_bindgen]
pub fn new_meta() -> JsValue {
    JsValue::from_serde(&bemodel::Meta::default()).unwrap()
}

/// Carga por defecto
#[wasm_bindgen]
pub fn new_load() -> JsValue {
    JsValue::from_serde(&bemodel::SpaceLoads::default()).unwrap()
}

/// Consignas por defecto
#[wasm_bindgen]
pub fn new_sys_setting() -> JsValue {
    JsValue::from_serde(&bemodel::SpaceSysConditions::default()).unwrap()
}
