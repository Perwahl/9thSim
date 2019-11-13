import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UnitState } from '../model';
import { UnitStat } from '../data-units';
import { Attributes, ModelAttributeName, ModelAttribute } from '../data-attributes';
import { PropertyRead } from '@angular/compiler';

@Component({
  selector: 'app-unit-stats',
  templateUrl: './unit-stats.component.html',
  styleUrls: ['./unit-stats.component.scss']
})
export class UnitStatsComponent implements OnInit {

  @Input() public unitStats: UnitStat[];
  @Input() unitIdentifier: number;

  @Input() unitProps: UnitState;
  @Output() stateEmitter = new EventEmitter();


  constructor() { }

  unitChange() {
    this.stateEmitter.emit();
  }

  onUnitSelect(unit: UnitStat) {
    this.unitProps.unitType = unit;
    this.applyProps();
    this.unitChange();
  }

  applyProps() {
    this.unitProps.attributes = [];

    this.unitProps.unitType.defaultAttributes.forEach(attrName => {
      let attr = Attributes[ModelAttributeName[attrName]];
      let objCopy = Object.assign({}, attr);
      objCopy.active = true;
      this.unitProps.attributes.push(objCopy);
    });
    this.unitProps.unitType.optionalAttributes.forEach(attrName => {
      let attr = Attributes[ModelAttributeName[attrName]];
      let objCopy = Object.assign({}, attr);
      objCopy.active = false;
      this.unitProps.attributes.push(objCopy);
    });
  }

  onToggleAttribute(selectedAttribute : ModelAttribute, unitIdentifier){   
    if(unitIdentifier === this.unitIdentifier){
    const prop = this.unitProps.attributes.find(function (element){return selectedAttribute.name === element.name});
    
    console.log(this.unitProps.attributes);
    prop.active = !prop.active;
    this.unitChange();
    }
  }

  ngOnInit() {
    this.applyProps();
    // console.log('unit ident = ', this.unitIdentifier);
  }

}
