import { GameObjects } from 'phaser';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../assets/font-keys';
import { ExpBar } from '../../common/exp-bar';
import { BattleMonsterConfig, Coordinate, Monster } from "../../types/typedef";
import { calculatedExpBarCurrentValue, handleMonsterGainingExp } from '../../utils/level-utils';
import { BattleMonster } from "./battle-monster";

const PLAYER_POSITION:Coordinate = Object.freeze({
    x:256,
    y:316
})

export class PlayerBattleMonster extends BattleMonster {
    _healthBarTextGameObject:GameObjects.Text
    _expBar:ExpBar
    constructor(config:BattleMonsterConfig){
        super(config,PLAYER_POSITION)
        this._phaserGameObject.setFlipX(true)
        this._addHealthBarComponents()
        this._addExpBarComponents()
    }
    _setHealthBarText(){
        this._healthBarTextGameObject.setText(`${this._currentHealth}/${this._maxHealth}`)
    }
    _addHealthBarComponents(){
        this._healthBarTextGameObject = this._scene.add.text(443,80,``,{
            color:'#7E3D3F',
            fontSize:'16px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        }).setOrigin(1,0)
        this._setHealthBarText()
        this._phaserHealthBarContainerGameObject.add(this._healthBarTextGameObject)
    }
    /**
     * 
     * @param damage 
     * @param callback 
     */
    takeDamage(damage:number,callback?:()=>void){
        super.takeDamage(damage,callback);
        this._setHealthBarText()
    }
    playMonsterAppearAnimation(callback:()=>void){
        const startXPos = -30 //动画起始位置
        const endXPos = PLAYER_POSITION.x //动画结束位置
        this._phaserGameObject.setPosition(startXPos,PLAYER_POSITION.y)
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
            duration:800,
            delay:0,
            onComplete:()=>{
                callback()
            }
        })
    }
    playMonsterHealthAppearAnimation(callback:()=>void){
        const startXPos = 1000 //动画起始位置
        const endXPos = this._phaserHealthBarContainerGameObject.x //动画结束位置

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
            duration:800,
            delay:0,
            onComplete:()=>{
                callback()
            }
        })
    }
    playDeathAnimation(callback:()=>void){
        const startYPos = PLAYER_POSITION.y //动画起始位置
        const endYPos = PLAYER_POSITION.y + 400 //动画结束位置

        const healthStartXPos = this._phaserHealthBarContainerGameObject.x
        const healthEndXPos = 1200

        if(this._skipBattleAnimations){
            this._phaserGameObject.setY(endYPos)
            this._phaserHealthBarContainerGameObject.setAlpha(0)
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

        this._scene.add.tween({
            targets:this._phaserHealthBarContainerGameObject,
            x:{
                from:healthStartXPos,
                start:healthStartXPos,
                to:healthEndXPos
            },
            ease:'Quint.Out',
            duration:1600,
            delay:0,
            onComplete:()=>{
               this._phaserHealthBarContainerGameObject.setAlpha(0)
               this._phaserHealthBarContainerGameObject.setX(healthStartXPos)
            }
        })
    }

    updateMonsterHealth(updatedHP:number){
        this._currentHealth = updatedHP
        if(this._currentHealth > this._maxHealth){
            this._currentHealth = this._maxHealth
        }
        this._healthBar.setMeterPercentageAnimated(this._currentHealth/this._maxHealth,{
            skipBattleAnimations:true,
        })
        this._setHealthBarText()
    }

    _addExpBarComponents(){
        this._expBar = new ExpBar(this._scene,34,54)
        this._expBar.setMeterPercentageAnimated( calculatedExpBarCurrentValue(this._monsterDetails.currentLevel,this._monsterDetails.currentExp),{skipBattleAnimations:true})
        const monsterExp = this._scene.add.text(30,100,'EXP',{
            color:'#6505ff',
            fontSize:'14px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            fontStyle:'italic'
        })
        this._phaserHealthBarContainerGameObject.add([this._expBar.container,monsterExp])
    }

    /**
     * 
     * @param gainedExp 
     * @returns 
     */
    updateMonsterExp(gainedExp:number){
        const data = handleMonsterGainingExp(this._monsterDetails,gainedExp)
        console.log(data)
        return data

    }

/**
 * 
 * @param callback 
 * @param levelUp 
 */
    updateMonsterExpBar(levelUp:boolean,skipBattleAnimations:boolean,callback?:()=>void){
        const cb = ()=>{
            this._setMonsterLevelText()
            this._maxHealth = this._monsterDetails.maxHp
            this.updateMonsterHealth(this._currentHealth)
            if(callback){
                callback()
            }
        }
        if(levelUp){
            this._expBar.setMeterPercentageAnimated(1,{
                callback:()=>{
                    this._scene.time.delayedCall(500,()=>{
                        this._expBar.setMeterPercentageAnimated(0,{skipBattleAnimations:true})
                        this._expBar.setMeterPercentageAnimated(calculatedExpBarCurrentValue(this._monsterDetails.currentLevel,this._monsterDetails.currentExp),{
                            callback:cb
                        })
                    })
                }
            })
            
            return
        }

        this._expBar.setMeterPercentageAnimated(calculatedExpBarCurrentValue(this._monsterDetails.currentLevel,this._monsterDetails.currentExp),{
            callback:cb
        })
    }
    switchMonster(monster:Monster){
        super.switchMonster(monster)
        this._setHealthBarText()
        this.updateMonsterExpBar(false,true,undefined)
    }
    
}