import { UnitState, CombatOutcome, CombatTurnResult, baseWidthDictionary, CombatResult } from './model';
import { registerLocaleData } from '@angular/common';
import { UnitStat } from './data-units';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MaxLengthValidator } from '@angular/forms';

export class CombatHelpers {

    combatLog: boolean = false;
    netsModifier : number[];

    public calculateCombatTurn(units: UnitState[], turn: number, combat : CombatResult) {
        
        const combatTurn: CombatTurnResult = new CombatTurnResult();
        
        if(turn === 1){
            combatTurn.kills = [0, 0];
        combatTurn.hits = [0, 0];
        combatTurn.wounds = [0, 0];
        combatTurn.armorSaves = [0, 0];
        }
        else{
        combatTurn.kills = [combat.turnResults[turn-2].kills[0], combat.turnResults[turn-2].kills[1]];
        combatTurn.hits = [combat.turnResults[turn-2].hits[0], combat.turnResults[turn-2].hits[1]];
        combatTurn.wounds = [combat.turnResults[turn-2].wounds[0], combat.turnResults[turn-2].wounds[1]];
        combatTurn.armorSaves = [combat.turnResults[turn-2].armorSaves[0], combat.turnResults[turn-2].armorSaves[1]];
        }   
        
        units[0].remainingModels[turn] = units[0].remainingModels[turn - 1];
        units[1].remainingModels[turn] = units[1].remainingModels[turn - 1];
        if (this.combatLog) console.log("starting a combat round. remaining models " + units[0].remainingModels[turn]);

        this.nets(units);

        //run through the AGI steps
        for (let i = 10; i >= 0; i--) {
            if (this.agilityWithMods(units[0]) === i) {
                if (this.combatLog) console.log("unit 1 attacking");
                this.attackRound(units[0], units[1], combatTurn, 0, turn);
            }
            if (this.agilityWithMods(units[1]) === i) {
                if (this.combatLog) console.log("unit 2 attacking");
                this.attackRound(units[1], units[0], combatTurn, 1, turn );
            }
            //update remaining models
            if (units[0].unitType.agi === i) {
                units[1].remainingModels[turn] = units[1].remainingModels[turn] - combatTurn.kills[0];
            }
            if (units[1].unitType.agi === i) {
                units[0].remainingModels[turn] = units[0].remainingModels[turn] - combatTurn.kills[1];
            }
        }

        //check if any unit is wiped out
        if (units[0].remainingModels[turn] < 1 && units[1].remainingModels[turn] < 1) {
            combatTurn.outcome = CombatOutcome.bothWipedOut;
            return combatTurn;
        }
        else if (units[0].remainingModels[turn] < 1) {
            combatTurn.outcome = CombatOutcome.wipedOut;
            return combatTurn;
        }
        else if (units[1].remainingModels[turn] < 1) {
            combatTurn.outcome = CombatOutcome.enemyWipedOut;
            return combatTurn;
        }
        
        combatTurn.outcome = this.breakTest(units, combatTurn.kills, turn);

        return combatTurn;
    }
    nets(units: UnitState[]) {
        this.netsModifier = [0,0];

        if(units[0].modifiers.hasNets){
            if(this.d6Roll(1, 2, false).hits > 0){
                this.netsModifier[1]--;
            }
            else{
                this.netsModifier[0]--;
            }
        }

        if(units[1].modifiers.hasNets){
            if(this.d6Roll(1, 2, false).hits > 0){
                this.netsModifier[0]--;
            }
            else{
                this.netsModifier[1]--;
            }
        }
    }

    agilityWithMods(attackingUnit: UnitState) {
        let actualAgi = attackingUnit.unitType.agi + attackingUnit.modifiers.agilityMod;
        //check if the unit is allowed to strike this agi step. 
        if (attackingUnit.modifiers.greatWeapon && !attackingUnit.modifiers.lightningReflexes) {
            actualAgi = 0;
        }
        return actualAgi
    }

    breakTest(units: UnitState[], kills: number[], turn: number) {

        let scores = [0, 0];
        scores[0] += this.rankBonus(units[0], turn);
        scores[1] += this.rankBonus(units[1], turn);

        if (this.combatLog) console.log("unit 0 ranks " + scores[0]);
        if (this.combatLog) console.log("unit 1 ranks " + scores[1]);

        scores[0] += kills[0];
        scores[1] += kills[1];

        scores[0] += units[0].modifiers.combatResolutionBonus;
        scores[1] += units[1].modifiers.combatResolutionBonus;

        if (this.combatLog) console.log("unit 0 kills " + kills[0] + ". total " + scores[0]);
        if (this.combatLog) console.log("unit 1 kills " + kills[1] + ". total " + scores[1]);

        //generals disciplne set?
        let unit0Dis = Math.min(Math.max(units[0].unitType.dis, units[0].generalsDiscipline),10);
        let unit1Dis = Math.min(Math.max(units[1].unitType.dis, units[1].generalsDiscipline),10);        

        if (this.combatLog) console.log("unit 0 leadership " + unit0Dis + " generals " + units[0].generalsDiscipline);
        if (this.combatLog) console.log("unit 1 leadership " + unit1Dis);        
       
        if (scores[0] === scores[1]) {
            if (this.combatLog) console.log("draw");
            return CombatOutcome.hold

        }        
        else if (scores[0] > scores[1]) {
            let steadfast = this.steadfastCheck(units, turn, 1);
            let modifiedDis= steadfast ? unit1Dis : unit1Dis - (scores[0] - scores[1]);
            if (this.disTest(modifiedDis)) {
                return CombatOutcome.hold;
            }
            else {
                return CombatOutcome.enemyBroken
            }
        }
        else if (scores[1] > scores[0]) {
            let steadfast = this.steadfastCheck(units, turn, 0);
            let modifiedDis= steadfast ? unit0Dis : unit0Dis - (scores[1] - scores[0]);
            if (this.disTest(modifiedDis)) {
                return CombatOutcome.hold;
            }
            else {
                return CombatOutcome.broken
            }
        }
    }
    steadfastCheck(units: UnitState[], turn: number, unit: number) {
        let ranks =Math.max(Math.floor(units[unit].remainingModels[turn] / units[unit].unitWidth) - 1, 0);
        let opponentRanks =Math.max(Math.floor(units[1-unit].remainingModels[turn] / units[1-unit].unitWidth) - 1, 0);
        if (this.combatLog) console.log("losing unit ranks " + ranks + " winning units ranks " + opponentRanks);
        if (this.combatLog && ranks > opponentRanks) console.log("is steadfast ");
        return ranks > opponentRanks;
    }

    rankBonus(unit: UnitState, turn: number) {
        return Math.min(Math.max(Math.floor(unit.remainingModels[turn] / unit.unitWidth) - 1, 0), 3);
    }

    attackRound(attackingUnit: UnitState, defendingUnit: UnitState, result : CombatTurnResult, unit : number, turn : number) {

        const attackingModels = this.attackingModels(attackingUnit, defendingUnit, turn);
        if (this.combatLog) console.log("attacking models in front rank: " + attackingModels);
        const attacks = (attackingModels * (attackingUnit.unitType.att + attackingUnit.modifiers.extraAttacks)) + (this.supportingAttacks(attackingUnit, attackingModels, turn, (1 + attackingUnit.modifiers.fightInExtraRank)));
        if (this.combatLog) console.log("total attacks with supporting ranks: " + attacks);        

        const toHit = this.toHitChance(attackingUnit.unitType.off, this.parryMod(defendingUnit, attackingUnit));
        const hits = this.d6Roll(attacks, this.ToHitBonuses(toHit, attackingUnit), false);

        let wounds = 0;
        if (attackingUnit.modifiers.poisonedAttacks) {
            let sixes = 0;
            hits.rolls.forEach(element => {
                if (element === 6) {
                    sixes++;
                }
            });
            hits.hits -= sixes;
            wounds+=sixes
        }
        if (this.combatLog) console.log("hits: " + hits.hits)

        const toWound = this.toWoundChance((attackingUnit.unitType.str + attackingUnit.modifiers.strengthMod + this.netsModifier[unit]), defendingUnit.unitType.res);
        wounds += this.d6Roll(hits.hits, toWound, attackingUnit.modifiers.toWoundRerollOnes).hits;
        if (this.combatLog) console.log("wounds: " + wounds)

        const armorSave = this.armorSaveChance(attackingUnit, defendingUnit);
        const saves = this.d6Roll(wounds, armorSave, false).hits;
        if (this.combatLog) console.log("armor saves: " + saves)

        const kills = wounds - saves;
        //console.log("kills " + kills);
        result.hits[unit] += hits.hits;
        result.wounds[unit] += wounds;
        result.armorSaves[1-unit] += saves;
        result.kills[unit] += kills;
    }
    parryMod(defendingUnit: UnitState, attackingUnit: UnitState): number {
        if(defendingUnit.modifiers.hasShield && defendingUnit.modifiers.canParry && !attackingUnit.modifiers.hasPairedWeapon){
            return Math.max(defendingUnit.unitType.def+1, attackingUnit.unitType.off);
        }
        else{
            return defendingUnit.unitType.def
        }
    }
    ToHitBonuses(toHitBase: number, attackingUnit: UnitState) {
        let actualToHit = toHitBase - attackingUnit.modifiers.toHitMods;

        if (attackingUnit.modifiers.lightningReflexes && !attackingUnit.modifiers.greatWeapon) {
            actualToHit--;
        }
        const hit = Math.max(Math.min(actualToHit, 6), 1);

        if (this.combatLog) console.log("to hit after bonuses " + hit);
        return hit
    }

    d6Roll(dice: number, success: number, rerollOnes: boolean) {
        let result = { hits: 0, rolls: [] };
        let rolls = '';

        for (let i = 0; i < dice; i++) {
            let roll = Math.floor(Math.random() * 6) + 1;

            if (rerollOnes && roll === 1) {
                roll = Math.floor(Math.random() * 6) + 1;
            }
            if (roll >= success) {
                result.hits++;
            }
            rolls += ', ' + roll;
        }

        if (this.combatLog) console.log('rolled ' + dice + ' d6: ' + rolls);

        return result;
    }

    disTest(target: number) {
        let success = false;
        let total = 0;
        for (let i = 0; i < 2; i++) {
            let roll = (Math.floor(Math.random() * 6)) + 1;
            total += roll;
            if (this.combatLog) console.log("d6: " + roll);
        }
        if (total <= target) {
            success = true;
        }

        if (this.combatLog) console.log("dis test on " + target + " rolled " + total + " . Success: " + success);
        return success;
    }

    toHitChance(offense: number, defense: number) {
        const toHitDiff: number = offense - defense;
        let toHit: number = 0;

        toHitDiff >= 4 ? toHit = 2 :
            toHitDiff >= 1 ? toHit = 3 :
                toHitDiff >= -3 ? toHit = 4 :
                    toHitDiff >= -7 ? toHit = 5 : toHit = 6;

        if (this.combatLog) console.log("off: " + offense + " vs def:  " + defense + ". to hit: " + toHit + "+");
        return toHit;
    }

    toWoundChance(strenght: number, resistance: number) {
        const toWoundDiff: number = strenght - resistance;
        let toWound: number = 0;

        toWoundDiff >= 2 ? toWound = 2 :
            toWoundDiff === 1 ? toWound = 3 :
                toWoundDiff === 0 ? toWound = 4 :
                    toWoundDiff === -1 ? toWound = 5 : toWound = 6;
        if (this.combatLog) console.log("to wound: " + toWound + "+");

        return toWound;
    }

    armorSaveChance(attackingUnit: UnitState, defendingUnit: UnitState) {
        const totalArmor = defendingUnit.unitType.arm + defendingUnit.modifiers.armorBonus;
        const totalAP = attackingUnit.unitType.ap + attackingUnit.modifiers.armorPenetration;

        const toSave: number = Math.max(7 - totalArmor + totalAP, 2);
        if (this.combatLog) console.log("Armor Save: " + toSave + "+ . AP: " + totalAP + " armor: " + totalArmor);

        return toSave;
    }

    attackingModels(attackingUnit: UnitState, defendingUnit: UnitState, turn: number) {
        const defendingModelsCount = Math.min(defendingUnit.unitWidth, defendingUnit.remainingModels[turn]);
        const defendingUnitWidth: number = defendingModelsCount * baseWidthDictionary[defendingUnit.unitType.baseSize];

        const maxContactingModels = (defendingUnitWidth / baseWidthDictionary[attackingUnit.unitType.baseSize]);

        return Math.min(maxContactingModels + 2, attackingUnit.unitWidth, attackingUnit.remainingModels[turn]);
    }

    supportingAttacks(attackingUnit: UnitState, attackingModels: number, turn: number, attackingRanks: number) {
        let supportingModels = 0;

        for (let i = 0; i < attackingRanks; i++) {
            const modelsInRank = Math.max(Math.min(attackingUnit.unitWidth, (attackingUnit.remainingModels[turn]) - (attackingUnit.unitWidth * (i + 1))), 0);
            supportingModels += Math.min(modelsInRank, attackingModels);

            if (this.combatLog) console.log("models in rank " + (i + 1) + " : " + modelsInRank + ". support attacks: " + supportingModels);
        }
        return supportingModels;
    }
}