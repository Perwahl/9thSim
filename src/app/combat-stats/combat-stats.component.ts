import { Component, OnInit, Input } from '@angular/core';
import { CombatFullData } from '../model';

@Component({
  selector: 'app-combat-stats',
  templateUrl: './combat-stats.component.html',
  styleUrls: ['./combat-stats.component.scss']
})
export class CombatStatsComponent implements OnInit {

  @Input() public combatData: CombatFullData;
  constructor() { }

  ngOnInit() {    
  }

  combatOutcomeBlocks(outcome: number) {   
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

    const width = (this.combatData[type[outcome]]/this.combatData.resultCount)*90;
    const minWidth = Math.max(width, 3);

    console.log();

    let styles = {
     'width': minWidth +'%',
     'background-color': colors[type[outcome]],
     'text-align': 'center',
     'padding-top' : '5px'
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

}
