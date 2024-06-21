import { GameObjects } from 'phaser';
import { BattleMonsterConfig, Coordinate } from "../../types/typedef";
import { BattleMonster } from "./battle-monster";

const PLAYER_POSITION:Coordinate = Object.freeze({
    x:256,
    y:316
})

export class PlayerBattleMonster extends BattleMonster {
    _healthBarTextGameObject:GameObjects.Text
    constructor(config:BattleMonsterConfig){
        super(config,PLAYER_POSITION)
        this._phaserGameObject.setFlipX(true)
        this._addHealthBarComponents()
    }
    _setHealthBarText(){
        this._healthBarTextGameObject.setText(`${this._currentHealth}/${this._maxHealth}`)
    }
    _addHealthBarComponents(){
        this._healthBarTextGameObject = this._scene.add.text(443,80,``,{
            color:'#7E3D3F',
            fontSize:'16px'
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
}