# Indicadores de envolvente térmica para la aplicación del CTE DB-HE

Aplicación para el cálculo de indicadores de eficiencia energética de la envolvente térmica.

A partir de una descripción de la envolvente (de sus parámetros energéticos básicos) y la zona climática del edificio, la aplicación calcula los indicadores definidos en el CTE DB-HE (2018):

* **Transmitancia térmica global** (**K**)
* **Control solar** (**q<sub>sol;jul</sub>**)

También permite consultar otros parámetros relacionados con la radiación solar de superficies inclinadas y orientadas, como la **irradiación solar acumulada mensual**, el **factor de reducción para sombreamientos solares móviles** o el **factor solar de los huecos teniendo en cuenta las sombreamientos solares móviles**.

La aplicación está disponible en línea en la web [http://pachi.github.io/envolventecte](http://pachi.github.io/envolventecte) y ha sido desarrollada por el equipo de energía del <i>Instituto Eduardo Torroja de Ciencias de la Construcción (IETcc-CSIC)</i>:

* Rafael Villar Burke (pachi)
* Daniel Jiménez González
* Marta Sorribes Gil

## Definición de la envolvente térmica e indicadores relacionados

La aplicación permite describir la envolvente térmica a partir de sus componentes (huecos, opacos y puentes térmicos) y realiza el cálculo de los indicadores de calidad en la envolvente térmica definidos en el CTE DB-HE.

* El indicador de **transmitancia térmica global** (**K**) se basa en el coeficiente global de transmisión de calor (**H<sub>tr,adj</sub>**, apartado 8.3.1, ec. 17 de la _UNE EN ISO 13790:2008_ y apartado 6.6.5.2, ec. 108 de la _ISO/FDIS 52016-1_) repercutido por la superficie de intercambio con el exterior.<br /> Mide la capacidad global de evitar el intercambio de calor por conducción.

* El indicador de **control solar** (**q<sub>sol;jul</sub>**) se basa en el flujo de calor por ganancias solares, _Φ<sub>sol;k</sub>_, (apartado 11.3.2, ec. 43 de la _UNE EN ISO 13790:2008_ y apartado 6.5.13.2, ec. 69 de la _ISO/FDIS 52016-1_), despreciando la reirradiación al cielo, repercutido por la superficie útil considerada y considerando activadas las protecciones solares móviles.<br /> Mide la posibilidad de controlar las ganancias solares (incluyendo el uso de dispositivos solares móviles y el efecto de otros obstáculos fijos o remotos).

## Datos relacionados con el clima

La aplicación calcula, para superficies inclinadas y orientadas, valores de los siguientes parámetros:

* **Irradiación acumulada mensual** (**H<sub>sol;m</sub>**);
* **irradiación acumulada en el mes de julio** (**H<sub>sol;jul</sub>**);
* **Factor de reducción para sombreamientos solares móviles** (**f<sub>sh;with</sub>**).

Los cálculos para las distintas orientaciones y climas usan valores obtenidos a partir de los archivos climáticos de referencia del _CTE DB-HE_, disponibles en [este enlace](http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip), y el procedimiento de la norma _ISO/FDIS 52010‐1:2016_.

## Elementos de la envolvente térmica

La aplicación permite obtener algunos parámetros descriptivos del comportamiento térmico de elementos de la envolvente térmica a partir de sus características generales o parámetros de diseño.

Por ejemplo, para los huecos se puede obtener: la transmitancia térmica (U), el factor solar del vidrio a incidencia normal (g<sub>gl;n</sub>), el factor solar del hueco (g<sub>gl;wi</sub>), el factor solar del hueco teniendo en cuenta los sombreamientos solares móviles (g<sub>gl;sh;wi</sub>).

## Licencia

Esta aplicación es software libre y se distribuye bajo las condiciones de la licencia MIT. Vea el archivo LICENSE.txt para el texto de la licencia completo.
