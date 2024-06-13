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
    _activePlayerAttackIndex:number;
    constructor(){
        super('BattleScene')
        console.log('BattleScene load',this)
    }

    init(){
        this._activePlayerAttackIndex = -1
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
                    baseAttack:25,
                    attackIds:[1],
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
                attackIds:[2,1],
                currentLevel:5
            },
            scaleHealthBarBackgroundImageByY:1,
            healthBarComponentPosition:{x:556,y:318}
        })
       
        
        //创建信息框
        this._battleMenu = new BattleMenu(this,this._activePlayerMonster)
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
            this._activePlayerAttackIndex = this._battleMenu.selectedAttack
            if( !this._activePlayerMonster.attacks[this._activePlayerAttackIndex] ) return
            this._battleMenu.hideMonsterAttackSubMenu()
            this._handleBattleSequene()

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
     
    _handleBattleSequene(){
        //如果 玩家、敌人同时选择攻击， 生成战斗序列
        //显示攻击信息，短暂暂停
        //展示战斗动画，短暂暂停
        //展示受伤动画，短暂暂停
        //血条动画，短暂暂停
        //换成另一只怪兽，重新走这个流程

        this._playerAttack()
    }
    _playerAttack(){
        this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activePlayerMonster.name} used ${this._activePlayerMonster.attacks[this._activePlayerAttackIndex].name}`],()=>{
            //引入时间插件
            this.time.delayedCall(500,()=>{
                this._activeEnemyMonster.takeDamage(this._activePlayerMonster.baseAttack,()=>{
                    this._enemyAttck()
                })
            })
        })
    }
    _enemyAttck(){
        if(this._activeEnemyMonster.isFainted){
            this._postBattleSequeneCheck()
            return
        }
        this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activeEnemyMonster.name} used ${this._activeEnemyMonster.attacks[0].name}`],()=>{
            this.time.delayedCall(500,()=>{
                this._activePlayerMonster.takeDamage(this._activeEnemyMonster.baseAttack,()=>{
                    this._postBattleSequeneCheck()
                })
            })
        })
    }
    /**
     * 战斗后序列的检查
     */
    _postBattleSequeneCheck(){
        /**
         * 检查敌方是否晕倒
         */
        if(this._activeEnemyMonster.isFainted){
            this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activeEnemyMonster.name} fainted`,'You have gained some exp!'],()=>{
                //过渡到世界地图
                this._transitionToNextScene()
            })
            return
        }

        if(this._activePlayerMonster.isFainted){
            this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activePlayerMonster.name} fainted`,'You have no more monsters'],()=>{
                this._transitionToNextScene()
            })
            return
        }

        this._battleMenu.showMainBattleMenu()
    }

    _transitionToNextScene(){
        //camare淡出动画效果
        this.cameras.main.fadeOut(600,0,0,0)
        //注册一个时间监听 淡出动画完成
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            //完成回调
            this.scene.start('world')
        })
    }
}