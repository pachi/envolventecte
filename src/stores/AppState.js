import { observable, action, computed } from 'mobx';

const zoneslist = ['A1c', 'A2c', 'A3c', 'A4c',
                   'Alfa1c', 'Alfa2c', 'Alfa3c', 'Alfa4c',
                   'B1c', 'B2c', 'B3c', 'B4c', 'C1c', 'C2c', 'C3c', 'C4c',
                   'D1c', 'D2c', 'D3c', 'E1c',
                   'A3', 'A4', 'B3', 'B4', 'C1', 'C2', 'C3', 'C4',
                   'D1', 'D2', 'D3', 'E1'];

export default class AppState {
  @observable climate = 'D3'
  @observable orientation = 0
  @observable tilt = 90

  @action setClimate(climate) {
    this.climate = climate;
  }

  @computed get tiltplusone() {
    return this.tilt + 1;
  }
  // increment() {
  //   this.count++;
  // }

  // decrement() {
  //   this.count--;
  // }
}
