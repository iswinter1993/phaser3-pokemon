import { Scene, Tilemaps } from 'phaser';
import { CHARACTER_ASSET_KEYS } from '../../assets/asset-keys';
import { DIRECTION, DirectionType } from '../../common/direction';
import { TILE_SIZE } from '../../config';
import { Coordinate } from '../../types/typedef';
import { getTargetPositionFromGameObjectPositionAndDirection } from '../../utils/grid-utils';
import { Character } from "./character";

type PlayerConfig = {
    scene:Scene,
    position:Coordinate,
    direction:DirectionType,
    collisionLayer?:Tilemaps.TilemapLayer,
    spriteGridMovementFinishedCallback?:()=>void,
    otherCharactersToCheckForCollisionsWith?:Character[],
    objectsToCheckForCollisionsWith?:any[],
    spriteChangeDirectionCallback?:()=>void,
    enterLayer?:Tilemaps.ObjectLayer | undefined,
    enterCallback?:(enterName:string,enterId:string,isBuilding:boolean)=>void
}

export class Player extends Character {
    _enterLayer:Tilemaps.ObjectLayer | undefined
    _enterCallback:((enterName:string,enterId:string,isBuilding:boolean)=>void) | undefined
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

        this._enterLayer = config.enterLayer
        this._enterCallback = config.enterCallback
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

        if(!this._isMoving && this._enterLayer !== undefined){
            const targetPosition = getTargetPositionFromGameObjectPositionAndDirection(
                {
                    x:this._phaserGameObject.x,
                    y:this._phaserGameObject.y
                },
                this._direction
            )
            const nearbyEnter = this._enterLayer?.objects.find((object)=>{
                if(!object.x || !object.y)
                {
                    return false
                }
                return object.x === targetPosition.x && object.y - TILE_SIZE === targetPosition.y
            })
            console.log(nearbyEnter)
            if(!nearbyEnter){
                return
            }
            //存在其他场景入口，尝试进入场景
            const [entranceName,entranceId,isBuilding] = nearbyEnter.properties
            if(this._enterCallback){
                this._enterCallback(entranceName.value,entranceId.value,isBuilding.value||false)
            }
        }
        
    }
    
}