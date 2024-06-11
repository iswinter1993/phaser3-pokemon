import { GameObjects, Scene } from 'phaser';
import { HealthBar } from '../ui/health-bar';
import { Monster,BattleMonsterConfig,Coordinate, Attack } from '../../types/typedef'; 
import { BATTLLE_ASSET_KEYS } from '../../assets/asset-keys';

export class BattleMonster {
    _scene:Scene;
    _monsterDetails:Monster;
    _phaserGameObject:GameObjects.Image;
    _healthBar:HealthBar;
    _currentHealth:number;
     _maxHealth:number;
     _monsterAttacks:Attack[];
     _phaserHealthBarContainerGameObject:GameObjects.Container
    /**
     * 
     * @param config 怪兽设置
     * @param position 位置
     */
    constructor(config:BattleMonsterConfig,position:Coordinate){
        this._scene = config.scene
        this._monsterDetails = config.monsterDetails
      
        this._currentHealth = this._monsterDetails.currentHp
        this._maxHealth = this._monsterDetails.maxHp
        this._monsterAttacks = []
        this._phaserGameObject = this._scene.add.image(position.x,position.y,this._monsterDetails.assetKey,this._monsterDetails.assetFrame||0)
        this._creatHealthBarComponents(config.scaleHealthBarBackgroundImageByY,config.healthBarComponentPosition)
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

    get level () {
        return this._monsterDetails.currentLevel
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

    _creatHealthBarComponents(scaleHealthBarBackgroundImageByY=1,position:Coordinate){
        this._healthBar = new HealthBar(this._scene,34,34);
        const monsterNameGameText:GameObjects.Text = this._scene.add.text(30,20,this.name,{
            color:'#7E3D3F',
            fontSize:'32px'
        })
        const healthBarBgImage:GameObjects.Image = this._scene.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1,scaleHealthBarBackgroundImageByY)
        const monsterHealthBarLevelText:GameObjects.Text = this._scene.add.text(monsterNameGameText.width+35,23,`L${this.level}`,{
            color:'#ED474B',
            fontSize:'28px'
        })
        const monsterHpText:GameObjects.Text = this._scene.add.text(30,55,'HP',{
            color:'#FF6505',
            fontSize:'24px',
            fontStyle:'italic'
        })

        this._phaserHealthBarContainerGameObject = this._scene.add.container(position.x,position.y, [
            healthBarBgImage,
            monsterNameGameText,
            this._healthBar.container,
            monsterHealthBarLevelText,
            monsterHpText,
        ])
    }

}