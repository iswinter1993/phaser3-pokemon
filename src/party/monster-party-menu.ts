import { Scene } from 'phaser';
import { Menu } from "../common/menu/menu";

export type MonsterPartyMenuOptions = keyof typeof MONSTER_PARTY_MENU_OPTIONS

export const MONSTER_PARTY_MENU_OPTIONS = Object.freeze({
    SELECT:'SELECT',
    MOVE:'MOVE',
    SUMMARY:'SUMMARY',
    RELEASE:'RELEASE',
    CANCEL:'CANCEL'
})
export class MonsterPartyMenu extends Menu {
    constructor(scene:Scene,previousSceneName:string){
        const avaliableOptions:MonsterPartyMenuOptions[] = [MONSTER_PARTY_MENU_OPTIONS.SELECT,MONSTER_PARTY_MENU_OPTIONS.SUMMARY,MONSTER_PARTY_MENU_OPTIONS.CANCEL]
        if(previousSceneName === 'WorldScene'){
            avaliableOptions.splice(0,1,MONSTER_PARTY_MENU_OPTIONS.MOVE)
            avaliableOptions.splice(2,0,MONSTER_PARTY_MENU_OPTIONS.RELEASE)
        }
        super(scene,avaliableOptions)
    }
}