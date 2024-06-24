import { GameObjects, Scene } from "phaser";
import { Coordinate } from "../../types/typedef";

export class Attack {
    _scene:Scene;
    _position:Coordinate
    _isAnimationPlaying:boolean
    _attackGameObject:GameObjects.Sprite | GameObjects.Container | undefined
    constructor(scene:Scene,position:Coordinate){
        this._scene = scene
        this._position = position
        this._isAnimationPlaying = false
        this._attackGameObject = undefined
    }

    get gameObject() {
        return this._attackGameObject
    }
    /**
     * 
     * @param callback 
     */
    playAnimation(callback?:()=>void){
        throw new Error('playAnimation方法未实现')
    }
}