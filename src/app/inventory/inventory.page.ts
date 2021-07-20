import { templateJitUrl } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

declare const cordova: any
@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {
  cardlist: any[] = [];
  searchCardFlag = false;
  tempDatas: any = [];
  power = 30;
  constructor(
    private storage: Storage,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.load();
  }

  async load() {
    this.tempDatas = await this.storage.get('datas');
    cordova.plugin.hardwearKey.startListen(
      res => {
        if (res.keyDown && res.keyCode === 134) {
          if (!this.searchCardFlag) {
            this.startSearchCard();
          } else if (this.searchCardFlag) {
            this.stopSearchCard();
          }
        }
      }, err => {
        console.log(err);
      }
    );
  }

  searchCard() {
    cordova.plugin.uhf.searchCard(res => {
      console.log(res);
      let removeFlag = false;
      for (const _card of res) {
        for (const data of this.tempDatas) {
          if (_card.mEpcBytes === data.mEpcBytes) {
            removeFlag = false;
            for (const c of this.cardlist) {
              for (const epc of c.mEpcBytes) {
                if (epc === _card.mEpcBytes) {
                  removeFlag = true;
                  break;
                }
                if (removeFlag) {break;}
              }
            }
            if (!removeFlag) {
              let countFlag = false;
              for (const c of this.cardlist) {
                countFlag = false;
                if (c.name === data.name) {
                  countFlag = true;
                  c.count++;
                  c.pdtime.push(new Date());
                  c.attr1.push(data.attr1)
                  c.mEpcBytes.push(data.mEpcBytes);
                  break;
                }
              }
              console.log(data);
              if (!countFlag) {
                this.cardlist.push(
                  {
                    name: data.name,
                    mEpcBytes: [_card.mEpcBytes],
                    attr1: [data.attr1],
                    pdtime: [new Date()],
                    count: 1
                  }
                )
              }
            }
            break;
          }
        }
      }
      this.ref.detectChanges();
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
      this.cardlist = [];
      this.searchCardFlag = true;
      this.ref.detectChanges();
      this.searchCard();
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
