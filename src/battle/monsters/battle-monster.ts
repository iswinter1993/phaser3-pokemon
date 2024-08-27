import { GameObjects, Scene } from 'phaser';
import { Monster,BattleMonsterConfig,Coordinate, Attack } from '../../types/typedef'; 
import { BATTLLE_ASSET_KEYS } from '../../assets/asset-keys';
import { DataUtils } from '../../utils/data-utils';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../assets/font-keys';
import { HealthBar } from '../../common/health-bar';

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
     _monsterHealthBarLevelText:GameObjects.Text;
     _monsterName:GameObjects.Text;
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
        this._healthBar.setMeterPercentageAnimated(this._currentHealth/this._maxHealth,{
            skipBattleAnimations:true
        })
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
        return this._monsterDetails.currentAttack
    }

    get currentHp ():number {
        return this._currentHealth
    }

    /**
     * 切换怪兽方法
     * @param monster 
     */
    switchMonster(monster:Monster){
        this._monsterDetails = monster
        this._currentHealth = this._monsterDetails.currentHp
        this._maxHealth = this._monsterDetails.maxHp
        this._healthBar.setMeterPercentageAnimated(this._currentHealth/this._maxHealth,{skipBattleAnimations:true})
        this._monsterAttacks = []
        /**
         * 通过 attackId 获取招式数据
         */
         this._monsterDetails.attackIds.forEach( attackId => {
            const monsterAttack = DataUtils.getMonsterAttackById(this._scene,attackId)
            if(monsterAttack != undefined){
                this._monsterAttacks.push(monsterAttack)
            }
        })
        this._phaserGameObject.setTexture(this._monsterDetails.assetKey,this._monsterDetails.assetFrame||0)
        this._monsterName.setText(this._monsterDetails.name)
        this._setMonsterLevelText()
        this._monsterHealthBarLevelText.setX(this._monsterName.width + 35)
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

    _setMonsterLevelText(){
        this._monsterHealthBarLevelText.setText(`L${this.level}`)
    }

    _creatHealthBarComponents(scaleHealthBarBackgroundImageByY=1,position:Coordinate){
        this._healthBar = new HealthBar(this._scene,34,34);
        this._monsterName = this._scene.add.text(30,20,this.name,{
            color:'#7E3D3F',
            fontSize:'32px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })
        const healthBarBgImage:GameObjects.Image = this._scene.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1,scaleHealthBarBackgroundImageByY)
        this._monsterHealthBarLevelText = this._scene.add.text(this._monsterName.width+35,23,``,{
            color:'#ED474B',
            fontSize:'28px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })
        this._setMonsterLevelText()

        const monsterHpText:GameObjects.Text = this._scene.add.text(30,55,'HP',{
            color:'#FF6505',
            fontSize:'24px',
            fontStyle:'italic',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
        })

        this._phaserHealthBarContainerGameObject = this._scene.add.container(position.x,position.y, [
            healthBarBgImage,
            this._monsterName,
            this._healthBar.container,
            this._monsterHealthBarLevelText,
            monsterHpText,
        ]).setAlpha(0)
    }

}