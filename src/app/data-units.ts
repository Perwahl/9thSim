import {BaseSize } from './model';
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

    defaultAttributes : ModelAttributeName[];
    optionalAttributes : ModelAttributeName[];
}

export const UnitTypes: UnitStat[] = [
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

        defaultAttributes: [ModelAttributeName.light_armor, ModelAttributeName.shield, ModelAttributeName.killer_instinct],
        optionalAttributes : [ModelAttributeName.spear]
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

        defaultAttributes: [ModelAttributeName.light_armor, ModelAttributeName.paired_weapons],
        optionalAttributes : []
    },

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
        optionalAttributes : []
    }
]