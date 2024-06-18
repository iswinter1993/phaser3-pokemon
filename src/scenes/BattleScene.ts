import { Scene } from "phaser";
import { BATTLLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/asset-keys";
import { Background } from "../battle/background";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";
import { HealthBar } from "../battle/ui/health-bar";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION, DirectionType } from "../common/direction";
import { StateMachine } from "../utils/state-machine";

const BATTLE_STATES = Object.freeze({
    INTRO:'INTRO',
    PRE_BATTLE_INFO:'PRE_BATTLE_INFO',
    BRING_OUT_MONSTER:'BRING_OUT_MONSTER',
    PLAYER_INPUT:'PLAYER_INPUT',
    ENEMY_INPUT:'ENEMY_INPUT',
    BATTLE:'BATTLE',
    POST_ATTACK_CHECK:'POST_ATTACK_CHECK',
    FINISHED:'FINISHED',
    FLEE_ATTEMPT:'FLEE_ATTEMPT'
})
export class BattleScene extends Scene {
    _battleMenu:BattleMenu;
    _cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    _playerHealthBar:HealthBar;
    _enemyHealthBar:HealthBar;
    _activeEnemyMonster:EnemyBattleMonster;
    _activePlayerMonster:PlayerBattleMonster;
    _activePlayerAttackIndex:number;
    _battleStateMachine:StateMachine;
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
                    baseAttack:5,
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
                baseAttack:15,
                attackIds:[2,1],
                currentLevel:5
            },
            scaleHealthBarBackgroundImageByY:1,
            healthBarComponentPosition:{x:556,y:318}
        })
       
        
        //创建信息框
        this._battleMenu = new BattleMenu(this,this._activePlayerMonster)
        
        this._createBattleStateMachine()
        
        //创建键盘 上下左右,空格 shift等热键 事件
        this._cursorkeys = this.input.keyboard?.createCursorKeys();
    }
    update(time: number, delta: number): void {
        this._battleStateMachine.update()
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
            this._battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT)

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
            this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
            return
        }
        this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activeEnemyMonster.name} used ${this._activeEnemyMonster.attacks[0].name}`],()=>{
            this.time.delayedCall(500,()=>{
                this._activePlayerMonster.takeDamage(this._activeEnemyMonster.baseAttack,()=>{
                    this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
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
                //过渡下个状态
                this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
            })
            return
        }

        if(this._activePlayerMonster.isFainted){
            this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activePlayerMonster.name} fainted`,'You have no more monsters'],()=>{
                this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
            })
            return
        }

        this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
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

    _createBattleStateMachine(){
        this._battleStateMachine = new StateMachine('battle',this)
        this._battleStateMachine.addState({
            name:BATTLE_STATES.INTRO,
            onEnter:()=>{
                //等待任意场景设置并且转换动画完成
                this.time.delayedCall(500,()=>{
                    this._battleStateMachine.setState(BATTLE_STATES.PRE_BATTLE_INFO)
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.PRE_BATTLE_INFO,
            onEnter:()=>{
                //等待敌方怪兽出现在场景中并通知玩家相关信息
                this.time.delayedCall(500,()=>{
                    this._battleMenu.updateInfoPanelMessageAndWaitForInput([`${this._activeEnemyMonster.name} appear!`],()=>{
                        //等待文本动画完成 并跳转下一个状态
                        this.time.delayedCall(500,()=>{
                            this._battleStateMachine.setState(BATTLE_STATES.BRING_OUT_MONSTER)
                        })
                    })
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.BRING_OUT_MONSTER,
            onEnter:()=>{
                //等待玩家怪兽出现并且 通知玩家相关信息
                this.time.delayedCall(500,()=>{
                    this._battleMenu.updateInfoPanelMessageAndWaitForInput([`go ${this._activePlayerMonster.name}!`],()=>{
                        //等待文本动画完成 并跳转下一个状态
                        //使用this.time.delayedCall函数，this._battleStateMachine.setState会被放到 微任务 中，
                        //会先把isChangingState赋值为false，然后运行this._battleStateMachine.setState，BATTLE_STATES.PLAYER_INPUT不会被push到changingStateQueQue序列
                        this.time.delayedCall(500,()=>{
                            this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
                        })
                    })
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.PLAYER_INPUT,
            onEnter:()=>{
                this._battleMenu.showMainBattleMenu()
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.ENEMY_INPUT,
            onEnter:()=>{
                //为敌方随机选择一个招式，并在未来实现AI行为

                //不使用this.time.delayedCall函数，this._battleStateMachine.setState不会放到 微任务 中，
                //先运行this._battleStateMachine.setState，此时isChangingState会是true，
                //BATTLE_STATES.BATTLE会被push到changingStateQueQue序列中，
                //然后isChangingState才赋值为false
                this._battleStateMachine.setState(BATTLE_STATES.BATTLE)
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.BATTLE,
            onEnter:()=>{
                //如果 玩家、敌人同时选择攻击， 生成战斗序列
                //显示攻击信息，短暂暂停
                //展示战斗动画，短暂暂停
                //展示受伤动画，短暂暂停
                //血条动画，短暂暂停
                //换成另一只怪兽，重新走这个流程

                this._playerAttack()
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.POST_ATTACK_CHECK,
            onEnter:()=>{
                this._postBattleSequeneCheck()
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.FINISHED,
            onEnter:()=>{
                this._transitionToNextScene()
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.FLEE_ATTEMPT,
            onEnter:()=>{
                this._battleMenu.updateInfoPanelMessageAndWaitForInput([`You got away safely!`],()=>{
                    this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
                })
            }
        })
        //启动状态机
        this._battleStateMachine.setState(BATTLE_STATES.INTRO)
    }
}