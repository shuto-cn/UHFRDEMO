import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HardwearKeyService } from '../services/hardwear-key.service';

declare const cordova: any
@Component({
  selector: 'app-asset',
  templateUrl: './asset.page.html',
  styleUrls: ['./asset.page.scss'],
})
export class AssetPage implements OnInit {
  assetMsg: any;
  searchCardFlag = false;
  tempDatas: any = [];
  power = 30;
  constructor(
    private storage: Storage,
    private ref: ChangeDetectorRef,
    private hardwearKey: HardwearKeyService
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.tempDatas = await this.storage.get('datas');
    console.log(this.tempDatas);
    this.hardwearKey.setListener(this.listener.bind(this));
  }

  listener(res) {
    console.log(res);
    if (res.keyDown && res.keyCode === 134) {
      if (!this.searchCardFlag) {
        this.startSearchCard();
      } else if (this.searchCardFlag) {
        this.stopSearchCard();
      }
    }
  }

  searchCard() {
    cordova.plugin.uhf.searchCard(res => {
      console.log('res', res);
      if (res.length > 0) {
        this.searchCardFlag = false;
        let flag = false;
        this.assetMsg = null;
        for (const data of this.tempDatas) {
          for (const r of res) {
            if (data.mEpcBytes === r.mEpcBytes) {
              this.assetMsg = data;
              this.ref.detectChanges();
              flag = true;
            }
          }
          if (flag) { break; }
        }
      }
      console.log('assetMsg', this.assetMsg);
      if (this.searchCardFlag) {
        setTimeout(() => {
          this.searchCard();
        }, 300);
      } else {
        return;
      }
    }, err => { console.log(err); });
  }
  startSearchCard() {
    cordova.plugin.uhf.setPower(this.power, res => {
      console.log(res);
      this.assetMsg = null;
      this.searchCardFlag = true;
      this.searchCard();
      this.ref.detectChanges();
    }, err => { console.log(err); })
  }
  stopSearchCard() {
    this.searchCardFlag = false;
    this.ref.detectChanges();
  }

  ionViewWillLeave() {
    this.stopSearchCard();
    cordova.plugin.hardwearKey.stopListen();
  }
}
