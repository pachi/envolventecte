use std::{collections::BTreeMap, convert::TryFrom};

use anyhow::Error;
use bemodel::{self, climatedata, KDetail, Model, N50HEDetail, UValues, Warning, VERSION};
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

/// Estructura que contiene los resultados del cálculo
#[allow(non_snake_case)]
#[derive(Debug, Serialize, Deserialize, Default)]
struct IndicatorsReport {
    area_ref: f32,
    compacity: f32,
    K: KDetail,
    u_values: UValues,
    qsoljul: f32,
    n50: f32,
    n50_he2019: N50HEDetail,
    C_o: f32,
    C_o_he2019: f32,
    vol_env_net: f32,
    vol_env_gross: f32,
    warnings: Vec<Warning>,
}

/// Calcula indicadores usando funciones de hulc2envolventecte y prepara una estructura para enviar a JS
fn compute_indicators(model: &Model) -> Result<IndicatorsReport, Error> {
    let climatezone = model.meta.climate;
    let totradjul = climatedata::total_radiation_in_july_by_orientation(&climatezone);
    let report = IndicatorsReport {
        area_ref: model.a_ref(),
        compacity: model.compacity(),
        K: model.K_he2019(),
        u_values: model.u_values(),
        qsoljul: model.q_soljul(&totradjul),
        n50: model.n50(),
        n50_he2019: model.n50_he2019(),
        C_o: model.C_o(),
        C_o_he2019: model.C_o_he2019(),
        vol_env_net: model.vol_env_net(),
        vol_env_gross: model.vol_env_gross(),
        warnings: model.check_model(),
    };
    Ok(report)
}

/// Calcula indicadores de HE1
///
#[wasm_bindgen]
pub fn he1_indicators(model_js: &JsValue) -> Result<JsValue, JsValue> {
    let model: Model = model_js.into_serde().map_err(|e| e.to_string())?;
    let indicators: IndicatorsReport = compute_indicators(&model).map_err(|e| e.to_string())?;
    let js_indicators = JsValue::from_serde(&indicators).map_err(|e| e.to_string())?;
    Ok(js_indicators)
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

/// Carga datos desde cadena de texto .ctehexml
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
