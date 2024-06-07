import { GameObjects, Input, Scene, Types } from "phaser";
import { BATTLE_BACKGROUND_ASSET_KEYS, BATTLLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/asset-keys";
import { Background } from "../battle/background";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION, DirectionType } from "../common/direction";


export class BattleScene extends Scene {
    _battleMenu:BattleMenu;
    _cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    _playerHealthBar:HealthBar;
    _enemyHealthBar:HealthBar;
    constructor(){
        super('BattleScene')
        console.log('BattleScene load',this)
    }

    init(){
        
    }

    preload(){}

    create(){
        // create main background
        const background = new Background(this)
        background.showForest()
        // create player and enemy monster 创建怪兽
        this.add.image(768,144,MONSTER_ASSET_KEYS.CARNODUSK,0) //没有动画，最后参数设置为0
        this.add.image(256,316,MONSTER_ASSET_KEYS.IGUANIGNITE,0).setFlipX(true)
        //render player health bar 玩家健康条
        this._playerHealthBar = new HealthBar(this,34,34);
        const playerMonsterName = this.add.text(30,20,MONSTER_ASSET_KEYS.IGUANIGNITE,{
            color:'#7E3D3F',
            fontSize:'32px'
        })
        this.add.container(556, 318, [
            this.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0),
            playerMonsterName,
            this._playerHealthBar.container,
            this.add.text(playerMonsterName.width+35,23,'L5',{
                color:'#ED474B',
                fontSize:'28px'
            }),
            this.add.text(30,55,'HP',{
                color:'#FF6505',
                fontSize:'24px',
                fontStyle:'italic'
            }),
            this.add.text(443,80,'25/25',{
                color:'#7E3D3F',
                fontSize:'16px',
            }).setOrigin(1,0),
        ])
        //render enemy health bar 敌人健康条
        this._enemyHealthBar = new HealthBar(this,34,34)
        const enemyMonsterName = this.add.text(30,20,MONSTER_ASSET_KEYS.CARNODUSK,{
            color:'#7E3D3F',
            fontSize:'32px'
        })
        this.add.container(0, 0, [
            this.add.image(0,0,BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND).setOrigin(0).setScale(1,0.8),
            enemyMonsterName,
            this._enemyHealthBar.container,
            this.add.text(enemyMonsterName.width+35,23,'L5',{
                color:'#ED474B',
                fontSize:'28px'
            }),
            this.add.text(30,55,'HP',{
                color:'#FF6505',
                fontSize:'24px',
                fontStyle:'italic'
            }),
        ])

        //创建信息框
        this._battleMenu = new BattleMenu(this)
        this._battleMenu.showMainBattleMenu()
        //创建键盘 上下左右,空格 shift等热键 事件
        this._cursorkeys = this.input.keyboard?.createCursorKeys();
        this._playerHealthBar.setMeterPercentageAnimated(0.6)
    }
    update(time: number, delta: number): void {
        //空格键是否按下
        const wasSpaceKeyPressed = Phaser.Input.Keyboard.JustDown(this._cursorkeys?.space)
        // console.log(wasSpaceKeyPressed)
        if(wasSpaceKeyPressed){
            this._battleMenu.handlePlayerInput('OK')
            //判断玩家选择的招式，并更新文本
            if(this._battleMenu.selectedAttack === undefined){
                return
            }
            console.log('选择使用招式：',this._battleMenu.selectedAttack)
            this._battleMenu.hideMonsterAttackSubMenu()
            this._battleMenu.updateInfoPanelMessageAndWaitForInput([`Your monster attacks enemy`],this._battleMenu.showMainBattleMenu)

            return
        }
        const wasShiftKeyPressed = Phaser.Input.Keyboard.JustDown(this._cursorkeys?.shift)
        if(wasShiftKeyPressed){
            this._battleMenu.handlePlayerInput('CANCEL')
            return
        }
        
        let selectedDirection:DirectionType = DIRECTION.NONE
        if(this._cursorkeys?.left.isDown){
            selectedDirection = DIRECTION.LEFT
        } else if(this._cursorkeys?.right.isDown){
            selectedDirection = DIRECTION.RIGHT
        } else if(this._cursorkeys?.up.isDown){
            selectedDirection = DIRECTION.UP
        } else if(this._cursorkeys?.down.isDown){
            selectedDirection = DIRECTION.DOWN
        }
        if(selectedDirection !== DIRECTION.NONE){
            this._battleMenu.handlePlayerInput(selectedDirection)
        }
    }
    

}