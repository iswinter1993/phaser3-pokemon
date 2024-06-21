import { GameObjects, Scene } from 'phaser';
import { HealthBar } from '../ui/health-bar';
import { Monster,BattleMonsterConfig,Coordinate, Attack } from '../../types/typedef'; 
import { BATTLLE_ASSET_KEYS } from '../../assets/asset-keys';
import { DataUtils } from '../../utils/data-utils';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../assets/font-keys';

export class BattleMonster {
    _scene:Scene;
    _monsterDetails:Monster;
    _phaserGameObject:GameObjects.Image;
    _healthBar:HealthBar;
    _currentHealth:number;
     _maxHealth:number;
     _monsterAttacks:Attack[];
     _phaserHealthBarContainerGameObject:GameObjects.Container
     _skipBattleAnimations:boolean;
    /**
     * 
     * @param config 怪兽设置
     * @param position 位置
     */
    constructor(config:BattleMonsterConfig,position:Coordinate){
        this._scene = config.scene
        this._monsterDetails = config.monsterDetails
        this._skipBattleAnimations = config.skipBattleAnimations
        this._currentHealth = this._monsterDetails.currentHp
        this._maxHealth = this._monsterDetails.maxHp
        this._monsterAttacks = []
        this._phaserGameObject = this._scene.add.image(position.x,position.y,this._monsterDetails.assetKey,this._monsterDetails.assetFrame||0).setAlpha(0)
        this._creatHealthBarComponents(config.scaleHealthBarBackgroundImageByY,config.healthBarComponentPosition)
        /**
         * 通过 attackId 获取招式数据
         */
        this._monsterDetails.attackIds.forEach( attackId => {
            const monsterAttack = DataUtils.getMonsterAttackById(this._scene,attackId)
            if(monsterAttack != undefined){
                this._monsterAttacks.push(monsterAttack)
            }
        })
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

    playMonsterAppearAnimation(callback:()=>void){
        throw new Error('playMonsterAppearAnimation方法没有实现')
    }
    playMonsterHealthAppearAnimation(callback:()=>void){
        throw new Error('playMonsterHealthAppearAnimation方法没有实现')
    }
    playTakeDamageAnimation(callback:()=>void){
        if(this._skipBattleAnimations) {
            this._phaserGameObject.setAlpha(1)
            callback()
            return
        }
        this._scene.add.tween({
            targets:this._phaserGameObject,
            alpha:{
                form:1,
                start:1,
                to:0
            },
            delay:0,
            duration:150,
            repeat:10,
            onComplete:()=>{
                callback()
                this._phaserGameObject.setAlpha(1)
            }
        })
    }
    playDeathAnimation(callback:()=>void){
        throw new Error('playDeathAnimation方法没有实现')
    }

    _creatHealthBarComponents(scaleHealthBarBackgroundImageByY=1,position:Coordinate){
        this._healthBar = new HealthBar(this._scene,34,34);
        const monsterNameGameText:GameObjects.Text = this._scene.add.text(30,20,this.name,{
            color:'#7E3D3F',
            fontSize:'32px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })
        const healthBarBgImage:GameObjects.Image = this._scene.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1,scaleHealthBarBackgroundImageByY)
        const monsterHealthBarLevelText:GameObjects.Text = this._scene.add.text(monsterNameGameText.width+35,23,`L${this.level}`,{
            color:'#ED474B',
            fontSize:'28px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })
        const monsterHpText:GameObjects.Text = this._scene.add.text(30,55,'HP',{
            color:'#FF6505',
            fontSize:'24px',
            fontStyle:'italic',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })

        this._phaserHealthBarContainerGameObject = this._scene.add.container(position.x,position.y, [
            healthBarBgImage,
            monsterNameGameText,
            this._healthBar.container,
            monsterHealthBarLevelText,
            monsterHpText,
        ]).setAlpha(0)
    }

}