use std::{collections::BTreeMap, convert::TryFrom};

use serde::Serialize;
use serde_wasm_bindgen::{from_value};
use wasm_bindgen::prelude::*;

use bemodel::{self, Model, VERSION, Warning, climatedata};
use hulc::{ctehexml, kyg};

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

/// Tipo para intercambio de modelo y sus avisos
#[derive(Serialize)]
struct ModelWithWarnings {
    pub model: Model,
    pub warnings: Vec<Warning>,
}

fn to_value<T>(value: &T) -> Result<JsValue, JsValue>
where
    T: Serialize,
{
    let ser = serde_wasm_bindgen::Serializer::json_compatible();
    let res = value.serialize(&ser).map_err(|e| e.to_string())?;
    Ok(res)
}

// Funciones exportadas

/// Carga datos de radiación acumulada mensual
#[wasm_bindgen]
pub fn get_monthly_radiation_data() -> Result<JsValue, JsValue> {
    let data = climatedata::MONTHLYRADDATA.lock().unwrap().clone();
    let ser = serde_wasm_bindgen::Serializer::json_compatible();
    let res = data.serialize(&ser).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Calcula indicadores de HE1
#[wasm_bindgen]
pub fn energy_indicators(model_js: JsValue) -> Result<JsValue, JsValue> {
    let model: Model = from_value(model_js).map_err(|e| e.to_string())?;
    to_value(&model.energy_indicators())
}

// /// Actualiza factor de reducción por obstáculos remotos
// #[wasm_bindgen]
// pub fn update_fshobst(model_js: &JsValue) -> Result<JsValue, JsValue> {
//     let mut model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
//     model.update_fshobst();
//     to_value(&model)
// }

/// Carga datos desde cadena de texto JSON
#[wasm_bindgen]
pub fn load_data_from_json(data: &str, purge_unused: bool) -> Result<JsValue, JsValue> {
    let mut model = Model::from_json(data).map_err(|e| e.to_string())?;
    let warnings = if purge_unused {
        bemodel::purge_unused(&mut model)
    } else {
        vec![]
    };
    to_value(&ModelWithWarnings { model, warnings })
}

/// Carga datos desde cadena de texto .ctehexml
#[wasm_bindgen]
pub fn load_data_from_ctehexml(data: &str, purge_unused: bool) -> Result<JsValue, JsValue> {
    let ctehexmldata = ctehexml::parse_with_catalog(data).map_err(|e| e.to_string())?;
    let mut model = Model::try_from(&ctehexmldata).map_err(|e| e.to_string())?;
    let warnings = if purge_unused {
        bemodel::purge_unused(&mut model)
    } else {
        vec![]
    };
    to_value(&ModelWithWarnings { model, warnings })
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
    to_value(&fshobst)
}

/// Limpia modelo de elementos no usados
#[wasm_bindgen]
pub fn purge_unused(model_js: JsValue) -> Result<JsValue, JsValue> {
    let mut model: Model = from_value(model_js).map_err(|e| e.to_string())?;
    let warnings = bemodel::purge_unused(&mut model);
    to_value(&ModelWithWarnings { model, warnings })
}

/// Espacio por defecto
#[wasm_bindgen]
pub fn new_space() -> JsValue {
    to_value(&bemodel::Space::default()).unwrap()
}

/// Opaco por defecto
#[wasm_bindgen]
pub fn new_wall() -> JsValue {
    to_value(&bemodel::Wall::default()).unwrap()
}

/// Hueco por defecto
#[wasm_bindgen]
pub fn new_window() -> JsValue {
    to_value(&bemodel::Window::default()).unwrap()
}

/// Sombra por defecto
#[wasm_bindgen]
pub fn new_shade() -> JsValue {
    to_value(&bemodel::Shade::default()).unwrap()
}

/// Puente térmico por defecto
#[wasm_bindgen]
pub fn new_thermalbridge() -> JsValue {
    to_value(&bemodel::ThermalBridge::default()).unwrap()
}

/// Construcción de opaco por defecto
#[wasm_bindgen]
pub fn new_wallcons() -> JsValue {
    to_value(&bemodel::WallCons::default()).unwrap()
}

/// Construcción de hueco por defecto
#[wasm_bindgen]
pub fn new_wincons() -> JsValue {
    to_value(&bemodel::WinCons::default()).unwrap()
}

/// Material de opaco por defecto
#[wasm_bindgen]
pub fn new_material() -> JsValue {
    to_value(&bemodel::Material::default()).unwrap()
}

/// Vidrio por defecto
#[wasm_bindgen]
pub fn new_glass() -> JsValue {
    to_value(&bemodel::Glass::default()).unwrap()
}

/// Marco por defecto
#[wasm_bindgen]
pub fn new_frame() -> JsValue {
    to_value(&bemodel::Frame::default()).unwrap()
}

/// Metadatos por defecto
#[wasm_bindgen]
pub fn new_meta() -> JsValue {
    to_value(&bemodel::Meta::default()).unwrap()
}

/// Carga por defecto
#[wasm_bindgen]
pub fn new_load() -> JsValue {
    to_value(&bemodel::SpaceLoads::default()).unwrap()
}

/// Consignas por defecto
#[wasm_bindgen]
pub fn new_thermostat() -> JsValue {
    to_value(&bemodel::Thermostat::default()).unwrap()
}

/// Horario diario por defecto
#[wasm_bindgen]
pub fn new_schedule_day() -> JsValue {
    to_value(&bemodel::ScheduleDay::default()).unwrap()
}

/// Horario semanal por defecto
#[wasm_bindgen]
pub fn new_schedule_week() -> JsValue {
    to_value(&bemodel::ScheduleWeek::default()).unwrap()
}

/// Horario anual por defecto
#[wasm_bindgen]
pub fn new_schedule_year() -> JsValue {
    to_value(&bemodel::Schedule::default()).unwrap()
}
