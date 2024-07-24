import { AttackKeys } from './../battle/attacks/attack-keys';
import { Scene } from "phaser"
export type Monster = {
    //怪兽个体的唯一id
    id:number,
    //怪兽种类id
    monsterId:number
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

  export const ITEM_EFFECT = Object.freeze({
    HEAL_30:'HEAL_30'
  })

  type ItemEffect = keyof typeof ITEM_EFFECT

  export type Item = {
    id:number,
    name:string,
    description:string
    effect:ItemEffect
}

//data manager中的库存数据类型
type BaseInventoryItem = {
    item:{
        id:number
    },
    quantity:number
}
/**
 * data manager中的库存数据类型
 */
export type Inventory = BaseInventoryItem[]

/**
 * 场景中的库存数据类型
 */
export type InventoryItem = {
    item:Item,
    quantity:number
}
