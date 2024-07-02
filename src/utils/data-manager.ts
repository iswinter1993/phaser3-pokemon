import { DIRECTION, DirectionType } from './../common/direction';
import { Data, Events } from "phaser";
import { TILE_SIZE } from "../config";


type GlobalState = {
    player:{
        position:{
            x:number,
            y:number
        },
        direction:DirectionType
    }
}

const initialState:GlobalState = {
    player:{
        position:{
            x: 6 * TILE_SIZE,
            y: 21 * TILE_SIZE
        },
        direction:DIRECTION.DOWN
    }
}


export const DATA_MANAGER_STORE_KEYS = Object.freeze({
    PLAYER_POSITION:'PLAYER_POSITION',
    PLAYER_DIRECTION:'PLAYER_DIRECTION'
})

export class DataManager extends Events.EventEmitter {
    _store: Data.DataManager
    constructor(){
        super()
        this._store = new Data.DataManager(this)
        this._updateDataManager(initialState)
    }


    get store ():Data.DataManager {
        return this._store
    }

    _updateDataManager(data:GlobalState){
        this._store.set({
            [DATA_MANAGER_STORE_KEYS.PLAYER_POSITION]:data.player.position,
            [DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION]:data.player.direction
        })
    }
}

export const dataManager = new DataManager()