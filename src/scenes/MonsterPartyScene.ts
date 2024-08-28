import { ITEM_EFFECT } from './../types/typedef';
import { DIRECTION, DirectionType } from './../common/direction';
import { dataManager, DATA_MANAGER_STORE_KEYS } from './../utils/data-manager';
import { UI_ASSET_KEYS, MONSTER_PARTY_ASSET_KEYS, BATTLLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS } from './../assets/asset-keys';
import { GameObjects } from 'phaser';
import { BaseScene } from './BaseScene';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { Item, Monster } from '../types/typedef';
import { HealthBar } from '../common/health-bar';

const UI_TEXT_STYLE = {
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
    color:'#FFFFFF',
    fontSize:'24px'
}

const MONSTER_PARTY_POSITION = Object.freeze({
    EVEN:{
        x:0,
        y:10
    },
    ODD:{
        x:510,
        y:40
    },
    increment:150
})

export type MonsterPartySceneData = {
    previousScene:string,
    itemSelected?:Item,
    activeBattleMonsterInPartyIndex?:number,
}

export class MonsterPartyScene extends BaseScene {
    _monstersPartyBackgrounds:GameObjects.Image[]
    _cancelButton:GameObjects.Image
    _infoTextGameObject:GameObjects.Text
    _healthBars:HealthBar[]
    _healthBarTextGameObjects:GameObjects.Text[]
    _selectedPartyMonsterIndex:number
    _monsters:Monster[]
    _sceneData:MonsterPartySceneData
    _waitingInput:boolean
    constructor(){
        super('MonsterPartyScene')
      
    }
    init(data: any): void {
        super.init(data)
        this._sceneData = data
        this._monstersPartyBackgrounds = []
        this._healthBars = []
        this._healthBarTextGameObjects = []
        this._selectedPartyMonsterIndex = 0
        this._monsters = dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)
        this._waitingInput = false
    }
    create(){
        super.create()
        //create background  
        this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000,1).setOrigin(0)
        //tileSprite 图片平铺方法
        this.add.tileSprite(0,0,this.scale.width,this.scale.height,MONSTER_PARTY_ASSET_KEYS.PARTY_BACKGROUND,0).setOrigin(0).setAlpha(0.7)
        //create button
        const buttonContainer = this.add.container(883,519,[])
        this._cancelButton = this.add.image(0,0,UI_ASSET_KEYS.BLUE_BUTTON,0).setOrigin(0).setScale(0.7,1).setAlpha(0.7)
        const cancelText = this.add.text(66.5,20.6,'cancel',UI_TEXT_STYLE).setOrigin(0.5)
        buttonContainer.add([this._cancelButton,cancelText])
        //create info container
        const infoContainer = this.add.container(4,this.scale.height - 69,[])
        const infoDisplay = this.add.rectangle(0,0,867,65,0xede4f3,1).setOrigin(0).setStrokeStyle(8,0x905ac2,1)
        this._infoTextGameObject = this.add.text(15,14,'',{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#000000',
            fontSize:'23px'
        })
        infoContainer.add([infoDisplay,this._infoTextGameObject])
        this._updateInfoContainerText()
        //create monsters in party
        this._monsters.forEach((monster,index)=>{
            const isEven = index % 2 === 0
            const x = isEven ? MONSTER_PARTY_POSITION.EVEN.x : MONSTER_PARTY_POSITION.ODD.x
            const y = isEven ? MONSTER_PARTY_POSITION.EVEN.y + MONSTER_PARTY_POSITION.increment * Math.floor(index / 2) : MONSTER_PARTY_POSITION.ODD.y + MONSTER_PARTY_POSITION.increment * Math.floor(index / 2)
            this._createMonster(x,y,monster)
        })
        this._movePlayerInputCursor(DIRECTION.NONE)
     

    }

    update(time: number, delta: number): void {
        if(this._controls.isInputLocked){
            return
        }
        
        if(this._controls.wasBackKeyPressed()){
            if(this._waitingInput){
                this._updateInfoContainerText()
                this._waitingInput = false
                return
            }
            this._goBackToPreviousScene(false,false)
            return
        }
        const wasSpaceKeyPressed = this._controls.wasSpaceKeyPressed()
        if(wasSpaceKeyPressed){
            if(this._selectedPartyMonsterIndex === -1){
                this._goBackToPreviousScene(false,false)
                return
            }
            if(this._waitingInput){
                this._updateInfoContainerText()
                this._waitingInput = false
                return
            }
            if(this._sceneData.previousScene === 'InventoryScene' && this._sceneData.itemSelected){
                //使用道具
                this._handleItemUsed()
                return
            }

            if(this._sceneData.previousScene === 'BattleScene'){
                this._handleSwitchMonster()
                return
            }

            this._controls.lockInput = true
            const sceneDataToPass = {
                monster:this._monsters[this._selectedPartyMonsterIndex]
            }
            this.scene.launch('MonsterDetailScene',sceneDataToPass)
            this.scene.pause('MonsterPartyScene')
            return
        }
        if(this._waitingInput){
            return
        }
        const selectedDirection = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._movePlayerInputCursor(selectedDirection)
            this._updateInfoContainerText()
        }
    }

    _updateInfoContainerText(){
        if(this._selectedPartyMonsterIndex === -1){
            this._infoTextGameObject.setText('Go back')
            return
        }
        this._infoTextGameObject.setText('Choose a monster')
    }

    /**
     * 
     * @param x 
     * @param y 
     * @param monsterDetails 
     * @returns 
     */
    _createMonster(x:number,y:number,monsterDetails:Monster){
        const container = this.add.container(x,y,[])
        const background = this.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2)
        this._monstersPartyBackgrounds.push(background)
        const leftCapShadow = this.add.image(160,67,HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,0).setOrigin(0).setAlpha(0.5)
        const middleShadow = this.add.image(leftCapShadow.x + leftCapShadow.width,67,HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,0).setOrigin(0).setAlpha(0.5)
        middleShadow.displayWidth = 285
        const rightCapShadow = this.add.image(middleShadow.x + middleShadow.displayWidth,67,HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW,0).setOrigin(0).setAlpha(0.5)

        const monsterImage = this.add.image(35,20,monsterDetails.assetKey,monsterDetails.assetFrame).setOrigin(0).setScale(0.35)
        const healthBar = new HealthBar(this,100,40,240)
        healthBar.setMeterPercentageAnimated(monsterDetails.currentHp / monsterDetails.maxHp,{
            duration:0,
            skipBattleAnimations:true
        })
        this._healthBars.push(healthBar)

        const monsterNameGameText = this.add.text(162,20,monsterDetails.name,{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#FFFFFF',
            fontSize:'30px'
        })

        const monsterHealthBarLevelText = this.add.text(26,116,`Lv. ${monsterDetails.currentLevel}`,{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#FFFFFF',
            fontSize:'22px'
        })

        const monsterHpText = this.add.text(164,66,'HP',{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#FF6505',
            fontSize:'24px',
            fontStyle:'italic'
        })

        const healthBarNumberHpTextGameObject = this.add.text(458,95,`${monsterDetails.currentHp}/${monsterDetails.maxHp}`,{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#FFFFFF',
            fontSize:'38px'
        }).setOrigin(1,0)
        this._healthBarTextGameObjects.push(healthBarNumberHpTextGameObject)


        container.add([
            background,
            leftCapShadow,
            middleShadow,
            rightCapShadow,
            healthBar.container,
            monsterImage,
            monsterNameGameText,
            monsterHealthBarLevelText,
            monsterHpText,
            healthBarNumberHpTextGameObject
        ])
        return container
    }

    /**
     * @param itemUsed 是否使用道具
     * @param wasMonsterSelected 是否切换怪兽
     */
    _goBackToPreviousScene(itemUsed:boolean,wasMonsterSelected:boolean){
        this._controls.lockInput = true
        
        this.scene.stop('MonsterPartyScene')
        this.scene.resume(this._sceneData.previousScene,{
            itemUsed,
            selectedMonsterIndex:wasMonsterSelected ? this._selectedPartyMonsterIndex : undefined,
            wasMonsterSelected
        })
    }


    _movePlayerInputCursor(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
                if(this._selectedPartyMonsterIndex === -1){
                    break
                }else{
                    this._selectedPartyMonsterIndex += 2
                    if(this._selectedPartyMonsterIndex > this._monsters.length - 1){
                        this._selectedPartyMonsterIndex = -1
                    }
    
                    if(this._selectedPartyMonsterIndex === -1){
                        this._cancelButton.setTexture(UI_ASSET_KEYS.BLUE_BUTTON_SELECTED,0).setAlpha(1)
                        break;
                    }
                }
                // this._monstersPartyBackgrounds[this._selectedPartyMonsterIndex].setAlpha(1)
                break;
            case DIRECTION.UP:
                if(this._selectedPartyMonsterIndex === -1){
                    this._selectedPartyMonsterIndex = this._monsters.length - 1
                    this._cancelButton.setTexture(UI_ASSET_KEYS.BLUE_BUTTON,0).setAlpha(0.7)
                }else{

                    this._selectedPartyMonsterIndex -= 2
                    if(this._selectedPartyMonsterIndex < 0 ){
                        this._selectedPartyMonsterIndex = 0
                    }
                    
    
                    if(this._selectedPartyMonsterIndex === -1){
                        this._cancelButton.setTexture(UI_ASSET_KEYS.BLUE_BUTTON_SELECTED,0).setAlpha(1)
                        break;
                    }
                }
                // this._monstersPartyBackgrounds[this._selectedPartyMonsterIndex].setAlpha(1)
                break;
            case DIRECTION.LEFT:
                if(this._selectedPartyMonsterIndex === -1){
                    break
                }else{
                    this._selectedPartyMonsterIndex -= 1
                    if(this._selectedPartyMonsterIndex < 0){
                        this._selectedPartyMonsterIndex = this._monsters.length - 1
                    }
                }
                break;
            case DIRECTION.RIGHT:
                if(this._selectedPartyMonsterIndex === -1){
                    break
                }else{
                    this._selectedPartyMonsterIndex += 1
                    if(this._selectedPartyMonsterIndex > this._monsters.length - 1){
                        this._selectedPartyMonsterIndex = 0
                    }
                }
                break;
            case DIRECTION.NONE:

                break;
        
            default:
                break;
        }
        this._monstersPartyBackgrounds[this._selectedPartyMonsterIndex]?.setAlpha(1)
        this._monstersPartyBackgrounds.forEach((obj,index)=>{
            if(this._selectedPartyMonsterIndex === index){
                return
            }
            obj.setAlpha(0.7)
        })
    }

    _handleItemUsed(){
        switch (this._sceneData.itemSelected?.effect) {
            case ITEM_EFFECT.HEAL_30:
                this._handleHealthItemUsed(30)
                break;
        
            default:
                break;
        }
    }

    /**
     * 治疗
     * @param amount 
     */
    _handleHealthItemUsed(amount:number){
        const maxHp = this._monsters[this._selectedPartyMonsterIndex].maxHp
        //判断怪兽是否死亡
        if(this._monsters[this._selectedPartyMonsterIndex].currentHp === 0){
            this._infoTextGameObject.setText('cannot heal dead monster.')
            this._waitingInput = true
            return
        }
        //判断怪兽是否满血
        if(this._monsters[this._selectedPartyMonsterIndex].currentHp === maxHp){
            this._infoTextGameObject.setText('Monster is already healed.')
            this._waitingInput = true
            return
        }

        this._controls.lockInput = true
        this._monsters[this._selectedPartyMonsterIndex].currentHp += amount
        if(this._monsters[this._selectedPartyMonsterIndex].currentHp > maxHp){
            this._monsters[this._selectedPartyMonsterIndex].currentHp = maxHp
        }
        this._infoTextGameObject.setText(`Healed monster by ${amount} HP.`)
        const currentHp = this._monsters[this._selectedPartyMonsterIndex].currentHp
        this._healthBars[this._selectedPartyMonsterIndex].setMeterPercentageAnimated(currentHp/maxHp,{
            callback:()=>{
                this._healthBarTextGameObjects[this._selectedPartyMonsterIndex].setText(`${currentHp}/${maxHp}`)
                dataManager.store.set(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY,this._monsters)
                this.time.delayedCall(300,()=>{
                    this._goBackToPreviousScene(true,false)
                })
            }
        })
    }
    /**
     * 切换怪兽
     */
    _handleSwitchMonster(){
        if(this._monsters[this._selectedPartyMonsterIndex].currentHp === 0){
            this._infoTextGameObject.setText('Selected monster is not able fight.')
            this._waitingInput = true
            return
        }
        if(this._sceneData.activeBattleMonsterInPartyIndex === this._selectedPartyMonsterIndex){
            this._infoTextGameObject.setText('Selected monster is already battle.')
            this._waitingInput = true
            return
        }
        this._waitingInput = false
        this._goBackToPreviousScene(false,true)
    }

}