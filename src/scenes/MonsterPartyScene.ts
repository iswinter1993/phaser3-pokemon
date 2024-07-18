import { dataManager, DATA_MANAGER_STORE_KEYS } from './../utils/data-manager';
import { UI_ASSET_KEYS, MONSTER_PARTY_ASSET_KEYS, BATTLLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS } from './../assets/asset-keys';
import { HealthBar } from './../battle/ui/health-bar';
import { GameObjects } from 'phaser';
import { BaseScene } from './BaseScene';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { Monster } from '../types/typedef';

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

export class MonsterPartyScene extends BaseScene {
    _monstersPartyBackgrounds:GameObjects.Image[]
    _cancelButton:GameObjects.Image
    _infoTextGameObject:GameObjects.Text
    _healthBars:HealthBar[]
    _healthBarTextGameObjects:GameObjects.Text[]
    _selectedPartyMonsterIndex:number
    _monsters:Monster[]
    constructor(){
        super('MonsterPartyScene')
        this._monstersPartyBackgrounds = []
        this._healthBars = []
        this._healthBarTextGameObjects = []
        this._selectedPartyMonsterIndex = 0
        this._monsters = dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)
    }
    create(){
        super.create()
        //create background  
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
        // this._createMonster(0,10,dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)[0])
        // this.add.image(0,10,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2)
        // this.add.image(510,40,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2).setAlpha(0.7)
        // this.add.image(0,160,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2).setAlpha(0.7)
        // this.add.image(510,190,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2).setAlpha(0.7)
        // this.add.image(0,310,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2).setAlpha(0.7)
        // this.add.image(510,340,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,0).setOrigin(0).setScale(1.1,1.2).setAlpha(0.35)

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

}