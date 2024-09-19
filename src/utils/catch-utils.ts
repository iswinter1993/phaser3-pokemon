import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";

/**
 * 计算怪兽捕捉概率
 * @param monster 
 */
export const calculateMonsterCaptureResults = (monster:EnemyBattleMonster) =>{
    //最小可捕捉值
    const minValueRequiredForCapture = calculateMinValueForCapture(monster)
    const randomValue = Phaser.Math.Between(0,100)
    return {
        requiredCaptureValue:minValueRequiredForCapture,
        captureValue:randomValue,
        wasCapture: randomValue >= minValueRequiredForCapture
    }
}
/**
 * 计算最小可捕捉值
 * @param monster 
 */
export const calculateMinValueForCapture = (monster:EnemyBattleMonster) => {
    let baseMin = 80
    const healthRatio = (monster.currentHp / monster.maxHp)*100

    if(healthRatio < 25){
        baseMin -= 20
    }else if(healthRatio < 50){
        baseMin -= 15
    }else if(healthRatio < 75){
        baseMin -= 10
    }else if(healthRatio < 90){
        baseMin -= 5
    }
    return baseMin
}