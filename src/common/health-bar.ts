import { HEALTH_BAR_ASSET_KEYS } from './../assets/asset-keys';
import { Scene } from 'phaser';
import { AnimatedBar, AnimatedBarConfig } from './animated-bar';
export class HealthBar extends AnimatedBar {

    constructor(scene:Scene,x:number,y:number,width=360){
        super({
            scene,
            x,
            y,
            width,
            scaleY:0.7,
            leftCapAssetKey:HEALTH_BAR_ASSET_KEYS.LEFT_CAP,
            middleAssetKey:HEALTH_BAR_ASSET_KEYS.MIDDLE,
            rightCapAssetKey:HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,
            leftShadowCapAssetKey:HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,
            middleShadowAssetKey:HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,
            rightShadowCapAssetKey:HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW
        })
    }
}