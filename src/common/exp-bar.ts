import { Scene } from 'phaser';
import { EXP_BAR_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS } from '../assets/asset-keys';
import { AnimatedBar } from "./animated-bar";

export class ExpBar extends AnimatedBar {
    constructor(scene:Scene,x:number,y:number,width=360,scaleY=0.4){
        super({
            scene,
            x,
            y,
            width,
            scaleY,
            leftCapAssetKey:EXP_BAR_ASSET_KEYS.EXP_LEFT_CAP,
            middleAssetKey:EXP_BAR_ASSET_KEYS.EXP_MIDDLE,
            rightCapAssetKey:EXP_BAR_ASSET_KEYS.EXP_RIGHT_CAP,
            leftShadowCapAssetKey:HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,
            middleShadowAssetKey:HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,
            rightShadowCapAssetKey:HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW
        })
    }
}