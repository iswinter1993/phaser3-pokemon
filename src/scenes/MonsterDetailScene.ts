import { MONSTER_PARTY_ASSET_KEYS } from './../assets/asset-keys';
import { DataUtils } from './../utils/data-utils';
import { dataManager, DATA_MANAGER_STORE_KEYS } from './../utils/data-manager';
import { Monster, Attack } from './../types/typedef';
import { BaseScene } from './BaseScene';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { ExpBar } from '../common/exp-bar';
import { calculatedExpBarCurrentValue, expNeedToNextLevel } from '../utils/level-utils';


const UI_TEXT_STYLE = {
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
    color:'#FFFFFF',
    fontSize:'48px'
}

const MONSTER_MOVE_TEXT_STYLE = {
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
    color:'#000000',
    fontSize:'40px'
}

const MONSTER_EXP_TEXT_STYLE = {
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
    color:'#000000',
    fontSize:'22px'
}
export class MonsterDetailScene extends BaseScene{

    _monsterDetails:Monster
    _monsterAttacks:Attack[]

    constructor(){
        super('MonsterDetailScene')
    }

    init(data:any): void {
        super.init(data)
        this._monsterDetails = data.monster
        if(this._monsterDetails === undefined){
            this._monsterDetails = dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)[0]
        }
        this._monsterAttacks = []
        this._monsterDetails.attackIds.forEach(attackId => {
            const attack = DataUtils.getMonsterAttackById(this,attackId)
            if(attack !== undefined){
                this._monsterAttacks.push(attack)
            }
        });
    }

    create(): void {
        super.create()
        //create main background
        this.add.image(0,0,MONSTER_PARTY_ASSET_KEYS.MONSTER_DETAILS_BACKGROUND).setOrigin(0)
        this.add.text(10,0,'Monster Details',UI_TEXT_STYLE)
        //add monster detail
        this.add.text(20,60,`Lv. ${this._monsterDetails.currentLevel}`,{
            ...UI_TEXT_STYLE,
            fontSize:'40px'
        })

        this.add.text(200,60,this._monsterDetails.name,{
            ...UI_TEXT_STYLE,
            fontSize:'40px'
        })

        this.add.image(160,310,this._monsterDetails.assetKey,0).setOrigin(0,1).setScale(0.7)

        if(this._monsterAttacks.length > 0){
            this._monsterAttacks.forEach((attack,index)=>{
                this.add.text(560,82 + index * 80,attack.name,MONSTER_MOVE_TEXT_STYLE)
            })
        }

        //add monster exp
        this.add.text(20,340,'Current Exp.',MONSTER_EXP_TEXT_STYLE).setOrigin(0)
        this.add.text(516,340,`${this._monsterDetails.currentExp}`,MONSTER_EXP_TEXT_STYLE).setOrigin(1,0)
        this.add.text(20,365,'Exp. to next level',MONSTER_EXP_TEXT_STYLE).setOrigin(0)
        this.add.text(516,365,`${expNeedToNextLevel(this._monsterDetails.currentLevel,this._monsterDetails.currentExp)}`,MONSTER_EXP_TEXT_STYLE).setOrigin(1,0)
        this.add.text(108,392,'EXP',{
            color:'#6505ff',
            fontSize:'14px',
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            fontStyle:'italic'
        })
        const expBar = new ExpBar(this,70,200)
        expBar.setMeterPercentageAnimated(calculatedExpBarCurrentValue(this._monsterDetails.currentLevel,this._monsterDetails.currentExp) ,{skipBattleAnimations:true})

    }
    update(time: number, delta: number): void {
        if(this._controls.isInputLocked){
            return
        }

        if(this._controls.wasBackKeyPressed()){
            this._controls.lockInput = true
            this.scene.stop('MonsterDetailScene')
            this.scene.resume('MonsterPartyScene')
            return
        }
    }
}