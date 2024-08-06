import { WORLD_ASSET_KEYS } from './../assets/asset-keys';
import { GameObjects } from 'phaser';
import { Coordinate } from './../types/typedef';
import { Scene } from 'phaser';

type ItemConfig = {
    scene:Scene,
    position:Coordinate,
    itemId:number,
    id:number,
}
export class Item {
    _scene:Scene
    _phaserGameObject:GameObjects.Image
    _itemId:number
    _id:number
    constructor(config:ItemConfig){
        this._scene = config.scene
        this._itemId = config.itemId
        this._id = config.id
        this._phaserGameObject = this._scene.add.image(config.position.x,config.position.y,WORLD_ASSET_KEYS.BEACH,22).setOrigin(0)
    }

    get gameObject():GameObjects.Image{
        return this._phaserGameObject
    }
    get position():Coordinate{
        return {x:this._phaserGameObject.x,y:this._phaserGameObject.y}
    }
    get id():number{
        return this._id
    }
    get itemId():number{
        return this._itemId
    }
}