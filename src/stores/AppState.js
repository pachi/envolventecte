import { extendObservable, action } from 'mobx';
import 'whatwg-fetch';

import { met, soljs } from 'soljs';

export default class AppState {
  constructor() {
    extendObservable(
      this,
      {
        climate: 'D3',
        metdata: null,
        orientation: 0,
        tilt: 90,
        get tiltplusone() {
          return this.tilt + 1;
        },
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
