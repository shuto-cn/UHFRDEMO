import { Injectable } from '@angular/core';

declare const cordova: any;
@Injectable({
  providedIn: 'root'
})
export class HardwearKeyService {

  callback: Function;
  listenerFlag = false;
  constructor() { }

  public setListener(callback: Function) {
    console.log(callback);
    this.callback = callback;
    if (!this.listenerFlag) {
      this.listenerFlag = true;
      cordova.plugin.hardwearKey.startListen(this.callback);
    } else {
      cordova.plugin.hardwearKey.stopListen(res => {
        this.listenerFlag = false;
        cordova.plugin.hardwearKey.startListen(this.callback);
      });
    }
  }
}
