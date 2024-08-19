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
/**
 * 计算经验值Bar的长度
 * @param currentLevel 
 * @param currentExp 
 */
export const calculatedExpBarCurrentValue = (currentLevel:number,currentExp:number) => {
    return 5

}

/**
 * 计算升级下一级需要的经验
 * @param currentLevel 
 * @param currentExp 
 * @returns 
 */
export const expNeedToNextLevel = (currentLevel:number,currentExp:number) => {
    return 5
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
        level:1,
        health:10,
        attack:10
    }
    return stateChange
}