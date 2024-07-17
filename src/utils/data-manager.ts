import { DIRECTION, DirectionType } from './../common/direction';
import { Data, Events } from "phaser";
import { TEXT_SPEED, TILE_SIZE } from "../config";
import { BATTLE_SCENE_OPTIONS, BATTLE_STYLE_OPTIONS, BattleSceneOptions, BattleStyleOptions, MenuColorOptions, SOUND_OPTIONS, SoundOptions, TEXT_SPEED_OPTIONS, TextSpeedOptions, VolumeOptions } from '../common/option';

const LOCALSTORAGE_KEY = 'MONSTER_STORAGE_KEY'
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
    gameStarted:boolean
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
    gameStarted:false
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
    GAME_STARTED:'GAME_STARTED'
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

    getAnimatedTextSpeed(){
        const speed:TextSpeedOptions = this._store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED)
        if(speed === undefined){
            return TEXT_SPEED.MID
        }
        return TEXT_SPEED[speed]
    }

    startNewGame(){
        //获取设置相关数据，重置玩家数据
        const exsitingData = this._getGlobalState()
        exsitingData.player = {...initialState.player}
        exsitingData.gameStarted = initialState.gameStarted
        console.log(exsitingData)

        this._store.reset()
        this._updateDataManager(exsitingData)
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
            [DATA_MANAGER_STORE_KEYS.GAME_STARTED]:data.gameStarted
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
            gameStarted:this._store.get(DATA_MANAGER_STORE_KEYS.GAME_STARTED)
        }
    }
}

export const dataManager = new DataManager()