import { Monster, Coordinate, Item as ItemType } from './../types/typedef';
import { BattleSceneData } from './BattleScene';
import { DataUtils } from './../utils/data-utils';
import { BaseScene } from './BaseScene';
import { Menu } from './../world/menu/menu';
import { getTargetPositionFromGameObjectPositionAndDirection } from './../utils/grid-utils';
import { TILE_COLLISION_LAYER_ALPHA, TILE_SIZE } from './../config';
import { Scene, Tilemaps } from 'phaser';
import { AUDIO_ASSET_KEYS, WORLD_ASSET_KEYS } from '../assets/asset-keys';
import { DIRECTION } from '../common/direction';
import { Controls } from '../utils/controls';
import { Player } from '../world/characters/player';
import { dataManager, DATA_MANAGER_STORE_KEYS } from '../utils/data-manager';
import { CANNOT_READ_SIGN_TEXT, SAMPLE_TEXT } from '../utils/text-utils';
import { DialogUi } from '../world/dialog-ui';
import { NPC } from '../world/characters/npc';
import { playBackgroundMusic, playSoundFx } from '../utils/audio-utils';
import { weightedRandom } from '../utils/random';
import { Item } from '../world/item';

type TiledObjectType = {
    name:string,
    type:string,
    value:any
}


const TILED_ITEM_PROPERTY = Object.freeze({
    ITEM_ID:'item_id',
    ID:'id'
}) 

export type WorldSceneData = {
    isPlayerKnockOut:boolean
}

const CUSTOM_TILED_TYPES = Object.freeze({
    NPC:'npc',
    NPC_PATH:'npc_path'
})

const TILED_NPC_PROPERTY = Object.freeze({
    MESSAGES:'messages',
    FRAME:'frame',
    MOVEMENT_PATTERN:"movement_pattern",
    IS_SPAWN_POINT:'is_spawn_point'
})

const TILED_ENCOUNTER_PROPERTY = Object.freeze({
    AREA:'area'
})

export class WorldScene extends BaseScene {
    _player:Player
    //遭遇怪图层
    _encounterLayer:Tilemaps.TilemapLayer | null
    //是否遭遇怪兽
    _wildMonsterEncountered:boolean
    _signObjectLayer:Tilemaps.ObjectLayer | null
    _dialogUi:DialogUi
    _npc:NPC[]
    //玩家交互的NPC
    _npcPlayerIsInteractionWith:NPC | undefined
    _sceneData:WorldSceneData
    _menu:Menu
    _items:Item[]
    constructor(){
        super('WorldScene')
    }

    init(data:WorldSceneData){
        super.init(data)
        this._sceneData = data
        if(Object.keys(data).length === 0){
            this._sceneData = {
                isPlayerKnockOut:false
            }
        }
        console.log('isPlayerKnockOut玩家是否被打败',this._sceneData)
        this._wildMonsterEncountered = false
        //如果玩家被打败，更新玩家位置到初始值
        if(this._sceneData.isPlayerKnockOut){
            dataManager.store.set(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION,{
                x: 6 * TILE_SIZE,
                y:21 * TILE_SIZE
            })
            dataManager.store.set(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION,DIRECTION.DOWN)
        }
        this._npcPlayerIsInteractionWith = undefined
        this._items = []
    }

    create(){
        super.create()

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
        //遭遇怪图层
        this._encounterLayer = map.createLayer('Encounter',encounter,0,0)
        if(!this._encounterLayer){
            console.log('遭遇怪图层不存在')
            return
        }
        this._encounterLayer.setAlpha(TILE_COLLISION_LAYER_ALPHA).setDepth(2)

        //创建 广告牌交互对象层
        this._signObjectLayer = map.getObjectLayer('Sign')
        if(!this._signObjectLayer){
            console.log('Sign 交互对象层不存在')
            return
        }
      

        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_BACKGROUND,0).setOrigin(0)
        //创建item 和 碰撞
        this._createItemMap(map)

        //创建npc
        this._createNpcsMap(map)

        this._player = new Player({
            scene:this,
            position:dataManager.store.get(DATA_MANAGER_STORE_KEYS.PLAYER_POSITION),
            direction:dataManager.store.get(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION),
            collisionLayer:collisionLayer,
            spriteGridMovementFinishedCallback:()=>{
                this._handlePlayerMovementUpdate()
            },
            spriteChangeDirectionCallback:()=>{
                this._handlePlayerDirectionUpdate()
            },
            otherCharactersToCheckForCollisionsWith:this._npc,
            objectsToCheckForCollisionsWith:this._items
        })


        this._npc.forEach(npc=>npc.addCharacterToCheckForCollisionsWith(this._player))


        
        //设置相机跟随目标
        this.cameras.main.startFollow(this._player.sprite)

        //设置屋顶，树尖的遮挡图片
        this.add.image(0,0,WORLD_ASSET_KEYS.WORLD_FOREGROUND,0).setOrigin(0)
        //创建对话框实例
        this._dialogUi = new DialogUi(this,1280)

        //相机淡入效果
        this.cameras.main.fadeIn(1000,0,0,0,(cameras:any,progress:any)=>{
            if(progress === 1){
                //玩家被击败
                if(this._sceneData.isPlayerKnockOut){
                    this._healPlayerParty()
                    this._dialogUi.showDialogModal(['heal your team'])
                }
                
            }
        })
        //创建菜单
        this._menu = new Menu(this)

        //游戏已开始
        dataManager.store.set(DATA_MANAGER_STORE_KEYS.GAME_STARTED,true)
        
        playBackgroundMusic(this,AUDIO_ASSET_KEYS.MAIN)

    }

    update(time: any) {
        if(this._wildMonsterEncountered){
            this._player.update(time)
            return
        }
         
        const selectedDirection = this._controls.getDirectionKeyPressedDown()
        const selectedJustDirection = this._controls.getDirectionKeyJustPressed()
        const wasSpaceKeyPressed = this._controls.wasSpaceKeyPressed()

        if(selectedDirection !== DIRECTION.NONE && !this._isPlayerInputLocked()){
            this._player.moveCharacter(selectedDirection)
        }

        
        if(wasSpaceKeyPressed && !this._player.isMoving && !this._menu.isVisible){
            this._handlePlayerInteraction()
        }

        if(this._controls.wasEnterKeyPressed() && !this._player.isMoving){
            console.log('enter key pressed')
            if(this._dialogUi.isVisible){
                return
            }

            if(this._menu.isVisible){
                this._menu.hide()
                return
            }
            this._menu.show()
        }
        if(this._menu.isVisible){
            if(selectedJustDirection !== DIRECTION.NONE){
                this._menu.handlePlayerInput(selectedJustDirection)

            }
            
            if(wasSpaceKeyPressed){
                console.log(wasSpaceKeyPressed, this._controls.wasSpaceKeyPressed())
                this._menu.handlePlayerInput('OK')
                const sceneDataToPass = {
                    previousScene : 'WorldScene'
                }
                if(this._menu.selectedOption === 'MONSTERS'){
                    //另起一个场景，不会关闭当前场景,,,,,场景之间可以传递数据，init方法接收数据
                    this.scene.launch('MonsterPartyScene',sceneDataToPass)
                    //暂停当前场景
                    this.scene.pause('WorldScene')
                }

                if(this._menu.selectedOption === 'BAG'){
                    this.scene.launch('InventoryScene',sceneDataToPass)
                    this.scene.pause('WorldScene')
                }

                if(this._menu.selectedOption === 'SAVE'){
                    dataManager.saveData()
                    this._menu.hide()
                    this._dialogUi.showDialogModal(['Game progress has been saved'])
                }
                if(this._menu.selectedOption === 'EXIT'){
                    this._menu.hide()
                }
            }

            if(this._controls.wasBackKeyPressed()){
                this._menu.hide()
                return
            }
        }

        this._player.update(time)
        this._npc.forEach(npc=>npc.update(time))
    }
    /**
     * 玩家移动更新位置
     * @returns 
     */
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
        playSoundFx(this,AUDIO_ASSET_KEYS.GRASS)
        //是否遭遇怪兽
        this._wildMonsterEncountered = Math.random() < 0.2
        if(this._wildMonsterEncountered){
            console.log('遇到野生怪兽了！')
            //获取遭遇层数据，拿到area属性值
            console.log(this._encounterLayer.layer)
            const encounterArea:TiledObjectType = this._encounterLayer.layer.properties.find((property:any)=>property.name === TILED_ENCOUNTER_PROPERTY.AREA) as TiledObjectType
            //通过area的id获取可遭遇怪兽
            const encounterAreaMonsters = DataUtils.getEncountersMonsterByAreaId(this,encounterArea.value)
           
            //获取怪兽id
            const monsterId = weightedRandom(encounterAreaMonsters)
           
            console.log('area:',encounterArea.value,'random monsters:',monsterId)

            this.cameras.main.fadeOut(2000)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
                const sceneDataToPass:BattleSceneData = {
                    playerMonsters:dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY),
                    enemyMonsters:[DataUtils.getMonsterById(this,monsterId) as Monster]
                }
                this.scene.start('BattleScene',sceneDataToPass)
            })

        }

    }
    /**
     * 玩家交互
     */
    _handlePlayerInteraction(){
        if(this._dialogUi.isAnimationPlaying){
            return
        }
        if(this._dialogUi.isVisible && !this._dialogUi.moreMessageToShow){
            this._dialogUi.hideDialogModal()
            if(this._npcPlayerIsInteractionWith){
                this._npcPlayerIsInteractionWith.isTalkingToPlayer = false
                this._npcPlayerIsInteractionWith = undefined
            }
            return
        }
        //如果弹框正在显示，并且还有消息，调用showNextMessage方法 获取下一条信息
        if(this._dialogUi.isVisible && this._dialogUi.moreMessageToShow){
            this._dialogUi.showNextMessage()
            return
        }

        const {x,y} = this._player.sprite
        //通过当前位置，方向，获取下一步的坐标
        const targetPosition = getTargetPositionFromGameObjectPositionAndDirection({x,y},this._player.direction)
        if(!this._signObjectLayer){
            return
        }
        //获取 交互对象层 的对象 , 检查玩家朝向是否有交互对象层
        const nearbySign = this._signObjectLayer.objects.find(object=>{
            if(!object.x || !object.y){
                return
            }
            return object.x === targetPosition.x && (object.y - TILE_SIZE) === targetPosition.y
        })

        console.log(nearbySign)
        if(nearbySign){
            const props:TiledObjectType[] = nearbySign.properties
            const msg = props.find((prop:TiledObjectType) => prop.name === 'message')?.value
            //检查玩家朝向是否向上
            const usePlaceholderText = this._player.direction !== DIRECTION.UP
            let textToShow = CANNOT_READ_SIGN_TEXT

            if(!usePlaceholderText){
                textToShow = msg || SAMPLE_TEXT
            }
            this._dialogUi.showDialogModal([textToShow])
            console.log(textToShow)
            return
        }


        const nearbyNPC = this._npc.find(npc=>{
            return npc.sprite.x === targetPosition.x && npc.sprite.y === targetPosition.y
        })
        if(nearbyNPC){
            const msg:string[] = nearbyNPC.message
            nearbyNPC.facePlayer(this._player.direction)
            nearbyNPC.isTalkingToPlayer = true
            //玩家交互的NPC
            this._npcPlayerIsInteractionWith = nearbyNPC
            this._dialogUi.showDialogModal(msg)
            console.log(msg)
            return
        }

        let nearbyItemIndex:number = 0
        const nearbyItem = this._items.find((item,index)=>{
            if(item.position.x === targetPosition.x && item.position.y === targetPosition.y){
                nearbyItemIndex = index
                return true
            }
            return false
        }) 
        if(nearbyItem){
            const item = DataUtils.getItemById(this,nearbyItem.itemId) as ItemType
            dataManager.addItem(item,1)
            nearbyItem.gameObject.destroy()
            dataManager.addItemPickedUp(nearbyItem.id)
            this._items.splice(nearbyItemIndex,1)
            this._dialogUi.showDialogModal([`You find a ${item?.name}`])
        }

    }

    _handlePlayerDirectionUpdate(){
        console.log(this._player.direction)
        dataManager.store.set(DATA_MANAGER_STORE_KEYS.PLAYER_DIRECTION,this._player.direction)
    }
    //弹框是否在显示
    _isPlayerInputLocked () {
        return this._dialogUi.isVisible || this._menu.isVisible || this._controls.isInputLocked
    }
    /**
     * 创建npc
     * @param map 
     */
    _createNpcsMap(map:Tilemaps.Tilemap){
        this._npc = []
        //创建npc交互对象层
        const npcLayers = map.getObjectLayerNames().filter(layerName => layerName.includes('NPC'))//获取包含NPC的图层名字
        npcLayers.forEach(layerName=>{
            const layer = map.getObjectLayer(layerName)
            const npcObject = layer?.objects.find(obj=>obj.type === CUSTOM_TILED_TYPES.NPC)
            console.log(npcObject)
            if(!npcObject || npcObject.x === undefined || npcObject.y === undefined){
                return
            }

            //获取 可以移动npc的路径
            const pathObject = layer?.objects.filter(obj => {
                return obj.type === CUSTOM_TILED_TYPES.NPC_PATH
            })

            const npcPath:any = {
                0:{x:npcObject.x,y:npcObject.y - TILE_SIZE}
            } 
            pathObject?.forEach(obj=>{
                if(obj.x === undefined || obj.y === undefined){
                    return
                }
                npcPath[Number(obj.name)] = {x:obj.x,y:obj.y - TILE_SIZE}
            })

            console.log(npcPath)



            const [ frame, messages, movement_pattern ] = npcObject.properties
            console.log(movement_pattern)

            const npcMessages = messages.value?.split('::') || []

            const npc = new NPC({
                scene:this, 
                position:{x:npcObject.x,y:npcObject.y - TILE_SIZE}, 
                direction:DIRECTION.DOWN, 
                frame:Number(frame.value || '0'),
                message:npcMessages,
                npcPath,
                movementPattern:movement_pattern.value || 'IDLE'
            })
            this._npc.push(npc)
        })
    }

    _healPlayerParty(){
        const monsters:Monster[] = dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)
        monsters.forEach((value,index)=>{
            value.currentHp = value.maxHp
        })
        dataManager.store.set(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY,monsters)
    }
    /**
     * 创建道具
     * @param map 
     */
    _createItemMap(map:Tilemaps.Tilemap){
        const itemObjectLayer = map.getObjectLayer('Item')
        const itemsPickedUp = dataManager.store.get(DATA_MANAGER_STORE_KEYS.ITEM_PICKED_UP) || []
        
        if(!itemObjectLayer){
            return
        }
        const items = itemObjectLayer.objects
        const validItems = items.filter(item=>{
            return item.x !== undefined && item.y !==undefined
        })
        console.log(validItems)
        for(const tiledItem of validItems){
            const itemId = tiledItem.properties?.find((property:TiledObjectType) => property.name === TILED_ITEM_PROPERTY.ITEM_ID).value
            const id = tiledItem.properties?.find((property:TiledObjectType) => property.name === TILED_ITEM_PROPERTY.ID).value
            const hasPickedUp = itemsPickedUp?.find((pickedId:number)=>pickedId===id)
            if(!hasPickedUp){
                const item = new Item({
                    scene:this,
                    position:{
                        x:tiledItem.x as number,
                        y:tiledItem.y as number - TILE_SIZE
                    },
                    id,
                    itemId
                })
    
                this._items.push(item)
            }
            console.log(itemId,id)
        }
    }
    
}