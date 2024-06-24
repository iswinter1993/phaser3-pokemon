import { ATTACK_KEYS, AttackKeys } from './attack-keys';
import { Scene } from "phaser";
import { IceShard } from './ice-shard';
import { Slash } from './slash';


// 从 ATTACK_KEYS 对象的值中提取类型
export type AttackTarget = typeof ATTACK_TARGET[keyof typeof ATTACK_TARGET];
export const ATTACK_TARGET = Object.freeze({
    PLAYER:'PLAYER',
    ENEMY:'ENEMY'
})

export class AttackManager {
    _scene:Scene
    _skipBattleAnimations:boolean
    _iceShardAttack:IceShard
    _slashAttack:Slash
    constructor(scene:Scene,skipBattleAnimations:boolean){
        this._scene = scene
        this._skipBattleAnimations = skipBattleAnimations
    }
    /**
     * 
     * @param attack 
     * @param target 
     * @param callback 
     * @returns 
     */
    playAttackAnimation(attack:AttackKeys,target:AttackTarget,callback:()=>void){
        if(this._skipBattleAnimations) {
            callback()
            return
        }

        //if attack target is enemy
        let x = 745
        let y = 140
        //if attack target is player
        if(target === ATTACK_TARGET.PLAYER){
            x = 256
            y = 344
        }
        
        switch (attack) {
            case ATTACK_KEYS.ICE_SHARD:
                if(!this._iceShardAttack){
                    this._iceShardAttack = new IceShard(this._scene,{x,y})
                }
                this._iceShardAttack.gameObject?.setPosition(x,y)
                this._iceShardAttack.playAnimation(callback)
                break;
            case ATTACK_KEYS.SLASH:
                if(!this._slashAttack){
                    this._slashAttack = new Slash(this._scene,{x,y})
                }
                this._slashAttack.gameObject?.setPosition(x,y)
                this._slashAttack.playAnimation(callback)
                break;
            default:
                break;
        }

    }
}