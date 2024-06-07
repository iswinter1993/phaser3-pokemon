import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { BATTLE_BACKGROUND_ASSET_KEYS } from '../assets/asset-keys';
export class Background {
    _scene:Scene;
    _backgroundGameObject:GameObjects.Image;
    constructor(scene: Scene){
        this._scene = scene
        this._backgroundGameObject = this._scene.add.image(0,0,BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0).setAlpha(0)
    }
    showForest(){
        this._backgroundGameObject.setTexture(BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setAlpha(1)
    }
}