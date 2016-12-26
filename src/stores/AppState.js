import { extendObservable, action } from 'mobx';
import 'whatwg-fetch';

import { met, soljs } from 'soljs';

export default class AppState {
  constructor() {
    extendObservable(
      this,
      {
        climate: null,
        metdata: null,
        /* get tiltplusone() {
         *   return this.tilt + 1;
         * },*/
        setClimate: action((climate) => {
          fetch(`/climas/zona${ climate }.met`)
            .then(response => response.text())
            .then(text => met.parsemet(text))
            .then(metdata => {
              this.metdata = metdata;
              this.climate = climate;
            });
        })
      }
    );
  }
}
