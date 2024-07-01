import { getTargetPositionFromGameObjectPositionAndDirection } from './../../utils/grid-utils';
import { GameObjects, Tilemaps } from 'phaser';
import { Scene } from 'phaser';
import { Coordinate } from '../../types/typedef';
import { DIRECTION, DirectionType } from '../../common/direction';

type CharacterConfig = {
    scene:Scene,
    assetKey:string,
    idleFrameConfig:CharacterIdleFrameConfig,//空闲帧
    position:Coordinate,
    direction:DirectionType,
    origin?:Coordinate,
    spriteGridMovementFinishedCallback?:()=>void,
    collisionLayer?:Tilemaps.TilemapLayer
}


type CharacterIdleFrameConfig = {
    DOWN:number,
    UP:number,
    LEFT:number,
    RIGHT:number,
    NONE:number
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
    //空闲帧
    _idleFrameConfig:CharacterIdleFrameConfig
    _origin:Coordinate
    _spriteGridMovementFinishedCallback:(()=>void) | undefined
    //实现碰撞，是否可以发生碰撞,碰撞图层
    _collisionLayer?:Tilemaps.TilemapLayer 
    constructor(config:CharacterConfig){
        this._scene = config.scene
        this._direction = config.direction
        this._isMoving = false
        this._targetPosition = {...config.position}
        this._previousTargetPosition = {...config.position}
        this._idleFrameConfig = config.idleFrameConfig
        this._origin = config.origin || {x:0,y:0}
        this._collisionLayer = config.collisionLayer
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,this._getIdleFrame()).setOrigin(this._origin.x,this._origin.y)
        this._spriteGridMovementFinishedCallback = config.spriteGridMovementFinishedCallback
    }


    get sprite():GameObjects.Sprite{
        return this._phaserGameObject
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

    update(time: any){
        if(this._isMoving){
            return
        }
        //获取当前动画的空闲帧
        const idleFrame = this._phaserGameObject.anims.currentAnim?.frames[1].frame.name
        this._phaserGameObject.anims.stop()
        if(!idleFrame){
            return
        }
        switch (this._direction) {
            case DIRECTION.DOWN:
                this._phaserGameObject.setFrame(idleFrame)
                break;
            case DIRECTION.UP:
                this._phaserGameObject.setFrame(idleFrame)
                break;
            case DIRECTION.LEFT:
                this._phaserGameObject.setFrame(idleFrame)
                break;
            case DIRECTION.RIGHT:
                this._phaserGameObject.setFrame(idleFrame)
                break;
            case DIRECTION.NONE:
                
                break;
        
            default:
                break;
        }
    }


    _getIdleFrame(){
        return this._idleFrameConfig[this._direction]
    }

    _moveSprite(direction:DirectionType){
        this._direction = direction
        if(this._isBlockingTile()){
            return
        }
        this._isMoving = true
        this._handleSpriteMovement()
    }

    /**
     * 是否阻塞,碰撞逻辑
     * @returns boolean
     */
    _isBlockingTile(){
        if(this._direction === DIRECTION.NONE){
            return
        }
        const targetPosition = {...this._targetPosition}
        const updatePosition = getTargetPositionFromGameObjectPositionAndDirection(targetPosition,this._direction)
        return this._doesPositionCollideWithCollisionLayer(updatePosition)
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

    /**
     * 通过位置坐标和碰撞图层，判断当前场景中，此坐标是否有碰撞图层
     * @param position 
     * @returns 
     */
    _doesPositionCollideWithCollisionLayer(position:Coordinate){
        if(!this._collisionLayer){
            return false
        }
        const {x,y} = position
        //通过 x,y 获取当前场景中，此坐标是否有碰撞图层, index为-1时没有碰撞图层
        const tile = this._collisionLayer.getTileAtWorldXY(x,y,true)
        console.log('是否有碰撞图层',tile.index)
        return tile.index !== -1
    }
}