import { TILE_COLLISION_LAYER_ALPHA } from './../config';
import { Scene, Tilemaps } from 'phaser';
import { WORLD_ASSET_KEYS } from '../assets/asset-keys';
import { DIRECTION } from '../common/direction';
import { TILE_SIZE } from '../config';
import { Controls } from '../utils/controls';
import { Player } from '../world/characters/player';
import { dataManager, DATA_MANAGER_STORE_KEYS } from '../utils/data-manager';


export class WorldScene extends Scene {
    _player:Player
    _controls:Controls
    //遭遇怪图层
    _encounterLayer:Tilemaps.TilemapLayer | null
    //是否遭遇怪兽
    _wildMonsterEncountered:boolean
    constructor(){
        super('WorldScene')
    }

    inin(){
        this._wildMonsterEncountered = false
    }

    create(){
        console.log('create World Scene')

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
            console.log('物体碰撞图块不存在')
            return
        }
        //创建碰撞图层
        const collisionLayer = map.createLayer('Collision',collisionTiles,0,0)
        if(!collisionLayer){
            console.log('物体碰撞图层不存在')
            return
        }
        collisionLayer.setAlpha(TILE_COLLISION_LAYER_ALPHA).setDepth(2)


        //创建遭遇怪的碰撞块
        const encounter = map.addTilesetImage('encounter',WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE)
        if(!encounter){
            console.log('遭遇怪图块不存在')
            return
        }
        this._encounterLayer = map.createLayer('Encounter',encounter,0,0)
        if(!this._encounterLayer){
            console.log('遭遇怪图层不存在')
            return
        }
        this._encounterLayer.setAlpha(TILE_COLLISION_LAYER_ALPHA).setDepth(2)


        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_BACKGROUND,0).setOrigin(0)

        this._player = new Player({
            scene:this,
            position:dataManager.store.get(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION),
            direction:dataManager.store.get(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION),
            collisionLayer:collisionLayer,
            spriteGridMovementFinishedCallback:()=>{
                this._handlePlayerMovementUpdate()
            }
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
        if(this._wildMonsterEncountered){
            this._player.update(time)
            return
        }
        const selectedDirection = this._controls.getDirectionKeyPressedDown()
        if(selectedDirection !== DIRECTION.NONE){
            this._player.moveCharacter(selectedDirection)
        }
        this._player.update(time)
    }

    _handlePlayerMovementUpdate(){
        dataManager.store.set(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION,{
            x:this._player.sprite.x,
            y:this._player.sprite.y
        })

        dataManager.store.set(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION,this._player.direction)
        if(!this._encounterLayer){
            return
        }
        const {x,y} = this._player.sprite
        const isInEncounterZone = this._encounterLayer.getTileAtWorldXY(x,y,true).index !== -1
        if(!isInEncounterZone){
            return
        }
        console.log('进入遭遇怪图层')

        //是否遭遇怪兽
        this._wildMonsterEncountered = Math.random() < 0.2
        if(this._wildMonsterEncountered){
            console.log('遇到野生怪兽了！')
            this.cameras.main.fadeOut(2000)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
                this.scene.start('BattleScene')
            })

        }

    }
}