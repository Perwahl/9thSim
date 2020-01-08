import { Component, OnInit, Input } from '@angular/core';
import { CombatTurnData, RenderUnit } from '../model';

@Component({
  selector: 'app-combat-turn-stats',
  templateUrl: './combat-turn-stats.component.html',
  styleUrls: ['./combat-turn-stats.component.scss']
})
export class CombatTurnStatsComponent implements OnInit {

  @Input() public combatTurnData: CombatTurnData[];
  @Input() unitOneRender: RenderUnit;
  @Input() unitTwoRender: RenderUnit;
  selectedTurn: number = 0;

  constructor() { }

  ngOnInit() {
    this.combatTurnData = [new CombatTurnData, new CombatTurnData, new CombatTurnData];
  }

  onCombatTurnSelect(turnNumber: number) {
    this.selectedTurn = turnNumber;
  }

  turnOutcomeBlocks(outcome: number) {
    const colors = {
      'enemyBreaks': 'green',
      'unitBreaks': 'red',
      'stalemate': 'yellow'
    };

    const type = {
      0: 'enemyBreaks',
      2: 'unitBreaks',
      1: 'stalemate'
    };

    let widthMod = 0;
    if(outcome === 0){
      widthMod = this.combatTurnData[this.selectedTurn].breakChance[0];
    }
    else if(outcome == 2){
      widthMod = this.combatTurnData[this.selectedTurn].breakChance[1];
    }
    else if(outcome == 1){
      widthMod = 1-(this.combatTurnData[this.selectedTurn].breakChance[1]+this.combatTurnData[this.selectedTurn].breakChance[0]);
    }

    //const width = (this.combatTurnData[this.selectedTurn][type[outcome]] / this.combatTurnData[this.selectedTurn].resultCount) * 90;
    const width =  widthMod * 90;
    const minWidth = Math.max(width, 3);

    console.log();

    let styles = {
      'width': minWidth + '%',
      'background-color': colors[type[outcome]],
      'text-align': 'center',
      'padding-top': '5px'
    };
    //console.log(styles);
    return styles;
  }

  killRangeRounded(killRange: number) {
    //let rangeRounded = ' ';
    //if (killRange > 0.1) {
    //let rangeRounded = Math.round((killRange * 100)) + '%';
    let rangeRounded = Math.round(killRange * 1000) / 10 + '%';
    // }

    return rangeRounded;
  }

  formatNumber(i: number) {
    return Math.round(i * 100)/100; 
  }

  formatNumber2(i: number) {
    return Math.round(i*100); 
  }
}
