import { Monster } from "../types/typedef"

/**
 * 计算获得的经验
 * @param baseExp 敌人基础经验
 * @param currentLevel 敌人等级
 * @param isActiveMonster 是否正在战斗的怪兽
 */
export const calculatedExpGainedFromMonster = (baseExp:number,currentLevel:number,isActiveMonster:boolean) => {
    return 10
}


export type StateChange = {
    level:number,
    health:number,
    attack:number
}
/**
 * 怪兽获取经验升级
 * @param monster 
 * @param gainedExp 
 * @returns 
 */

export const handleMonsterGainingExp = (monster:Monster,gainedExp:number) => {
    const stateChange = {
        level:0,
        health:0,
        attack:0
    }
    return stateChange
}