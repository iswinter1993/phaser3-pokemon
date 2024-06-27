import { Scene } from 'phaser';
import { WORLD_ASSET_KEYS } from '../assets/asset-keys';
import { Player } from '../world/characters/player';
//通过网格的大小 乘 PLAYER_POSITION的x或y 实现移动位置

const TILE_SIZE = 64

const PLAYER_POSITION = Object.freeze({
    x:1 * TILE_SIZE,
    y:1 * TILE_SIZE
})

export class WorldScene extends Scene {
    _player:Player
    constructor(){
        super('WorldScene')
    }
    create(){

        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_BACKGROUND,0).setOrigin(0)

        this._player = new Player({
            scene:this,
            position:PLAYER_POSITION
        })
    }
}