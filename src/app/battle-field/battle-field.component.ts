import { Component, OnInit, Input } from '@angular/core';
import { RenderUnit, } from '../model';

@Component({
  selector: 'app-battle-field',
  templateUrl: './battle-field.component.html',
  styleUrls: ['./battle-field.component.scss']
})
export class BattleFieldComponent implements OnInit {

  @Input() unitOne: RenderUnit;
  @Input() unitTwo: RenderUnit;
  @Input() selectedTurn: number;

  constructor() {
    // console.log(this.unitOne);
   }

  paintMyButt(unitNumber: number) {
    let unit = this.unitOne;
    let otherUnit = this.unitTwo;
    if (unitNumber == 2) {
      unit = this.unitTwo;
      otherUnit = this.unitOne;
    }  

    const unitWidthDiff = unit.unitWidth - otherUnit.unitWidth;
   // console.log(unitWidthDiff);
    let padding = '';
    //console.log("widthDiff: " + unitWidthDiff + " mod: " + (unitWidthDiff/2) % unit.baseHeight  );
    if (unitWidthDiff > (unit.baseHeight * 2) && (unitWidthDiff/2) % unit.baseHeight != 0) {
      console.log("align");
      padding = '40px';
    }

    var butts = "";
    for (let i = 0; i <= unit.ranks; i++) {
      butts = butts + unit.baseWidth + 'px';
    }

    let styles = {
      'display': 'grid',
      'grid-template-columns': butts,
      'padding-top' : padding,
    };
    return styles;
  }

  ngOnInit() {
  }

}
