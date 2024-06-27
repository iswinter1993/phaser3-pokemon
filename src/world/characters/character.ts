import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { Coordinate } from '../../types/typedef';

type CharacterConfig = {
    scene:Scene,
    assetKey:string,
    assetFrame?:number,
    position:Coordinate
}

export class Character {
    _scene:Scene
    _phaserGameObject:GameObjects.Sprite
    constructor(config:CharacterConfig){
        this._scene = config.scene
        this._phaserGameObject = this._scene.add.sprite(config.position.x,config.position.y,config.assetKey,config.assetFrame||0).setOrigin(0)
    }
}