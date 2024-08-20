import { Monster } from "../types/typedef"


/**
 * 计算某个等级需要的经验
 * @param level 
 * @returns 
 */
export const totalExpNeededForLevel = (level:number) => {
    if(level > 100){
        return 100**3
    }
    return level ** 3
}

/**
 * 计算获得的经验
 * @param baseExp 敌人基础经验
 * @param currentLevel 敌人等级
 * @param isActiveMonster 是否正在战斗的怪兽
 */
export const calculatedExpGainedFromMonster = (baseExp:number,currentLevel:number,isActiveMonster:boolean) => {
    return Math.round((baseExp * currentLevel) / 7) * (1 / (isActiveMonster ? 1 : 2))
}
/**
 * 计算经验值Bar的长度
 * @param currentLevel 
 * @param currentExp 
 */
export const calculatedExpBarCurrentValue = (currentLevel:number,currentExp:number) => {
    const expNeedCurrentLevel = totalExpNeededForLevel(currentLevel)
    let currentExpBar = currentExp - expNeedCurrentLevel
    if(currentExpBar < 0){
        currentExpBar = 0
    }
    const expNeedNextLevel = totalExpNeededForLevel(currentLevel + 1)
    const maxExpBar = expNeedNextLevel - expNeedCurrentLevel


    return currentExpBar/maxExpBar

}

/**
 * 计算升级下一级需要的经验
 * @param currentLevel 
 * @param currentExp 
 * @returns 
 */
export const expNeedToNextLevel = (currentLevel:number,currentExp:number) => {
    if(currentLevel >= 100) {
        return 0
    }
    return totalExpNeededForLevel(currentLevel + 1) - currentExp
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
    if(monster.currentLevel >= 100){
        return stateChange
    }
    monster.currentExp += gainedExp

    let gainedLevel = false
    do {
        gainedLevel = false
        const expRequireForNextLevel = totalExpNeededForLevel(monster.currentLevel + 1)
        if(monster.currentExp >= expRequireForNextLevel){
            const bonusAttack = Phaser.Math.Between(0,1)
            const bonusHealth = Phaser.Math.Between(0,3)
            const hpIncrease = 5 + bonusHealth
            const aktIncrease = 1 + bonusAttack
            monster.currentLevel += 1
            monster.maxHp += hpIncrease
            monster.currentAttack += aktIncrease
            stateChange.level +=1
            stateChange.attack += aktIncrease
            stateChange.health += hpIncrease
            gainedLevel = true
        }
    } while (gainedLevel);
    return stateChange
}