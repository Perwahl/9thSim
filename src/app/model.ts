import { UnitStat } from './data-units';
import { AttributeModifiers, ModelAttributeName, ModelAttribute } from './data-attributes';

export class UnitState {
    unitType: UnitStat;
    modelCount: number;
    unitWidth: number;
    generalsDiscipline: number;
    remainingModels: number[];
    attributes: ModelAttribute[];
    modifiers: AttributeModifiers;
}

export class CombatResult {
    turnResults: CombatTurnResult[];
    outcome: CombatOutcome;

    constructor(turnResults: CombatTurnResult[]) {
        this.turnResults = turnResults;
    }
}

export class CombatTurnResult {
    kills: number[];
    hits: number[];
    wounds: number[];
    armorSaves: number[];
    outcome: CombatOutcome;
    totalKills: number[];
    constructor() {
    }
}

export class CombatTurnData {
    resultCount: number;
    enemyBreaks: number;
    unitBreaks: number;
    stalemate: number;

    breakChance: number[];

    averageKills: number[];
    // averageKillsTotal: number[];
    averageHits: number[];
    averageWounds: number[];
    enemyAverageArmorSaves: number[];

    constructor() {
        this.enemyBreaks = 0,
            this.unitBreaks = 0,
            this.stalemate = 0,
            this.resultCount = 0,
            this.averageKills = [0, 0],
            this.averageHits = [0, 0],
            this.averageWounds = [0, 0],
            this.enemyAverageArmorSaves = [0, 0],
            // this.averageKillsTotal = [0, 0],
            this.breakChance = [0, 0];
    }
}

export class CombatFullData {
    resultCount: number;
    enemyBreaks: number;
    unitBreaks: number;
    stalemate: number;
    constructor() {
        this.resultCount = 0,
            this.enemyBreaks = 0,
            this.unitBreaks = 0,
            this.stalemate = 0
    }
}

export enum CombatOutcome {
    enemyBroken,
    broken,
    enemyWipedOut,
    wipedOut,
    bothWipedOut,
    hold,
}

export class RenderModel {
    type: string;
    rank: number;
    file: number;
    dead: boolean[];
}

export class RenderUnit {
    models: Array<RenderModel>;
    ranks: number;
    baseWidth: number;
    baseHeight: number;
    unitWidth: number;
    align: number;
}

export enum BaseSize { 'Infantry20x20', 'Infantry25x25', 'Cavalry25x50', 'MonstrousInfantry40x40' };

export const baseWidthDictionary = { 0: 20, 1: 25, 2: 25, 3: 40 };

export const baseHeightDictionary = { 0: 20, 1: 25, 2: 50, 3: 40 };



