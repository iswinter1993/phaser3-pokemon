import { Vector } from 'matter';
import { Scene, Tilemaps, GameObjects, Physics, Types } from 'phaser';
import { BATTLLE_ASSET_KEYS, CHARACTER_ASSET_KEYS, WORLD_ASSET_KEYS } from '../assets/asset-keys';
export class TestWorldCollies extends Scene {
    _player:Types.Physics.Arcade.SpriteWithDynamicBody
    _controls:Types.Input.Keyboard.CursorKeys | undefined
    _sign:Tilemaps.TilemapLayer
    constructor(){
        super('TestWorldCollies')
    }

    init(){

    }
    create(){
        const map = this.make.tilemap({key:'untitled'})
        const grassset = map.addTilesetImage('grass','grass') as Tilemaps.Tileset
        const tileset = map.addTilesetImage('BasicPlains-tileset-Ver.2_by_AxulArt_scaled_4x_pngcrushed','tiles') as Tilemaps.Tileset
        const ground = map.createLayer('ground',grassset,0,0)?.setOrigin(0)
        const treeBottom = map.createLayer('tree-bottom',tileset,0,0)
        const treeTop = map.createLayer('tree-top',tileset,0,0)
        this._sign = map.createLayer('sign',tileset,0,0) as Tilemaps.TilemapLayer
        const sceneTransition = map.getObjectLayer('scene-transition') as Tilemaps.ObjectLayer
        this._sign?.setCollisionByProperty({collides:true})
        treeBottom?.setCollisionByProperty({collides: true})
        
        const debugGraphics = this.add.graphics().setAlpha(0.75)
        treeBottom?.renderDebug(debugGraphics,{
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })
        
        
        console.log(sceneTransition)
        const spawnPoint = sceneTransition.objects[0]
        this._player = this.physics.add.sprite((spawnPoint.x as number),(spawnPoint.y as number),CHARACTER_ASSET_KEYS.PLAYER,7).setOrigin(0,1)
        
        this.physics.add.collider(this._player,treeBottom)
       this.physics.add.collider(this._player,this._sign)
        this.cameras.main.startFollow(this._player)
        console.log(map.widthInPixels, map.heightInPixels)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.setZoom(0.8)
        this._controls = this.input.keyboard?.createCursorKeys()

        
        console.log(ground?.getTilesWithin(),grassset.firstgid)
        //在layer上动态添加图块,tileset必须是相同的
        //tileset.firstgid: 获取图块集中第一个图块在全局中的起始索引
        //动态添加图块，要手动开启碰撞
        const tile = this._sign?.putTileAt(tileset.firstgid+5,1,1)
        tile?.setCollision(true)
        // this._sign?.renderDebug(debugGraphics,{
        //     tileColor: null, // Color of non-colliding tiles
        //     collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        //     faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        // })

        //当碰撞形体过大，手动处理碰撞箱体
        //创建一个物理组 - 用于将玩家与所有尖刺发生碰撞。
        const spikeGroup = this.physics.add.staticGroup()
        this.physics.add.collider(spikeGroup,this._player)
        //循环遍历
        //遍历每个瓦片，将索引6替换为自定义图形。
        this._sign.forEachTile(tile=>{
            if(tile.index === 6){
                //精灵的原点在中心，所以将精灵放置在瓦片的中心。
                const x = tile.getCenterX()
                const y = tile.getCenterY()
                const spike = spikeGroup.create(x,y,BATTLLE_ASSET_KEYS.BALL_THUMBNAIL)
                spike.rotation = tile.rotation
                spike.body.setSize(18, 10)
                //如果图形有旋转
                // spike.rotation = tile.rotation;
                // if (spike.angle === 0) spike.body.setSize(48, 40).setOffset(0, 12);
                // else if (spike.angle === -90) spike.body.setSize(40, 48).setOffset(12, 0);
                // else if (spike.angle === 90) spike.body.setSize(40, 48).setOffset(0, 0);
                //最后，从图层中移除尖刺瓦片。
                this._sign.removeTileAt(tile.x, tile.y);
                
            }
        })
        this._sign?.renderDebug(debugGraphics,{
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        })

   
        
    }
    update(time: number, delta: number): void {
        //鼠标点击
        // When mouse is down, put a colliding tile at the mouse location
        const point = this.input.activePointer
        //获取点击后的世界地图的坐标
        const worldPoint = point.positionToCamera(this.cameras.main) as Vector
        if(point.isDown){
            const tile = this._sign.putTileAtWorldXY(9,worldPoint.x,worldPoint.y)
            tile.setCollision(true)
        }

        //移动
        const speed = 175;
        const prevVelocity = this._player.body.velocity.clone();
        // console.log(prevVelocity)
        // Stop any previous movement from the last frame
        this._player.body.setVelocity(0)
        if(this._controls?.down.isDown){
            this._player.body.setVelocityY(speed)
        }
        if(this._controls?.up.isDown){
            this._player.body.setVelocityY(-speed)
        }
        if(this._controls?.left.isDown){
            this._player.body.setVelocityX(-speed)
        }
        if(this._controls?.right.isDown){
            this._player.body.setVelocityX(speed)
        }
        // Normalize and scale the velocity so that player can't move faster along a diagonal
        this._player.body.velocity.normalize().scale(speed);
        // Update the animation last and give left/right animations precedence over up/down animations
        if(this._controls?.down.isDown){
            this._player.anims.play('PLAYER_DOWN',true)
        } else
        if(this._controls?.up.isDown){
            this._player.anims.play('PLAYER_UP',true)
        } else
        if(this._controls?.left.isDown){
            this._player.anims.play('PLAYER_LEFT',true)
        } else
        if(this._controls?.right.isDown){
            this._player.anims.play('PLAYER_RIGHT',true)
        }else{
            this._player.anims.stop();
            // If we were moving, pick and idle frame to use
            if (prevVelocity.x < 0) this._player.setFrame(10)
            else if (prevVelocity.x > 0) this._player.setFrame(4)
            else if (prevVelocity.y < 0) this._player.setFrame(1)
            else if (prevVelocity.y > 0) this._player.setFrame(7)
        }
        
    }
}