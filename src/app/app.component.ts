import { Component, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { UnitState, CombatOutcome, CombatTurnResult, CombatResult, RenderUnit, BaseSize, RenderModel, CombatFullData, CombatTurnData, baseHeightDictionary, baseWidthDictionary } from './model';
import { CombatHelpers } from './combatHelpers';
import { UnitTypes, UnitStat } from './data-units';
import { AttributeModifiers } from './data-attributes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'NinthSim';

  combatLog: boolean = false;

  public unitStats: Array<UnitStat>[];
  unitStates: UnitState[] = [];
  selectedTurn: number;
  isCombatTurn: boolean;
  combatResults: number;
  combatHelpers: CombatHelpers;

  combatData: CombatFullData;
  combatTurnData: CombatTurnData[];

  unitOneRender: RenderUnit;
  unitTwoRender: RenderUnit;
  intervalWorker;

  constructor() {
    this.unitStats = UnitTypes;
    this.combatHelpers = new CombatHelpers();

    let defaultProps1 = new UnitState();
    defaultProps1.unitWidth = 5;
    defaultProps1.modelCount = 10;
    defaultProps1.generalsDiscipline = 0;
    defaultProps1.unitType = this.unitStats[0][0];
    defaultProps1.modifiers = new AttributeModifiers();

    let defaultProps2 = new UnitState();
    defaultProps2.unitWidth = 5;
    defaultProps2.modelCount = 10;
    defaultProps2.generalsDiscipline = 0;
    defaultProps2.unitType = this.unitStats[0][0];
    defaultProps2.modifiers = new AttributeModifiers();

    this.unitStates = [defaultProps1, defaultProps2];

    this.createRenderUnit(this.unitStates[0], 0)
    this.createRenderUnit(this.unitStates[1], 1)
  }

  onUnitOneChange() {
    //this.unitStates[0] = updatedProps;
    this.createRenderUnit(this.unitStates[0], 0);
    clearInterval(this.intervalWorker);
  }

  onUnitTwoChange() {
    //this.unitStates[1] = updatedProps;
    this.createRenderUnit(this.unitStates[1], 1);
    clearInterval(this.intervalWorker);
  }

  createRenderUnit(unitState: UnitState, array: number) {

    let tempUnit = new RenderUnit();
    tempUnit.models = new Array<RenderModel>();

    const minModelCount = Math.max(unitState.modelCount, 1);
    const minModelWidth = Math.max(unitState.unitWidth, 1);

    for (let i = 0; i < minModelCount; i++) {
      tempUnit.models[i] = new RenderModel()
      tempUnit.models[i].type = BaseSize[unitState.unitType.baseSize];
      tempUnit.models[i].dead = [false, false, false];
    }
    tempUnit.ranks = Math.ceil(minModelCount / minModelWidth);
    tempUnit.baseHeight = baseHeightDictionary[unitState.unitType.baseSize];
    tempUnit.baseWidth = baseWidthDictionary[unitState.unitType.baseSize];
    tempUnit.unitWidth = tempUnit.baseHeight * Math.min(minModelWidth, minModelCount);

    if (array == 0) {
      let fileIter = 1
      tempUnit.models.forEach(function (value, i) {
        value.rank = Math.ceil((i + 1) / minModelWidth);
        value.rank = Math.abs(value.rank - (tempUnit.ranks + 1));
        value.file = fileIter;
        fileIter++;
        if (fileIter > minModelWidth) {
          fileIter = 1;
        }

      });
      this.unitOneRender = tempUnit;
    }
    else {
      let fileIter = 1
      tempUnit.models.forEach(function (value, i) {
        value.rank = Math.ceil((i + 1) / minModelWidth);
        value.file = fileIter;
        fileIter++;
        if (fileIter > minModelWidth) {
          fileIter = 1;
        }
      });
      console.log(tempUnit);
      this.unitTwoRender = tempUnit;
    }
  }

  onSimulateCombat() {
    this.combatTurnData = [new CombatTurnData(), new CombatTurnData(), new CombatTurnData()];
    this.combatData = new CombatFullData();

    this.createCombatModifiers();

    clearInterval(this.intervalWorker);
    console.log("start combat sim");
    this.combatResults = 0;
    this.intervalWorker = setInterval(this.simulateCombat.bind(this), 0);
  }

  createCombatModifiers() {
    const self = this;
    self.unitStates[0].modifiers = new AttributeModifiers();
    self.unitStates[1].modifiers = new AttributeModifiers();

    this.unitStates[0].attributes.forEach(function (attr) {
      if (attr.active) {
        attr.effect.call(self, self.unitStates[0].modifiers);
      }
    });
    //console.log(this.unitStates[0].modifiers);

    this.unitStates[1].attributes.forEach(function (attr) {
      if (attr.active) {
        attr.effect.call(self, self.unitStates[1].modifiers);
      }
    });
    //console.log(this.unitStates[1].modifiers);
  }

  simulateCombat() {
    for (let i = 0; i < 11; i++) {
      const result = this.simulateCombatResult();

      this.updateCombatData(result);
      this.updateTurnData(result.turnResults);
    }

    if (this.combatResults >= 10000) {
      clearInterval(this.intervalWorker);
    }
  }

  updateCombatData(result: CombatResult) {
    this.combatData.resultCount++;
    if (result.outcome === CombatOutcome.broken || result.outcome === CombatOutcome.wipedOut) {
      this.combatData.unitBreaks++;
    }
    if (result.outcome === CombatOutcome.enemyBroken || result.outcome === CombatOutcome.enemyWipedOut) {
      this.combatData.enemyBreaks++;
    }
    if (result.outcome === CombatOutcome.hold) {
      this.combatData.stalemate++;
    }
    this.combatResults++;
  }

  updateTurnData(turnResults: CombatTurnResult[]) {

    const turnData = this.combatTurnData;
    const self = this;

    turnResults.forEach(function (turn, i, ) {
      
      if (turn.outcome === CombatOutcome.broken || turn.outcome === CombatOutcome.wipedOut) {
        //this.combatTurnData[i].unitBreaks++;
        turnData[i].unitBreaks++;
      }
      else if (turn.outcome === CombatOutcome.enemyBroken || turn.outcome === CombatOutcome.enemyWipedOut) {
        //combatTurnData[i].enemyBreaks++;
        turnData[i].enemyBreaks++;
      }
      else if (turn.outcome === CombatOutcome.hold || turn.outcome === CombatOutcome.bothWipedOut) {
        // combatTurnData[i].stalemate++;
        turnData[i].stalemate++;
      }
      
      turnData[i].averageKills[0] = self.updateAverage(turnData[i].averageKills[0], turnData[i].resultCount, turnResults[i].kills[0]);
      turnData[i].averageKills[1] = self.updateAverage(turnData[i].averageKills[1], turnData[i].resultCount, turnResults[i].kills[1]);

      // turnData[i].averageKills[0] = self.updateAverage(turnData[i].averageKills[0], turnData[i].resultCount, turnResults[i].kills[0]);
      // turnData[i].averageKills[1] = self.updateAverage(turnData[i].averageKills[1], turnData[i].resultCount, turnResults[i].kills[1]);

      turnData[i].averageHits[0] = self.updateAverage(turnData[i].averageHits[0], turnData[i].resultCount, turnResults[i].hits[0]);
      turnData[i].averageHits[1] = self.updateAverage(turnData[i].averageHits[1], turnData[i].resultCount, turnResults[i].hits[1]);

      turnData[i].averageWounds[0] = self.updateAverage(turnData[i].averageWounds[0], turnData[i].resultCount, turnResults[i].wounds[0]);
      turnData[i].averageWounds[1] = self.updateAverage(turnData[i].averageWounds[1], turnData[i].resultCount, turnResults[i].wounds[1]);

      turnData[i].enemyAverageArmorSaves[0] = self.updateAverage(turnData[i].enemyAverageArmorSaves[0], turnData[i].resultCount, turnResults[i].armorSaves[0]);
      turnData[i].enemyAverageArmorSaves[1] = self.updateAverage(turnData[i].enemyAverageArmorSaves[1], turnData[i].resultCount, turnResults[i].armorSaves[1]);

      turnData[i].resultCount++;

    }, self);

    turnData[0].breakChance[0] = turnData[0].enemyBreaks / turnData[0].resultCount;
    turnData[0].breakChance[1] = turnData[0].unitBreaks / turnData[0].resultCount;

    turnData[1].breakChance[0] = (turnData[0].enemyBreaks + turnData[1].enemyBreaks) / (turnData[0].resultCount);
    turnData[1].breakChance[1] = (turnData[0].unitBreaks + turnData[1].unitBreaks) /  (turnData[0].resultCount);

    turnData[2].breakChance[0] = (turnData[0].enemyBreaks + turnData[1].enemyBreaks + turnData[2].enemyBreaks) / (turnData[0].resultCount);
    turnData[2].breakChance[1] = (turnData[0].unitBreaks + turnData[1].unitBreaks + turnData[2].unitBreaks) /  (turnData[0].resultCount);

    this.UpdateRenderUnitCasualties(this.unitOneRender, 1);
    this.UpdateRenderUnitCasualties(this.unitTwoRender, 0);
  }

  UpdateRenderUnitCasualties(unit: RenderUnit, opponent: number) {
    //const unit = this.unitOneRender;
    this.combatTurnData.forEach(function (turn, i, ) {
      const dead = Math.round(turn.averageKills[opponent]);

      unit.models.forEach(function (model, j, ) {
        if (j >= unit.models.length - dead) {
          model.dead[i] = true;
        }
        else {
          model.dead[i] = false;
        }
      }
      );
    }, self)
  }

  updateAverage(average: number, freq: number, newValue: number) {
    const sum = newValue + (average * freq);
    return sum / (freq + 1);
  }

  simulateCombatResult() {

    const combatResult: CombatResult = new CombatResult([]);
    this.unitStates[0].remainingModels = [this.unitStates[0].modelCount];
    this.unitStates[1].remainingModels = [this.unitStates[1].modelCount];

    combatResult.turnResults[0] = this.combatHelpers.calculateCombatTurn(this.unitStates, 1, combatResult);
    combatResult.outcome = combatResult.turnResults[0].outcome;
    if (combatResult.outcome === CombatOutcome.hold) {
      combatResult.turnResults[1] = this.combatHelpers.calculateCombatTurn(this.unitStates, 2, combatResult);
      combatResult.outcome = combatResult.turnResults[1].outcome;
      if (combatResult.outcome === CombatOutcome.hold) {
        combatResult.turnResults[2] = this.combatHelpers.calculateCombatTurn(this.unitStates, 3, combatResult);
        combatResult.outcome = combatResult.turnResults[2].outcome;
      }
    }
        
    // console.log("combat over: " +  CombatOutcome[combatResult.outcome]);
    // console.log(combatResult);
    return combatResult;
  }
}
