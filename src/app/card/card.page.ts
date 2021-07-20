import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

declare const cordova: any
@Component({
  selector: 'app-card',
  templateUrl: './card.page.html',
  styleUrls: ['./card.page.scss'],
})
export class CardPage implements OnInit {

  assetMsg: any;
  readmsg: string;
  writemsg: string;
  epc: string;
  constructor(
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {
    this.epc = this.activatedRoute.snapshot.queryParams.epc;
   }

  ngOnInit() {
    for (const asset of this.tempDatas) {
      if (this.epc === asset.mEpcBytes) {
        this.assetMsg = asset;
        break;
      }
    }
  }

  back() {
    this.navCtrl.back();
  }

  readCard() {
    cordova.plugin.uhf.readCard(
      res => { this.readmsg = res; },
      err => { this.readmsg = err; }
    );
  }

  writeCard() {
    console.log(this.writemsg);
    cordova.plugin.uhf.writeCard({ data: this.writemsg }, res => { this.readmsg = res; }, err => { this.readmsg = err;});
  }

  tempDatas = [
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
  ];

}
