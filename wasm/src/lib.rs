use std::{collections::{BTreeMap, HashMap}, convert::TryFrom};

use bemodel::{self, climatedata, KData, Model, N50Data, QSolJulData, UValues, Warning, VERSION};
use hulc::{ctehexml, kyg};
use serde::{Deserialize, Serialize};
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

/// Carga datos de radiación acumulada mensual
#[wasm_bindgen]
pub fn get_july_radiation_data() -> Result<JsValue, JsValue> {
    let data = climatedata::JULYRADDATA.lock().unwrap().clone();
    let res = JsValue::from_serde(&data).map_err(|e| e.to_string())?;
    Ok(res)
}

/// Estructura que contiene los resultados del cálculo
#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize, Default)]
struct IndicatorsReport {
    area_ref: f32,
    compacity: f32,
    vol_env_net: f32,
    vol_env_gross: f32,
    u_values: UValues,
    K_data: KData,
    q_soljul_data: QSolJulData,
    n50_data: N50Data,
    warnings: Vec<Warning>,
}

/// Calcula indicadores de HE1
#[wasm_bindgen]
pub fn he1_indicators(model_js: &JsValue) -> Result<JsValue, JsValue> {
    let model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
    let climatezone = model.meta.climate;
    let totradjul = climatedata::total_radiation_in_july_by_orientation(&climatezone);
    let indicators: IndicatorsReport = IndicatorsReport {
        area_ref: model.a_ref(),
        compacity: model.compacity(),
        u_values: model.u_values(),
        K_data: model.K(),
        q_soljul_data: model.q_soljul(&totradjul),
        n50_data: model.n50(),
        vol_env_net: model.vol_env_net(),
        vol_env_gross: model.vol_env_gross(),
        warnings: model.check_model(),
    };
    let js_indicators = JsValue::from_serde(&indicators).map_err(|e| e.to_string())?;
    Ok(js_indicators)
}

/// Actualiza factor de reducción por obstáculos remotos
#[wasm_bindgen]
pub fn update_fshobst(model_js: &JsValue) -> Result<JsValue, JsValue> {
    let mut model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
    model.update_fshobst();
    let res = JsValue::from_serde(&model).map_err(|e| e.to_string())?;
    Ok(res)
}

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
