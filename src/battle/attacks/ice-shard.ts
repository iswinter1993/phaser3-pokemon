import { GameObjects, Scene } from "phaser";
import { ATTACK_ASSET_KEYS } from "../../assets/asset-keys";
import { Coordinate } from "../../types/typedef";
import { Attack } from "./attack";

export class IceShard extends Attack {
    _attackGameObject:GameObjects.Sprite
    constructor(scene:Scene,position:Coordinate){
        super(scene,position)
        /**
         * sprite参数
         * @param x — The horizontal position of this Game Object in the world.
            *
         *   @param y — The vertical position of this Game Object in the world.
            *
         *   @param texture — The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
            *
         *   @param frame — An optional frame from the Texture this Game Object is rendering with.渲染这个游戏对象的纹理中的一个可选帧。
         */

      
        
        //创建攻击对象
        this._attackGameObject = this._scene.add.sprite(this._position.x, this._position.y, ATTACK_ASSET_KEYS.ICE_SHARD, 0 )
        .setOrigin(0.5)
        .setScale(4)
        .setAlpha(0)
    }

    /**
     * 
     * @param callback 
     */
     playAnimation(callback?:()=>void){
        if(this._isAnimationPlaying) return
        this._isAnimationPlaying = true
        this._attackGameObject.setAlpha(1)
        this._attackGameObject.play(ATTACK_ASSET_KEYS.ICE_SHARD_START)

        this._attackGameObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ATTACK_ASSET_KEYS.ICE_SHARD_START,()=>{
            this._attackGameObject.play(ATTACK_ASSET_KEYS.ICE_SHARD)
        })

        this._attackGameObject.once(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + ATTACK_ASSET_KEYS.ICE_SHARD,()=>{
            this._isAnimationPlaying = false
            this._attackGameObject.setAlpha(0).setFrame(0)
            if(callback){
                callback()
            }
        })
    }
}