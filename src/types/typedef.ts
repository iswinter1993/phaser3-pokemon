import { AttackKeys } from './../battle/attacks/attack-keys';
import { Scene } from "phaser"
export type Monster = {
    name:string,
    assetKey:string,
    assetFrame?:number,
    maxHp:number,
    currentHp:number,
    baseAttack:number,
    attackIds:number[],
    currentLevel:number
}

/**
 * 
 */
export type BattleMonsterConfig = {
    scene:Scene,
    monsterDetails:Monster,
    scaleHealthBarBackgroundImageByY?:number,
    healthBarComponentPosition:Coordinate,
    skipBattleAnimations:boolean
}

export type Coordinate = {
    x:number,
    y:number
}

export type Attack = {
    id:number,
    name:string,
    animationName:AttackKeys
}

export type Animation = {
    key:string,
    frames?:number[],
    frameRate:number,
    repeat:number,
    delay:number,
    yoyo:boolean,
    assetKey:string
  }
