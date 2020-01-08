import { BaseSize } from './model';
import { ModelAttributeName } from './data-attributes';

export class UnitStat {

    name: string;

    dis: number;
    hp: number;
    def: number;
    res: number;
    arm: number;
    att: number;
    off: number;
    str: number;
    ap: number;
    agi: number;

    baseSize: BaseSize;

    defaultAttributes: ModelAttributeName[];
    optionalAttributes: ModelAttributeName[];
}

const DreadElves: UnitStat[] = [
    {
        name: "Dread Legionnaires",
        dis: 8,

        hp: 1,
        def: 4,
        res: 3,
        arm: 0,

        att: 1,
        off: 4,
        str: 3,
        ap: 0,
        agi: 5,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.light_armor, ModelAttributeName.shield, ModelAttributeName.killer_instinct, ModelAttributeName.lightning_reflexes],
        optionalAttributes: [ModelAttributeName.spear]
    },

    {
        name: "Blades of Nahb",
        dis: 8,

        hp: 1,
        def: 2,
        res: 3,
        arm: 0,

        att: 2,
        off: 4,
        str: 3,
        ap: 0,
        agi: 6,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.light_armor, ModelAttributeName.paired_weapons, ModelAttributeName.lightning_reflexes, ModelAttributeName.killer_instinct, ModelAttributeName.poison_attacks],
        optionalAttributes: []
    },   
    {
        name: "Tower Guard",
        dis: 8,

        hp: 1,
        def: 6,
        res: 3,
        arm: 0,

        att: 2,
        off: 6,
        str: 3,
        ap: 1,
        agi: 6,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.heavy_armor, ModelAttributeName.killer_instinct, ModelAttributeName.lightning_reflexes, ModelAttributeName.halberd],
        optionalAttributes: []
    }    
]

const OrcsAndGoblins: UnitStat[] = [           
    {
        name: "Orcs",
        dis: 7,

        hp: 1,
        def: 3,
        res: 4,
        arm: 0,

        att: 1,
        off: 3,
        str: 3,
        ap: 0,
        agi: 2,

        baseSize: BaseSize.Infantry25x25,

        defaultAttributes: [ModelAttributeName.light_armor],
        optionalAttributes: [ModelAttributeName.paired_weapons, ModelAttributeName.shield]
    },    
    {
        name: "Common Goblins",
        dis: 6,

        hp: 1,
        def: 2,
        res: 3,
        arm: 0,

        att: 1,
        off: 2,
        str: 3,
        ap: 0,
        agi: 2,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.light_armor],
        optionalAttributes: [ModelAttributeName.spear, ModelAttributeName.shield]
    },
    {
        name: "Cave Goblins",
        dis: 5,

        hp: 1,
        def: 2,
        res: 3,
        arm: 0,

        att: 1,
        off: 2,
        str: 3,
        ap: 0,
        agi: 3,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [],
        optionalAttributes: [ModelAttributeName.spear, ModelAttributeName.shield]
    },
    {
        name: "Forest Goblins",
        dis: 6,

        hp: 1,
        def: 2,
        res: 3,
        arm: 0,

        att: 1,
        off: 2,
        str: 3,
        ap: 0,
        agi: 2,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.poison_attacks],
        optionalAttributes: [ModelAttributeName.spear, ModelAttributeName.shield]
    },    
]

const Empire: UnitStat[] = [    
    {
        name: "Heavy Infantry",
        dis: 7,

        hp: 1,
        def: 3,
        res: 3,
        arm: 0,

        att: 1,
        off: 3,
        str: 3,
        ap: 0,
        agi: 3,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.light_armor, ModelAttributeName.shield],
        optionalAttributes: [ModelAttributeName.halberd, ModelAttributeName.spear]
    },
    {
        name: "Light Infantry",
        dis: 7,

        hp: 1,
        def: 3,
        res: 3,
        arm: 0,

        att: 1,
        off: 3,
        str: 3,
        ap: 0,
        agi: 3,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.light_armor],
        optionalAttributes: []
    },
    {
        name: "State Militia",
        dis: 6,

        hp: 1,
        def: 3,
        res: 3,
        arm: 0,

        att: 1,
        off: 3,
        str: 3,
        ap: 0,
        agi: 3,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.paired_weapons],
        optionalAttributes: []
    },
    {
        name: "Imperial Guard",
        dis: 8,

        hp: 1,
        def: 4,
        res: 3,
        arm: 0,

        att: 1,
        off: 4,
        str: 4,
        ap: 1,
        agi: 3,

        baseSize: BaseSize.Infantry20x20,

        defaultAttributes: [ModelAttributeName.plate_armor],
        optionalAttributes: [ModelAttributeName.shield, ModelAttributeName.great_weapon]
    },
]

export const UnitTypes: Array<UnitStat>[] = [
    DreadElves, OrcsAndGoblins, Empire
]