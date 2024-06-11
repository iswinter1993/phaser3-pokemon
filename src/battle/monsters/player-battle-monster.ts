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
}