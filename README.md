# Indicadores de envolvente térmica para la aplicación del CTE DB-HE

Esta aplicación permite el cálculo de algunos indicadores de calidad de la envolvente térmica definidos en el CTE DB-HE (2018):

- **Transmitancia térmica global** (**K**)
- **Control solar** (**q<sub>sol;jul</sub>**)

Además de los indicadores anteriores, la aplicación calcula, para superficies inclinadas y orientadas, valores de otros parámetros interesantes para el diseño energético de los edificios y su envolvente térmica como la **irradiación solar acumulada mensual** y el **factor de reducción para sombreamientos solares móviles**.

La aplicación está disponible en línea en la web [http://pachi.github.io/envolventecte](http://pachi.github.io/envolventecte)

Esta aplicación ha sido desarrollada por el equipo de energía del <i>Instituto Eduardo Torroja de Ciencias de la Construcción (IETcc-CSIC)</i>:

- Rafael Villar Burke (pachi)
- Daniel Jiménez González
- Marta Sorribes Gil

## Indicadores de calidad de la envolvente térmica

El cálculo de los indicadores de calidad en la envolvente térmica se basa en los indicadores descritos en la *UNE EN ISO 13790:2008* (e *ISO/FDIS 52016‐1*).

- El indicador de **transmitancia térmica global** (**K**) se basa en el coeficiente global de      transmisión de calor (**H<sub>tr,adj</sub>**, apartado 8.3.1, ec. 17 de la *UNE EN ISO 13790:2008* y apartado 6.6.5.2, ec. 108 de la *ISO/FDIS 52016-1*) repercutido por la superficie de intercambio con el exterior.<br /> Mide la capacidad global de evitar el intercambio de calor por conducción.

- El indicador de **control solar** (**q<sub>sol;jul</sub>**) se basa en el flujo de calor por ganancias solares, *Φ<sub>sol;k</sub>*, (apartado 11.3.2, ec. 43 de la *UNE EN ISO 13790:2008* y apartado 6.5.13.2, ec. 69 de la *ISO/FDIS 52016-1*), despreciando la reirradiación al cielo, repercutido por la superficie útil considerada y considerando activadas las protecciones solares móviles.<br /> Mide la posibilidad de controlar las ganancias solares (incluyendo el uso de dispositivos solares móviles y el efecto de otros obstáculos fijos o remotos).

## Datos de radiación por superficies

La aplicación calcula, para superficies inclinadas y orientadas, valores de los siguientes parámetros:

- **Irradiación acumulada mensual** (**H<sub>sol;m</sub>**), incluyendo la **irradiación acumulada en el mes de julio** (**H<sub>sol;jul</sub>**)
- **Factor de reducción para sombreamientos solares móviles** (**f<sub>sh;with</sub>**) de superficies inclinadas y orientadas.

Los cálculos para las distintas orientaciones y climas usan valores obtenidos a partir de los archivos climáticos de referencia del *CTE DB-HE*, disponibles en [este enlace](http://www.codigotecnico.org/images/stories/pdf/ahorroEnergia/CTEdatosMET_20140418.zip), y el procedimiento de la norma *ISO/FDIS 52010‐1:2016*.
