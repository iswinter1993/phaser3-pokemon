import { Scene } from 'phaser';
import { Menu } from "./menu";

export type ConfirmationMenuOptions = keyof typeof CONFIRMATION_MENU_OPTIONS

export const CONFIRMATION_MENU_OPTIONS = Object.freeze({
    YES:'YES',
    NO:'NO',
})
export class ConfirmationMenu extends Menu {
    constructor(scene:Scene,previousSceneName:string){
        const avaliableOptions:ConfirmationMenuOptions[] = [CONFIRMATION_MENU_OPTIONS.YES,CONFIRMATION_MENU_OPTIONS.NO]
      
        super(scene,avaliableOptions)
    }
}