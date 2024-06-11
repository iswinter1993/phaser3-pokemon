import { GameObjects, Scene } from 'phaser';
import { HealthBar } from '../ui/health-bar';
import { Monster,BattleMonsterConfig,Coordinate, Attack } from '../../types/typedef'; 

export class BattleMonster {
    _scene:Scene;
    _monsterDetails:Monster;
    _phaserGameObject:GameObjects.Image;
    private _healthBar:HealthBar;
    private _currentHealth:number;
    private _maxHealth:number;
    private _monsterAttacks:Attack[];
    /**
     * 
     * @param config 怪兽设置
     * @param position 位置
     */
    constructor(config:BattleMonsterConfig,position:Coordinate){
        this._scene = config.scene
        this._monsterDetails = config.monsterDetails
        this._healthBar = new HealthBar(this._scene,34,34);
        this._currentHealth = this._monsterDetails.currentHp
        this._maxHealth = this._monsterDetails.maxHp
        this._monsterAttacks = []
        this._phaserGameObject = this._scene.add.image(position.x,position.y,this._monsterDetails.assetKey,this._monsterDetails.assetFrame||0)
    }

    get phaserGameObject ():GameObjects.Image {
        return this._phaserGameObject
    }
    get healthBar ():HealthBar {
        return this._healthBar
    }
    /**
     * 是否被打倒
     */
    get isFainted ():boolean {
        return this._currentHealth <= 0
    }

    get name ():string {
        return this._monsterDetails.name
    }

    get attacks ():Attack[] {
        return [...this._monsterAttacks]
    }

    get baseAttack ():number {
        return this._monsterDetails.baseAttack
    }
    /**
     * 受到伤害更新血量和动画
     * @param damage 
     * @param callback 
     */
    takeDamage(damage:number,callback?:()=>void){
        this._currentHealth -= damage
        if(this._currentHealth < 0){
            this._currentHealth = 0
        }
        this._healthBar.setMeterPercentageAnimated(this._currentHealth/this._maxHealth,{callback})
    } 

}