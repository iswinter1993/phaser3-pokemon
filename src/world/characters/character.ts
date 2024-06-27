import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { Coordinate } from '../../types/typedef';
import { DIRECTION, DirectionType } from '../../common/direction';
import { TILE_SIZE } from '../../config';

type CharacterConfig = {
    scene:Scene,
    assetKey:string,
    assetFrame?:number,
    position:Coordinate
}

export class Character {
    _scene:Scene
    _phaserGameObject:GameObjects.Sprite
    constructor(config:CharacterConfig){
        this._scene = config.scene
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,config.assetFrame||0).setOrigin(0)
    }

    moveCharacter(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
                this._phaserGameObject.y += TILE_SIZE
                
                break;
            case DIRECTION.LEFT:
                this._phaserGameObject.x -= TILE_SIZE
                break;
            case DIRECTION.UP:
                this._phaserGameObject.y -= TILE_SIZE
                break;
            case DIRECTION.RIGHT:
                this._phaserGameObject.x += TILE_SIZE
                break; 
            case DIRECTION.NONE:
            
                break;        
            default:
                break;
        }
    }
}