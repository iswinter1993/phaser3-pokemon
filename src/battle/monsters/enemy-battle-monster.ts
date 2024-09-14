import { BattleMonster } from "./battle-monster";
import { BattleMonsterConfig,Coordinate } from "../../types/typedef";


const ENEMY_POSITION:Coordinate = Object.freeze({
    x:768,
    y:144
})
export class EnemyBattleMonster extends BattleMonster {
    constructor(config:BattleMonsterConfig){
        super(config,ENEMY_POSITION)

    }

    /**
     * 打败怪兽可获取得经验
     */
    get baseExpValue(): number {
        return this._monsterDetails.baseExp
    }

    playMonsterAppearAnimation(callback:()=>void){
    
        const startXPos = -30 //动画起始位置
        const endXPos = ENEMY_POSITION.x //动画结束位置
        this._phaserGameObject.setPosition(startXPos,ENEMY_POSITION.y)
        this._phaserGameObject.setAlpha(1)
        if(this._skipBattleAnimations){
            this._phaserGameObject.setX(endXPos)
            callback()
            return
        }
        this._scene.add.tween({
            targets:this._phaserGameObject,
            x:{
                from:startXPos,
                start:startXPos,
                to:endXPos
            },
            ease:'Quint.Out',
            duration:1600,
            delay:0,
            onComplete:()=>{
                callback()
            }
        })
    }
    playMonsterHealthAppearAnimation(callback:()=>void){
       
        const startXPos = -600 //动画起始位置
        const endXPos = 0 //动画结束位置
        this._phaserHealthBarContainerGameObject.setPosition(startXPos,this._phaserHealthBarContainerGameObject.y)
        this._phaserHealthBarContainerGameObject.setAlpha(1)
        if(this._skipBattleAnimations){
            this._phaserHealthBarContainerGameObject.setX(endXPos)
            callback()
            return
        }
        this._scene.add.tween({
            targets:this._phaserHealthBarContainerGameObject,
            x:{
                from:startXPos,
                start:startXPos,
                to:endXPos
            },
            ease:'Quint.Out',
            duration:1500,
            delay:0,
            onComplete:()=>{
                callback()
            }
        })
    }
    playDeathAnimation(callback:()=>void){
        const startYPos = ENEMY_POSITION.y //动画起始位置
        const endYPos = ENEMY_POSITION.y - 400 //动画结束位置
        if(this._skipBattleAnimations){
            this._phaserGameObject.setY(endYPos)
            callback()
            return
        }
        this._scene.add.tween({
            targets:this._phaserGameObject,
            y:{
                from:startYPos,
                start:startYPos,
                to:endYPos
            },
            ease:'Quint.Out',
            duration:1600,
            delay:0,
            onComplete:()=>{
                callback()
            }
        })
    }
    /**
     * 
     * @returns 返回招式的随机数
     */
    pickRandomMove(){
        return Phaser.Math.Between(0,this._monsterAttacks.length - 1)
    }

    playCatchEnemy(){
        return new Promise(resolve=>{
            if(this._skipBattleAnimations){
                this._phaserGameObject.setAlpha(0)
                resolve('catchEnemy done')
                return
            }
          this._scene.tweens.add({
            targets:this._phaserGameObject,
            duration:500,
            alpha:{
              from:1,
              start:1,
              to:0
            },
            ease:Phaser.Math.Easing.Sine.InOut,
            onComplete:()=>{
              resolve('catchEnemy done')
            }
          })
        })
      }
    playCatchEnemyFailed(){
        return new Promise(resolve=>{
            if(this._skipBattleAnimations){
                this._phaserGameObject.setAlpha(1)
                resolve('catchEnemy done')
                return
            }
          this._scene.tweens.add({
            targets:this._phaserGameObject,
            duration:500,
            alpha:{
              from:0,
              start:0,
              to:1
            },
            ease:Phaser.Math.Easing.Sine.InOut,
            onComplete:()=>{
              resolve('catchEnemy done')
            }
          })
        })
      }
}