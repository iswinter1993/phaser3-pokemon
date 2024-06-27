import { getTargetPositionFromGameObjectPositionAndDirection } from './../../utils/grid-utils';
import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { Coordinate } from '../../types/typedef';
import { DIRECTION, DirectionType } from '../../common/direction';
import { TILE_SIZE } from '../../config';

type CharacterConfig = {
    scene:Scene,
    assetKey:string,
    assetFrame?:number,
    position:Coordinate,
    direction:DirectionType,
    spriteGridMovementFinishedCallback?:()=>void
}

export class Character {
    _scene:Scene
    _phaserGameObject:GameObjects.Sprite
    _direction:DirectionType
    _isMoving:boolean
    //目标位置
    _targetPosition:Coordinate
    //之前的位置
    _previousTargetPosition:Coordinate
    _spriteGridMovementFinishedCallback:(()=>void) | undefined
    constructor(config:CharacterConfig){
        this._scene = config.scene
        this._direction = config.direction
        this._isMoving = false
        this._targetPosition = {...config.position}
        this._previousTargetPosition = {...config.position}
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,config.assetFrame||0).setOrigin(0)
        this._spriteGridMovementFinishedCallback = config.spriteGridMovementFinishedCallback
    }

    get isMoving():boolean{
        return this._isMoving
    }

    get direction():DirectionType{
        return this._direction
    }

    moveCharacter(direction:DirectionType){
        if(this._isMoving){
            return
        }

        this._moveSprite(direction)

        
    }

    _moveSprite(direction:DirectionType){
        this._direction = direction
        if(this._isBlockTile()){
            return
        }
        this._isMoving = true
        this._handleSpriteMovement()
    }

    /**
     * 是否阻塞,碰撞逻辑
     * @returns boolean
     */
    _isBlockTile(){
        return false
    }

    _handleSpriteMovement(){
        if(this._direction === DIRECTION.NONE){
            return
        }

        const { x, y } = getTargetPositionFromGameObjectPositionAndDirection(this._targetPosition,this._direction)
        
        this._targetPosition.x = x
        this._targetPosition.y = y

        this._scene.add.tween({
            targets:this._phaserGameObject,
            x:{
                from:this._phaserGameObject.x,
                start:this._phaserGameObject.x,
                to:this._targetPosition.x
            },
            y:{
                from:this._phaserGameObject.y,
                start:this._phaserGameObject.y,
                to:this._targetPosition.y
            },
            delay:0,
            repeat:0,
            duration:400,
            onComplete:()=>{
                this._isMoving = false
                this._previousTargetPosition = {...this._targetPosition}
                if(this._spriteGridMovementFinishedCallback){
                    this._spriteGridMovementFinishedCallback()
                }
            }
        })

    }
}