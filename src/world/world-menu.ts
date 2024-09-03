import { Scene } from 'phaser';
import { Menu } from "../common/menu/menu";
export type MenuOptions = keyof typeof MENU_OPTIONS

export const MENU_OPTIONS = Object.freeze({
    MONSTERDEX:'MONSTERDEX',
    MONSTERS:'MONSTERS',
    BAG:'BAG',
    SAVE:'SAVE',
    OPTIONS:'OPTIONS',
    EXIT:'EXIT'
})
export class WorldMenu extends Menu {
    constructor(scene:Scene){
        super(scene,[MENU_OPTIONS.MONSTERS,MENU_OPTIONS.BAG,MENU_OPTIONS.SAVE,MENU_OPTIONS.EXIT])

    }
}