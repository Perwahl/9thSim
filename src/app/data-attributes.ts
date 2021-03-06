
export enum ModelAttributeName {
    'light_armor',
    'shield',
    'spear',
    'killer_instinct',
    'paired_weapons',
    'lightning_reflexes',
    'poison_attacks',
    'heavy_armor',
    'halberd',
    'fearless',
    'fear',
    'great_weapon',
    'plate_armor',
    'nets',
    'standard_bearer'
}

export enum AttributeType {
    'weapon', 'armor', 'equipment', 'special_rule'
}

export class ModelAttribute {
    name: string;
    effect: Function;
    active: boolean;
    type: string;
}

export class AttributeModifiers {
    armorBonus: number;
    fightInExtraRank: number;
    armorPenetration: number;
    strengthMod: number;
    toWoundRerollOnes: boolean;
    extraAttacks: number;
    lightningReflexes: boolean;
    poisonedAttacks: boolean;
    agilityMod: number;
    //charge bonuses
    //get charged bonuses
    chargedArmorPenetration: number;
    chargedAgilityBonus: number;
    greatWeapon: boolean;
    toHitMods: number;
    combatResolutionBonus: number;
    canParry: boolean;
    hasShield: boolean;
    hasPairedWeapon: boolean;
    hasNets: boolean;

    constructor() {
        this.armorBonus = 0;
        this.fightInExtraRank = 0;
        this.armorPenetration = 0;
        this.toWoundRerollOnes = false;
        this.chargedArmorPenetration = 0;
        this.chargedAgilityBonus = 0;
        this.lightningReflexes=false;
        this.extraAttacks=0;
        this.poisonedAttacks=false;
        this.strengthMod=0;
        this.agilityMod=0;
        this.greatWeapon=false;
        this.toHitMods=0;
        this.combatResolutionBonus=0;
        this.hasShield=false;
        this.canParry=true;
        this.hasPairedWeapon=false;
        this.hasNets=false;
    }
}

export const Attributes = {

    'light_armor': {
        name: 'Light Armor',
        type: AttributeType.armor,
        effect: function effect(mods: AttributeModifiers) {
            mods.armorBonus += 1;
        }
    },

    'shield': {
        name: "Shield",
        type: AttributeType.equipment,
        effect: function effect(mods: AttributeModifiers) {
            mods.armorBonus += 1;
            mods.hasShield =true;
        }
    },

    'spear': {
        name: "Spear",
        type: AttributeType.weapon,
        effect: function effect(mods: AttributeModifiers) {
            mods.armorPenetration += 1;
            mods.fightInExtraRank += 1;
            mods.canParry =false;
        }
    },

    'killer_instinct': {
        name: "Killer Instinct",
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
            mods.toWoundRerollOnes = true;
        }
    },
    'paired_weapons': {
        name: "Paired Weapons",
        type: AttributeType.weapon,
        effect: function effect(mods: AttributeModifiers) {
            mods.extraAttacks += 1;
            mods.canParry =false;
            mods.hasPairedWeapon =true;
        }
    },
    'lightning_reflexes': {
        name: "Lightning Reflexes",
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
            mods.lightningReflexes = true;        
        }
    },
    'poison_attacks': {
        name: "Poison Attacks",
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
            mods.poisonedAttacks =true;           
        }
    },
    'great_weapon': {
        name: "Great Weapon",
        type: AttributeType.weapon,
        effect: function effect(mods: AttributeModifiers) {            
            mods.strengthMod+=2;
            mods.armorPenetration+=2;
            mods.greatWeapon=true;
            mods.canParry =false;
        }
    },
    'heavy_armor': {
        name: 'Heavy Armor',
        type: AttributeType.armor,
        effect: function effect(mods: AttributeModifiers) {
            mods.armorBonus += 2;
        }
    },
    'plate_armor': {
        name: 'Plate Armor',
        type: AttributeType.armor,
        effect: function effect(mods: AttributeModifiers) {
            mods.armorBonus += 3;
        }
    },
    'halberd': {
        name: 'Halberd',
        type: AttributeType.weapon,
        effect: function effect(mods: AttributeModifiers) {
            mods.strengthMod += 1;
            mods.armorPenetration+=1;
            mods.canParry =false;
        }
    },
    'fear': {
        name: 'Fear',
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
            console.log("Not Implemented");
        }
    },
    'fearless': {
        name: 'Fearless',
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
           console.log("Not Implemented");
        }
    },
    'nets': {
        name: 'Nets',
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
           mods.hasNets = true;
        }
    },
    'standard_bearer': {
        name: 'Standard Bearer',
        type: AttributeType.special_rule,
        effect: function effect(mods: AttributeModifiers) {
           mods.combatResolutionBonus++;
        }
    },
}