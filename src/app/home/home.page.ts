import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HardwearKeyService } from '../services/hardwear-key.service';

declare const cordova: any
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  searchCardFlag = false;
  card: any;
  msg: string;
  power = 30;
  constructor(
    private storage: Storage,
    private navCtrl: NavController,
    private ref: ChangeDetectorRef,
    private hardwearKey: HardwearKeyService
  ) {
    this.load();
  }

  ionViewWillLeave() {
    this.stopSearchCard();
    this.hardwearKey.setListener(null);
  }

  async load() {
    const tempDatas = await this.storage.get('datas');
    if (!tempDatas) {
      this.storage.set('datas', [
        {
          mEpcBytes: "2000001D940501890830A7A6",
          name: '鼓风机',
          attr1: 'A-1',
          attr2: 'EP03-B',
          attr3: '2021年3月4日'
        },
        {
          mEpcBytes: "E200001D940501880920A57A",
          name: '启动阀',
          attr1: 'A-3',
          attr2: 'EPPSF2',
          attr3: '2015年11月15日'
        },
        {
          mEpcBytes: "000022223333444455556666",
          name: '步进电机',
          attr1: 'A-4',
          attr2: 'M-2220',
          attr3: '2019年5月1日'
        }
      ]);
    }
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

  nav(path: string) {
    this.navCtrl.navigateForward(path);
  }

  searchCard() {
    cordova.plugin.uhf.inventoryCard(res => {
      console.log(res);
      if (res.length > 0) {
        this.card = res[0];
        this.ref.detectChanges();
        this.stopSearchCard();
      }
    }, err => { console.log(err); });
  }

  selectCard(card: Card) {
    cordova.plugin.uhf.selectCard({ epc: card.mEpcBytes },
      res => {
        this.navCtrl.navigateForward('card', {
          queryParams: { epc: card.mEpcBytes }
        });
      },
      err => { console.log(err); }
    );
  }
  startSearchCard() {
    this.msg = '正在扫描，请接触rfid卡';
    cordova.plugin.uhf.setPower(this.power, res => {
      console.log(res);
      this.card = null;
      this.searchCardFlag = true;
      this.ref.detectChanges();
      this.searchCard();
    }, err => { console.log(err); })
  }
  stopSearchCard() {
    cordova.plugin.uhf.stopInventoryCard(r => {
      console.log(r);
      this.searchCardFlag = false;
      this.ref.detectChanges();
    });
  }
  async writeCard() {
    let tempDatas = await this.storage.get('datas');
    for (let i = 0; i < tempDatas.length; i++) {
      if (this.card.mEpcBytes === tempDatas[i].mEpcBytes) {
        tempDatas[i] = this.card
        this.storage.set('datas', tempDatas);
        this.card = null;
        this.msg = '写入成功';
        return;
      }
    }
    tempDatas.push(this.card);
    this.storage.set('datas', tempDatas);
    this.card = null;
    this.msg = '写入成功';
  }
}

interface Card {
  mEpcBytes: string;
  mRssi: number;
  count?: number;
}
