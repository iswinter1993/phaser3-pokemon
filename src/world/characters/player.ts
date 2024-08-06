import { Scene, Tilemaps } from 'phaser';
import { CHARACTER_ASSET_KEYS } from '../../assets/asset-keys';
import { DIRECTION, DirectionType } from '../../common/direction';
import { Coordinate } from '../../types/typedef';
import { Character } from "./character";

type PlayerConfig = {
    scene:Scene,
    position:Coordinate,
    direction:DirectionType,
    collisionLayer?:Tilemaps.TilemapLayer,
    spriteGridMovementFinishedCallback?:()=>void,
    otherCharactersToCheckForCollisionsWith?:Character[],
    objectsToCheckForCollisionsWith?:any[],
    spriteChangeDirectionCallback?:()=>void
}

export class Player extends Character {
    constructor(config:PlayerConfig){
        super({
            ...config,
            assetKey:CHARACTER_ASSET_KEYS.PLAYER,
            origin:{x:0,y:0.2},
            idleFrameConfig:{
                DOWN:7,
                NONE:7,
                UP:1,
                LEFT:10,
                RIGHT:4
            }
        })
    }

    moveCharacter(direction:DirectionType){
        super.moveCharacter(direction)
        switch (this._direction) {
            case DIRECTION.DOWN:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this._direction}`){
                    this._phaserGameObject.anims.play(`PLAYER_${this._direction}`)
                }
                break;
            case DIRECTION.UP:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this._direction}`){
                    this._phaserGameObject.anims.play(`PLAYER_${this._direction}`)
                }
                
                break;
            case DIRECTION.LEFT:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this._direction}`){
                    this._phaserGameObject.anims.play(`PLAYER_${this._direction}`)
                }
                break;
            case DIRECTION.RIGHT:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `PLAYER_${this._direction}`){
                    this._phaserGameObject.anims.play(`PLAYER_${this._direction}`)
                }
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
            
         
        }
        
    }
    
}