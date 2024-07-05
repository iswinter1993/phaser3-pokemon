import { DIRECTION } from './../../common/direction';
import { Scene, Tilemaps } from "phaser";
import { CHARACTER_ASSET_KEYS } from "../../assets/asset-keys";
import { DirectionType } from "../../common/direction";
import { Coordinate } from "../../types/typedef";
import { Character } from "./character";
type NPCConfig = {
    scene:Scene,
    position:Coordinate,
    direction:DirectionType,
    collisionLayer?:Tilemaps.TilemapLayer,
    spriteGridMovementFinishedCallback?:()=>void,
    frame:number,
    message:string[]
}
export class NPC extends Character {
    _message:string[]
    //是否在与玩家交谈
    _talkingToPlayer:boolean
    constructor(config:NPCConfig){
        super({
            ...config,
            assetKey:CHARACTER_ASSET_KEYS.NPC,
            origin:{x:0,y:0},
            idleFrameConfig:{
                DOWN:config.frame,
                NONE:config.frame,
                UP:config.frame + 1,
                LEFT:config.frame + 2,
                RIGHT:config.frame + 2
            }
        })
        this._message = config.message || []
        this._talkingToPlayer = false
        this._phaserGameObject.setScale(4)
    }

    get message () {
        return [...this._message]
    }

    get isTalkingToPlayer () {
        return this._talkingToPlayer
    }

    set isTalkingToPlayer (val:boolean) {
        this._talkingToPlayer = val
    }

    facePlayer(playerDirection:DirectionType){
        switch (playerDirection) {
            case DIRECTION.DOWN:
                this._phaserGameObject.setFrame(this._idleFrameConfig.UP).setFlipX(false)
                break;
            case DIRECTION.UP:
                this._phaserGameObject.setFrame(this._idleFrameConfig.DOWN).setFlipX(false)
                break;
            case DIRECTION.LEFT:
                this._phaserGameObject.setFrame(this._idleFrameConfig.RIGHT).setFlipX(false)
                break;
            case DIRECTION.RIGHT:
                this._phaserGameObject.setFrame(this._idleFrameConfig.LEFT).setFlipX(true)
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
        }
    }
}