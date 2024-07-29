import { DataUtils } from './data-utils';
import { Monster, Item, Inventory, InventoryItem } from './../types/typedef';
import { DIRECTION, DirectionType } from './../common/direction';
import { Data, Events, Scene } from "phaser";
import { TEXT_SPEED, TILE_SIZE } from "../config";
import { BATTLE_SCENE_OPTIONS, BATTLE_STYLE_OPTIONS, BattleSceneOptions, BattleStyleOptions, MenuColorOptions, SOUND_OPTIONS, SoundOptions, TEXT_SPEED_OPTIONS, TextSpeedOptions, VolumeOptions } from '../common/option';
import { MONSTER_ASSET_KEYS } from '../assets/asset-keys';

const LOCALSTORAGE_KEY = 'MONSTER_STORAGE_KEY'

type MonsterData = {
    inParty:Monster[]
}

type GlobalState = {
    player:{
        position:{
            x:number,   
            y:number
        },
        direction:DirectionType
    },
    options:{
        textSpeed:TextSpeedOptions
        battleScene:BattleSceneOptions
        battleStyle:BattleStyleOptions
        sound:SoundOptions
        volume:VolumeOptions
        menuColor:MenuColorOptions

    },
    gameStarted:boolean,
    monster:MonsterData,
    inventory:Inventory
}

const initialState:GlobalState = {
    player:{
        position:{
            x: 6 * TILE_SIZE,
            y: 21 * TILE_SIZE
        },
        direction:DIRECTION.DOWN
    },
    options:{
        textSpeed:TEXT_SPEED_OPTIONS.MID,
        battleScene:BATTLE_SCENE_OPTIONS.ON,
        battleStyle:BATTLE_STYLE_OPTIONS.SHIFT,
        sound:SOUND_OPTIONS.ON,
        volume:4,
        menuColor:0
    },
    gameStarted:false,
    monster:{
        inParty:[{
            id:1,
            monsterId:1,
            name:MONSTER_ASSET_KEYS.IGUANIGNITE,
            assetKey:MONSTER_ASSET_KEYS.IGUANIGNITE,
            maxHp:25,
            currentHp:25,
            baseAttack:5,
            attackIds:[2,1],
            currentLevel:5
        }]
    },
    inventory:[
        {
            item:{
                id:1
            },
            quantity:1
        },
        {
            item:{
                id:2
            },
            quantity:5
        },
    ]
}


export const DATA_MANAGER_STORE_KEYS = Object.freeze({
    PLAYER_POSITION:'PLAYER_POSITION',
    PLAYER_DIRECTION:'PLAYER_DIRECTION',
    OPTIONS_TEXT_SPEED:'OPTIONS_TEXT_SPEED',
    OPTIONS_BATTLE_SCENE:'OPTIONS_BATTLE_SCENE',
    OPTIONS_BATTLE_STYLE:'OPTIONS_BATTLE_STYLE',
    OPTIONS_SOUND:'OPTIONS_SOUND',
    OPTIONS_VOLUME:'OPTIONS_VOLUME',
    OPTIONS_MENU_COLOR:'OPTIONS_MENU_COLOR',
    GAME_STARTED:'GAME_STARTED',
    MONSTER_IN_PARTY:'MONSTER_IN_PARTY',
    INVENTORY:'INVENTORY'
})

export class DataManager extends Events.EventEmitter {
    _store: Data.DataManager
    constructor(){
        super()
        console.log('data manager init!!')
        this._store = new Data.DataManager(this)
        this._updateDataManager(initialState)
    }


    get store ():Data.DataManager {
        return this._store
    }

    init(scene:Scene){
        const startMonster = DataUtils.getMonsterById(scene,1)
        this._store.set(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY,[startMonster])
    }

    loadData(){
        if(typeof Storage === 'undefined'){
            console.warn('local storage is not supported')
            return
        }
        const dataToLoad = localStorage.getItem(LOCALSTORAGE_KEY)
        if(!dataToLoad){
            return
        }
        try {
            const parsedData = JSON.parse(dataToLoad)
            console.log('load data',parsedData)
            this._updateDataManager(parsedData)
        } catch (error) {
            console.warn('load error',error)
        }
    }

    saveData(){
        if(typeof Storage === 'undefined'){
            console.warn('local storage is not supported')
            return
        }
        const dataToSave = this._getGlobalState()
        localStorage.setItem(LOCALSTORAGE_KEY,JSON.stringify(dataToSave))
    }

   /**
    * 通过id获取背包数据
    * @param scene 
    * @returns
    */
    getInventory(scene:Scene):InventoryItem[]{
        const items:InventoryItem[] = []
        const inventory = this._store.get(DATA_MANAGER_STORE_KEYS.INVENTORY) as Inventory
        inventory.forEach((baseItem,index)=>{
            const item = DataUtils.getItemById(scene,baseItem.item.id) as Item
            const inventoryItem:InventoryItem = {
                item:item,
                quantity:baseItem.quantity
            }
            items.push(inventoryItem)
        })
        return items
    }
    /**
     * 更新背包数据
     * @param items 
     */
    updateInventory(items:InventoryItem[]){
        const inventory = items.map(item=>{
            return {
                item:{
                    id:item.item.id
                },
                quantity:item.quantity
            }
        })

        this._store.set(DATA_MANAGER_STORE_KEYS.INVENTORY,inventory)
    }

    getAnimatedTextSpeed(){
        const speed:TextSpeedOptions = this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED)
        if(speed === undefined){
            return TEXT_SPEED.MID
        }
        return TEXT_SPEED[speed]
    }

    startNewGame(scene:Scene){
        //获取设置相关数据，重置玩家数据
        const exsitingData = this._getGlobalState()
        exsitingData.player = {...initialState.player}
        exsitingData.gameStarted = initialState.gameStarted
        exsitingData.monster.inParty = [...initialState.monster.inParty]
        exsitingData.inventory = initialState.inventory
        console.log(exsitingData)

        this._store.reset()
        this._updateDataManager(exsitingData)
        this.init(scene)
        this.saveData()
    }

    _updateDataManager(data:GlobalState){
        this._store.set({
            [DATA_MANAGER_STORE_KEYS.PLAYER_POSITION]:data.player.position,
            [DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION]:data.player.direction,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED]:data.options.textSpeed,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE]:data.options.battleScene,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE]:data.options.battleStyle,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND]:data.options.sound,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME]:data.options.volume,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR]:data.options.menuColor,
            [DATA_MANAGER_STORE_KEYS.GAME_STARTED]:data.gameStarted,
            [DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY]:data.monster.inParty,
            [DATA_MANAGER_STORE_KEYS.INVENTORY]:data.inventory
        })
    }
    _getGlobalState(){
        return {
            player:{
                position:this._store.get(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION),
                direction:this._store.get(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION)
            },
            options:{
                textSpeed:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED),
                battleScene:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE),
                battleStyle:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE),
                sound:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND),
                volume:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME),
                menuColor:this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR)
            },
            gameStarted:this._store.get(DATA_MANAGER_STORE_KEYS.GAME_STARTED),
            monster:{
                inParty:[...this._store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)]
            },
            inventory:this._store.get(DATA_MANAGER_STORE_KEYS.INVENTORY)
        }
    }
}

export const dataManager = new DataManager()