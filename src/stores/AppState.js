import { extendObservable, action } from 'mobx';

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
          this.climate = climate;
        })
      }
    );
  }
}
