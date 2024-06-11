import { Scene } from "phaser"
export type Monster = {
    name:string,
    assetKey:string,
    assetFrame?:number,
    maxHp:number,
    currentHp:number,
    baseAttack:number,
    attackIds:number[]
}

export type BattleMonsterConfig = {
    scene:Scene,
    monsterDetails:Monster
}

export type Coordinate = {
    x:number,
    y:number
}

export type Attack = {
    id:number,
    name:string,
    animationName:string
}