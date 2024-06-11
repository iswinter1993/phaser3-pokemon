import { Scene } from "phaser";
import { BATTLLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/asset-keys";
import { Background } from "../battle/background";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION, DirectionType } from "../common/direction";


export class BattleScene extends Scene {
    _battleMenu:BattleMenu;
    _cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    _playerHealthBar:HealthBar;
    _enemyHealthBar:HealthBar;
    _activeEnemyMonster:EnemyBattleMonster;
    _activePlayerMonster:PlayerBattleMonster;
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
        this._activeEnemyMonster = new EnemyBattleMonster(
            {
                scene:this,
                monsterDetails:{
                    name:MONSTER_ASSET_KEYS.CARNODUSK,
                    assetKey:MONSTER_ASSET_KEYS.CARNODUSK,
                    maxHp:25,
                    currentHp:25,
                    baseAttack:5,
                    attackIds:[],
                    currentLevel:5
                },
                scaleHealthBarBackgroundImageByY:0.8,
                healthBarComponentPosition:{x:0,y:0}
            }
        )
        // this.add.image(768,144,MONSTER_ASSET_KEYS.CARNODUSK,0) //没有动画，最后参数设置为0
       
        //render player health bar 玩家健康条
        this._activePlayerMonster = new PlayerBattleMonster({
            scene:this,
            monsterDetails:{
                name:MONSTER_ASSET_KEYS.IGUANIGNITE,
                assetKey:MONSTER_ASSET_KEYS.IGUANIGNITE,
                maxHp:25,
                currentHp:25,
                baseAttack:5,
                attackIds:[],
                currentLevel:5
            },
            scaleHealthBarBackgroundImageByY:1,
            healthBarComponentPosition:{x:556,y:318}
        })
       
        //render enemy health bar 敌人健康条
        // this._enemyHealthBar = new HealthBar(this,34,34)
        
        this._activeEnemyMonster.takeDamage(15,()=>{
            console.log('EnemyMonster受到攻击',15)
        })
        console.log(this._activeEnemyMonster.isFainted)
        this._activePlayerMonster.takeDamage(5,()=>{
            console.log('PlayerMonster受到攻击',5)
        })
        console.log(this._activePlayerMonster.isFainted)
        //创建信息框
        this._battleMenu = new BattleMenu(this)
        this._battleMenu.showMainBattleMenu()
        //创建键盘 上下左右,空格 shift等热键 事件
        this._cursorkeys = this.input.keyboard?.createCursorKeys();
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