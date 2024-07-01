import { TILE_COLLISION_LAYER_ALPHA } from './../config';
import { Scene } from 'phaser';
import { WORLD_ASSET_KEYS } from '../assets/asset-keys';
import { DIRECTION } from '../common/direction';
import { TILE_SIZE } from '../config';
import { Controls } from '../utils/controls';
import { Player } from '../world/characters/player';
//通过网格的大小 乘 PLAYER_POSITION的x或y 实现移动位置
const PLAYER_POSITION = Object.freeze({
    x:6 * TILE_SIZE,
    y:21 * TILE_SIZE
})

export class WorldScene extends Scene {
    _player:Player
    _controls:Controls
    constructor(){
        super('WorldScene')
    }
    create(){
        //设置相机边界，超出不跟随目标
        this.cameras.main.setBounds(0,0,1280,2176)
        //相机缩放
        this.cameras.main.setZoom(0.8)
        //设置相机中心点
        this.cameras.main.centerOn(6*64,22*64)




        //创建碰撞地图
        const map = this.make.tilemap({key:WORLD_ASSET_KEYS.WORLD_MAIN_LEVEL})
        //碰撞图块
        //addTilesetImage将图像添加到地图以用作图块集。单个地图可以使用多个图块集
        //第一个参数最好使用level.json中的碰撞图块名字
        const collisionTiles = map.addTilesetImage('collision',WORLD_ASSET_KEYS.WORLD_COLLISION)
        if(!collisionTiles){
            console.log('碰撞图块不存在')
            return
        }
        //碰撞图层
        const collisionLayer = map.createLayer('Collision',collisionTiles,0,0)
        if(!collisionLayer){
            console.log('碰撞图层不存在')
            return
        }
        collisionLayer.setAlpha(TILE_COLLISION_LAYER_ALPHA).setDepth(2)




        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_BACKGROUND,0).setOrigin(0)

        this._player = new Player({
            scene:this,
            position:PLAYER_POSITION,
            direction:DIRECTION.DOWN,
            collisionLayer:collisionLayer
        })
        //设置相机跟随目标
        this.cameras.main.startFollow(this._player.sprite)

        //设置屋顶，树尖的遮挡图片
        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_FOREGROUND,0).setOrigin(0)

        this._controls = new Controls(this)

        //相机淡入效果
        this.cameras.main.fadeIn(1000,0,0,0)
    }

    update(time: any) {
        const selectedDirection = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._player.moveCharacter(selectedDirection)
        }
        this._player.update(time)
    }
}