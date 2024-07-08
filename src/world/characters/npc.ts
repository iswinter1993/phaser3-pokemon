import { Coordinate } from './../../types/typedef';
import { DIRECTION } from './../../common/direction';
import { Scene, Tilemaps } from "phaser";
import { CHARACTER_ASSET_KEYS } from "../../assets/asset-keys";
import { DirectionType } from "../../common/direction";
import { Character } from "./character";

export type NpcMovementPattern = typeof NPC_MOVEMENT_PATTERN[keyof typeof NPC_MOVEMENT_PATTERN];

export const NPC_MOVEMENT_PATTERN = Object.freeze({
    IDLE:'IDLE',
    CLOCKWISE:'CLOCKWISE'//顺时针移动
})

type NPCPath = {
    [key:number]:Coordinate
}

type NPCConfig = {
    scene:Scene,
    position:Coordinate,
    direction:DirectionType,
    collisionLayer?:Tilemaps.TilemapLayer,
    spriteGridMovementFinishedCallback?:()=>void,
    frame:number,
    message:string[],
    npcPath:NPCPath
    movementPattern:NpcMovementPattern //运动类型 IDLE空闲 CLOCKWISE移动
}
export class NPC extends Character {
    _message:string[]
    //是否在与玩家交谈
    _talkingToPlayer:boolean
    _npcPath:NPCPath
    _movementPattern:NpcMovementPattern
    //当前路径索引
    _currentPathIndex:number 
    _lastMovementTime:number
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
        this._npcPath = config.npcPath
        this._currentPathIndex = 0
        this._movementPattern = config.movementPattern
        this._lastMovementTime = Phaser.Math.Between(3500,5000) //随机数
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
    update(time: any){
        if(this._isMoving){
            return
        }
        if(this._talkingToPlayer){
            return
        }
        super.update(time)
        if(this._movementPattern === NPC_MOVEMENT_PATTERN.IDLE){
            return
        }
        if(this._lastMovementTime < time){

            let characterDirection:DirectionType = DIRECTION.NONE
            let nextPosition = this._npcPath[this._currentPathIndex + 1] 
            const prevPosition =  this._npcPath[this._currentPathIndex] 
            // console.log(prevPosition,this._phaserGameObject.x,this._phaserGameObject.y)
            //如果npc路径有碰撞直接返回，_phaserGameObject对象的坐标不会改变，所以nextPosition = this._npcPath[this._currentPathIndex]
            if(prevPosition.x !== this._phaserGameObject.x || prevPosition.y !== this._phaserGameObject.y){
                nextPosition = this._npcPath[this._currentPathIndex]
            }else{
                if(nextPosition === undefined){
                    nextPosition = this._npcPath[0]
                    this._currentPathIndex = 0
                }else{
                    this._currentPathIndex = this._currentPathIndex + 1
                }
            }
    
            if(nextPosition.x > this._phaserGameObject.x){
                characterDirection = DIRECTION.RIGHT
            }else if(nextPosition.x < this._phaserGameObject.x){
                characterDirection = DIRECTION.LEFT
            }else if(nextPosition.y < this._phaserGameObject.y){
                characterDirection = DIRECTION.UP
            }else if(nextPosition.y > this._phaserGameObject.y){
                characterDirection = DIRECTION.DOWN
            }
            this.moveCharacter(characterDirection)
            this._lastMovementTime = time + Phaser.Math.Between(3500,5000)
        }
    }
    moveCharacter(direction:DirectionType){
        super.moveCharacter(direction)
        switch (this._direction) {
            case DIRECTION.DOWN:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `NPC_1_${this._direction}`){
                    this._phaserGameObject.setFlipX(false)
                    this._phaserGameObject.anims.play(`NPC_1_${this._direction}`)
                }
                break;
            case DIRECTION.UP:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `NPC_1_${this._direction}`){
                    this._phaserGameObject.setFlipX(false)
                    this._phaserGameObject.anims.play(`NPC_1_${this._direction}`)
                }
                
                break;
            case DIRECTION.LEFT:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `NPC_1_${DIRECTION.RIGHT}`){
                    this._phaserGameObject.setFlipX(true)
                    this._phaserGameObject.anims.play(`NPC_1_${DIRECTION.RIGHT}`)
                }
                break;
            case DIRECTION.RIGHT:
                if(!this._phaserGameObject.anims.isPlaying || this._phaserGameObject.anims.currentAnim?.key !== `NPC_1_${this._direction}`){
                    this._phaserGameObject.setFlipX(false)
                    this._phaserGameObject.anims.play(`NPC_1_${this._direction}`)
                }
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
            
         
        }

    }
}