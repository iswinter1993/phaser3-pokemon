import { MonsterPartySceneData } from './MonsterPartyScene';
import { WorldSceneData } from './WorldScene';
import { Item, Monster, ITEM_CATEGORY } from './../types/typedef';
import { DataUtils } from './../utils/data-utils';
import { BaseScene } from './BaseScene';
import { createSceneTransition } from './../utils/scene-transition';
import { ATTACK_TARGET } from './../battle/attacks/attack-manager';
import { GameObjects, Scene } from "phaser";
import { AUDIO_ASSET_KEYS, BATTLLE_ASSET_KEYS, MONSTER_ASSET_KEYS } from "../assets/asset-keys";
import { AttackManager } from "../battle/attacks/attack-manager";
import { Background } from "../battle/background";
import { EnemyBattleMonster } from "../battle/monsters/enemy-battle-monster";
import { PlayerBattleMonster } from "../battle/monsters/player-battle-monster";
import { BattleMenu } from "../battle/ui/menu/battle-menu";
import { DIRECTION, DirectionType } from "../common/direction";
import { StateMachine } from "../utils/state-machine";
import { Controls } from '../utils/controls';
import { DATA_MANAGER_STORE_KEYS, dataManager } from '../utils/data-manager';
import { BATTLE_SCENE_OPTIONS } from '../common/option';
import { playBackgroundMusic, playSoundFx } from '../utils/audio-utils';
import { HealthBar } from '../common/health-bar';
import { calculatedExpGainedFromMonster, handleMonsterGainingExp, StateChange } from '../utils/level-utils';
import { Ball } from '../battle/ball';
import { sleep } from '../utils/time-utils';
import { generateUuid } from '../utils/random';

const BATTLE_STATES = Object.freeze({
    INTRO:'INTRO',
    PRE_BATTLE_INFO:'PRE_BATTLE_INFO',
    BRING_OUT_MONSTER:'BRING_OUT_MONSTER',
    PLAYER_INPUT:'PLAYER_INPUT',
    ENEMY_INPUT:'ENEMY_INPUT',
    BATTLE:'BATTLE',
    POST_ATTACK_CHECK:'POST_ATTACK_CHECK',
    FINISHED:'FINISHED',
    FLEE_ATTEMPT:'FLEE_ATTEMPT',
    GAIN_EXP:'GAIN_EXP',
    SWITCH_MONSTER:'SWITCH_MONSTER',
    USED_ITEM:'USED_ITEM',
    HEAL_ITEM_USED:'HEAL_USED_ITEM',
    CAPTURE_ITEM_USED:'CAPTURE_ITEM_USED',
    CAUGHT_MONSTER:'CAUGHT_MONSTER'
})


export type BattleSceneWasResumedData = {
    wasMonsterSelected:boolean,
    selectedMonsterIndex?:number,
    wasItemUsed:boolean,
    item?:Item
}

export type BattleSceneData = {
    playerMonsters:Monster[],
    enemyMonsters:Monster[]
}

export class BattleScene extends BaseScene {
    _battleMenu:BattleMenu;
    _cursorkeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    _playerHealthBar:HealthBar;
    _enemyHealthBar:HealthBar;
    _activeEnemyMonster:EnemyBattleMonster;
    _activePlayerMonster:PlayerBattleMonster;
    _activePlayerAttackIndex:number;
    _battleStateMachine:StateMachine;
    _attackManager:AttackManager
    _skipAnimations:boolean
    _activeEnemyAttackIndex:number
    _sceneData:BattleSceneData
    //为了更新datamanage中的数据
    _activePlayerMonsterPartyIndex:number
    //玩家是否被击败
    _playerKnockedOut:boolean
    //正在选择怪兽
    _switchingActiveMonster:boolean
    //我们当前怪兽是否被击败
    _activeMonsterKnockedOut:boolean
    //精灵球显示 怪兽还剩几只
    _availableMonsterUiContainer:GameObjects.Container
    //怪兽是否捕捉到
    _monsterCaptured:boolean
    //精灵球
    _ball:Ball
    constructor(){
        super('BattleScene')
        console.log('BattleScene load',this)
    }

    init(data:BattleSceneData){
        super.init(data)
        this._sceneData = data
        if(Object.keys(data).length === 0){
            console.log('MONSTER_IN_PARTY:',dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY))
            this._sceneData = {
                playerMonsters:[...dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)],
                enemyMonsters:[DataUtils.getMonsterById(this,2) as Monster]
            }
        }
        this._activePlayerAttackIndex = -1
        this._activeEnemyAttackIndex = -1
        this._activePlayerMonsterPartyIndex = 0
        const chosenBattleSceneOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE)
        if(chosenBattleSceneOption === undefined || chosenBattleSceneOption === BATTLE_SCENE_OPTIONS.ON){
            this._skipAnimations = false
            return
        }
        this._skipAnimations = true
        this._playerKnockedOut = false
        this._switchingActiveMonster = false
        this._activeMonsterKnockedOut = false
        this._monsterCaptured = false
    }

    create(){
        super.create()
        // create main background
        const background = new Background(this)
        background.showForest()
        // create player and enemy monster 创建怪兽
        this._activeEnemyMonster = new EnemyBattleMonster(
            {
                scene:this,
                monsterDetails:this._sceneData.enemyMonsters[0],
                scaleHealthBarBackgroundImageByY:0.8,
                healthBarComponentPosition:{x:0,y:0},
                skipBattleAnimations:this._skipAnimations
            }
        )
        //create ball
        this._ball = new Ball({
            scene:this,
            assetKey:BATTLLE_ASSET_KEYS.DAMAGED_BALL,
            assetFrame:0,
            scale:0.1,
            skipBattleAnimations:this._skipAnimations
        })
        // this.add.image(768,144,MONSTER_ASSET_KEYS.CARNODUSK,0) //没有动画，最后参数设置为0
       
        //render player health bar 玩家健康条
        //
        const LiveMonsterIndex = this._sceneData.playerMonsters.findIndex(monster=>monster.currentHp > 0)
        this._activePlayerMonsterPartyIndex = LiveMonsterIndex
        this._activePlayerMonster = new PlayerBattleMonster({
            scene:this,
            monsterDetails:this._sceneData.playerMonsters[this._activePlayerMonsterPartyIndex],
            scaleHealthBarBackgroundImageByY:1,
            healthBarComponentPosition:{x:556,y:318},
            skipBattleAnimations:this._skipAnimations
        })
       
        
        //创建信息框
        this._battleMenu = new BattleMenu(this,this._activePlayerMonster,this._skipAnimations)
        
        this._createBattleStateMachine()

        this._attackManager = new AttackManager(this,this._skipAnimations)

        this._createAvailableMonsterUi()
        
        //创建键盘 上下左右,空格 shift等热键 事件
        // this._controls 已在BaseScene中创建
        this._controls.lockInput = true
        //设置声音
        playBackgroundMusic(this,AUDIO_ASSET_KEYS.BATTLE)

    }
    update(time: number, delta: number): void {
        this._battleStateMachine.update()

        if(this._controls.isInputLocked) {
            return
        }

        //空格键是否按下
        const wasSpaceKeyPressed = this._controls.wasSpaceKeyPressed()
        //基于当前战斗状态，限制玩家输入
        //如果我们不在正确的状态，提前返回不处理输入
        if(wasSpaceKeyPressed && (this._battleStateMachine.currentStateName === BATTLE_STATES.PRE_BATTLE_INFO
            || this._battleStateMachine.currentStateName === BATTLE_STATES.POST_ATTACK_CHECK
            || this._battleStateMachine.currentStateName === BATTLE_STATES.FLEE_ATTEMPT
            || this._battleStateMachine.currentStateName === BATTLE_STATES.GAIN_EXP
            || this._battleStateMachine.currentStateName === BATTLE_STATES.SWITCH_MONSTER
            || this._battleStateMachine.currentStateName === BATTLE_STATES.CAPTURE_ITEM_USED
        )){
            this._battleMenu.handlePlayerInput('OK')
            return
        }

        if( this._battleStateMachine.currentStateName !== BATTLE_STATES.PLAYER_INPUT){
            return
        }
        if(wasSpaceKeyPressed){
            this._battleMenu.handlePlayerInput('OK')

            //玩家是否使用道具
            if(this._battleMenu.wasItemUsed){
                this._battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT)
                return
            }

            //判断玩家是否逃跑
            if(this._battleMenu.isAttemptingToFlee){
                this._battleStateMachine.setState(BATTLE_STATES.FLEE_ATTEMPT)
                return
            }
            //是否切换怪兽
            if(this._battleMenu.isAttemptingToSwitchMonster){
                this._battleStateMachine.setState(BATTLE_STATES.SWITCH_MONSTER)
                return
            }

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
        const wasShiftKeyPressed = this._controls.wasBackKeyPressed()
        if(wasShiftKeyPressed){
            this._battleMenu.handlePlayerInput('CANCEL')
            return
        }
        
        let selectedDirection:DirectionType = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._battleMenu.handlePlayerInput(selectedDirection)
        }
    }
     
    /**
     * 
     * @param callback ()=>void
     */
    _playerAttack(callback:()=>void){
        //现在攻击时随机的都要判断状态
        if(this._activePlayerMonster.isFainted){

            callback()
            return
        }
        this._battleMenu.updateInfoPaneMessageNoInputRequired(`${this._activePlayerMonster.name} used ${this._activePlayerMonster.attacks[this._activePlayerAttackIndex].name}`,()=>{
            //引入时间插件
            this.time.delayedCall(500,()=>{
                this.time.delayedCall(100,()=>{
                    playSoundFx(this,this._activePlayerMonster.attacks[this._activePlayerAttackIndex].audioKey)
                })
                this._attackManager.playAttackAnimation(this._activePlayerMonster.attacks[this._activePlayerAttackIndex].animationName,ATTACK_TARGET.ENEMY,()=>{
                    this._activeEnemyMonster.playTakeDamageAnimation(()=>{
                        this._activeEnemyMonster.takeDamage(this._activePlayerMonster.baseAttack,()=>{
                            callback()
                        })
                    })
                })
            })
        }
        )
    }
    /**
     * 
     * @param callback ()=>void
     * @returns 
     */
    _enemyAttck(callback:()=>void){
        if(this._activeEnemyMonster.isFainted){

            callback()
            return
        }
        //使用随机招式
        this._battleMenu.updateInfoPaneMessageNoInputRequired(`${this._activeEnemyMonster.name} used ${this._activeEnemyMonster.attacks[this._activeEnemyAttackIndex].name}`,()=>{
            this.time.delayedCall(500,()=>{
                this.time.delayedCall(100,()=>{
                    playSoundFx(this,this._activeEnemyMonster.attacks[this._activeEnemyAttackIndex].audioKey)
                })
                this._attackManager.playAttackAnimation(this._activeEnemyMonster.attacks[this._activeEnemyAttackIndex].animationName,ATTACK_TARGET.PLAYER,()=>{
                    this._activePlayerMonster.playTakeDamageAnimation(()=>{
                        this._activePlayerMonster.takeDamage(this._activeEnemyMonster.baseAttack,()=>{
                            callback()
                        })
                    })
                })
            })
        }
        )
    }
    /**
     * 战斗后序列的检查
     */
    _postBattleSequeneCheck(){
        this._controls.lockInput = true
        //确保战斗后的血量保持一致
        this._sceneData.playerMonsters[this._activePlayerMonsterPartyIndex].currentHp = this._activePlayerMonster.currentHp
        dataManager.store.set(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY,this._sceneData.playerMonsters)


        if(this._monsterCaptured){
            this._activeEnemyMonster.playDeathAnimation(()=>{
                this._controls.lockInput = false
                this._battleMenu.updateInfoPaneMessageAndWaitForInput([`你抓到了 ${this._activeEnemyMonster.name}。`],()=>{
                    //过渡下个状态
                    this._battleStateMachine.setState(BATTLE_STATES.GAIN_EXP)
                }
                )
            })
            return
        }
        /**
         * 检查敌方是否晕倒
         */
        if(this._activeEnemyMonster.isFainted){
            this._activeEnemyMonster.playDeathAnimation(()=>{
                this._controls.lockInput = false
                this._battleMenu.updateInfoPaneMessageAndWaitForInput([`${this._activeEnemyMonster.name} fainted`],()=>{
                    //过渡下个状态
                    this._battleStateMachine.setState(BATTLE_STATES.GAIN_EXP)
                }
                )
            })
            
            return
        }

        if(this._activePlayerMonster.isFainted){
            this._activePlayerMonster.playDeathAnimation(()=>{
                (this._availableMonsterUiContainer.getAt(this._activePlayerMonsterPartyIndex) as GameObjects.Image).setAlpha(0.4)
                this._controls.lockInput = false
                const hasOtherActiveMonster = this._sceneData.playerMonsters.some(monster=>{
                    return (monster.id !== this._sceneData.playerMonsters[this._activePlayerMonsterPartyIndex].id && monster.currentHp > 0)
                })
                if(!hasOtherActiveMonster){
                    this._battleMenu.updateInfoPaneMessageAndWaitForInput([`${this._activePlayerMonster.name} fainted`,'You have no more monsters'],()=>{
                            this._playerKnockedOut = true
                            this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
                        }
                    )
                    return
                }

                this._battleMenu.updateInfoPaneMessageAndWaitForInput([`${this._activePlayerMonster.name} fainted`,'Choose a monster continue battle'],()=>{
                        this._activeMonsterKnockedOut = true
                        this._battleStateMachine.setState(BATTLE_STATES.SWITCH_MONSTER)
                    }
                )

            })
            return
        }
        this._controls.lockInput = false
        this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
    }

    _transitionToNextScene(){

        const sceneDataToPass:WorldSceneData = {
            isPlayerKnockOut:this._playerKnockedOut
        }
        //camare淡出动画效果
        this.cameras.main.fadeOut(600,0,0,0)
        //注册一个时间监听 淡出动画完成
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            //完成回调
            this.scene.start('WorldScene',sceneDataToPass)
        })
    }

    _createBattleStateMachine(){
        this._battleStateMachine = new StateMachine('battle',this)
        this._battleStateMachine.addState({
            name:BATTLE_STATES.INTRO,
            onEnter:()=>{
                //等待任意场景设置并且转换动画完成
                createSceneTransition(this,{
                    skipSceneTransition:false,
                    callback:()=>{
                        this._battleStateMachine.setState(BATTLE_STATES.PRE_BATTLE_INFO)
                    }
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.PRE_BATTLE_INFO,
            onEnter:()=>{
                //等待敌方怪兽出现在场景中并通知玩家相关信息
                    this._activeEnemyMonster.playMonsterAppearAnimation(()=>{
                        this._activeEnemyMonster.playMonsterHealthAppearAnimation(()=>{
                            this._availableMonsterUiContainer.setAlpha(1)
                        })
                        this._controls.lockInput = false
                        this._battleMenu.updateInfoPaneMessageAndWaitForInput([`${this._activeEnemyMonster.name} appear!`],()=>{
                            //等待文本动画完成 并跳转下一个状态
                            this._battleStateMachine.setState(BATTLE_STATES.BRING_OUT_MONSTER)
                        }
                        )
                    })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.BRING_OUT_MONSTER,
            onEnter:()=>{
                //等待玩家怪兽出现并且 通知玩家相关信息
                    this._activePlayerMonster.playMonsterAppearAnimation(()=>{
                        this._activePlayerMonster.playMonsterHealthAppearAnimation(()=>{})
                        this._battleMenu.updateInfoPaneMessageNoInputRequired(`go ${this._activePlayerMonster.name}!`,()=>{


                            //等待文本动画完成 并跳转下一个状态
                            //运用事件循环机制，先安照代码循序执行，
                            //使用this.time.delayedCall函数，this._battleStateMachine.setState会被放到 宏任务队列 中，
                            //isChangingState为同步执行代码没有使用任何队列，所以先赋值为false，主代码流程执行完成后，开始执行微任务队列，
                            //当微任务队列为空后，开始执行宏任务队列，运行this._battleStateMachine.setState，因为isChangingState已经是false，
                            //BATTLE_STATES.PLAYER_INPUT不会被push到changingStateQueQue序列
                            this.time.delayedCall(800,()=>{
                                //检查是否切换怪兽
                                if(this._switchingActiveMonster && !this._activeMonsterKnockedOut){
                                    this._battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT)
                                    return
                                }
                                this._switchingActiveMonster = false
                                this._activeMonsterKnockedOut = false
                                this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
                            })
                        }
                        )
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
                this._activeEnemyAttackIndex = this._activeEnemyMonster.pickRandomMove()

                //不使用this.time.delayedCall函数，this._battleStateMachine.setState不会放到 宏任务队列 中，
                //所以this._battleStateMachine.setState为同步执行代码没有使用任何队列，会先执行，此时isChangingState会是true，
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


                //如果使用了道具，只有敌人攻击
                if(this._battleMenu.wasItemUsed){
                    this._battleStateMachine.setState(BATTLE_STATES.USED_ITEM)
                    

                }else if(this._battleMenu.isAttemptingToFlee){
                    //是否试图逃跑,
                    this.time.delayedCall(200,()=>this._enemyAttck(()=>{
                        this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                    }))

                }else if(this._switchingActiveMonster){
                    this.time.delayedCall(500,()=>this._enemyAttck(()=>{
                        this._switchingActiveMonster = false
                        this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                    }))
                }
                else{
                    const randomNumber = Phaser.Math.Between(0,1)
                    if(randomNumber === 0){
                        this._playerAttack(()=>{
                            this._enemyAttck(()=>{
                                this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                            })
                        })
                    }else{
                        this._enemyAttck(()=>{
                            this._playerAttack(()=>{
                                this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                            })
                        })
                    }
                }
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
                dataManager.store.set(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY,this._sceneData.playerMonsters)
                this._transitionToNextScene()
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.FLEE_ATTEMPT,
            onEnter:()=>{
                const randomNumber = Phaser.Math.Between(1,10)
                if(randomNumber > 5){
                    this._battleMenu.updateInfoPaneMessageAndWaitForInput([`You got away safely!`],()=>{
                        playSoundFx(this,AUDIO_ASSET_KEYS.FLEE)
                        this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
                    })
                }else{
                    this._battleMenu.updateInfoPaneMessageAndWaitForInput(['You Failed to flee...'],()=>{
                        this.time.delayedCall(300,()=>{
                            this._battleStateMachine.setState(BATTLE_STATES.ENEMY_INPUT)
                        })
                    })
                }
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.GAIN_EXP,
            onEnter:()=>{
                //update exp bar
                //计算正在战斗的宠物获得的经验
                const gainedExpForActiveMonster = calculatedExpGainedFromMonster(this._activeEnemyMonster.baseExpValue,this._activeEnemyMonster.level,true)
                //计算队伍中没有战斗的宠物获得的经验
                const gainedExpForUnActiveMonster = calculatedExpGainedFromMonster(this._activeEnemyMonster.baseExpValue,this._activeEnemyMonster.level,false)
                const message:string[] = []
               
                let activeMonsterlevelUp = false
                console.log(this._sceneData.playerMonsters)
                this._sceneData.playerMonsters.forEach((monster,index)=>{
                    const monsterMessage:string[] = []
                    console.log(index,this._activePlayerMonsterPartyIndex)
                    if(this._sceneData.playerMonsters[index].currentHp <= 0){
                        return
                    }

                    let stateChange:StateChange = {
                        level:0, health:0, attack:0
                    }
                    if(index === this._activePlayerMonsterPartyIndex){
                        stateChange = this._activePlayerMonster.updateMonsterExp(gainedExpForActiveMonster)
                        monsterMessage.push(`${this._sceneData.playerMonsters[index].name} gained ${gainedExpForActiveMonster} exp.`)
                        //战斗中的怪兽是否升级
                        if(stateChange?.level !== 0){
                            activeMonsterlevelUp = true
                        }
                    }else{
                        stateChange = handleMonsterGainingExp(this._sceneData.playerMonsters[index],gainedExpForUnActiveMonster)
                        monsterMessage.push(`${this._sceneData.playerMonsters[index].name} gained ${gainedExpForUnActiveMonster} exp.`)
                    }

                    if(stateChange?.level !== 0){
                        monsterMessage.push(`${this._sceneData.playerMonsters[index].name} level increase to ${this._sceneData.playerMonsters[index].currentLevel}`)
                        monsterMessage.push(`${this._sceneData.playerMonsters[index].name} attack +${stateChange.attack}`)
                        monsterMessage.push(`${this._sceneData.playerMonsters[index].name} health +${stateChange.health}`)
                    }
                    
                    if(index === this._activePlayerMonsterPartyIndex){
                        message.unshift(...monsterMessage)
                    }else{
                        message.push(...monsterMessage)
                    }
                })
                console.log(message)
                this._controls.lockInput = true
                this._activePlayerMonster.updateMonsterExpBar(activeMonsterlevelUp,false,()=>{
                    this._battleMenu.updateInfoPaneMessageAndWaitForInput(message,()=>{
                        this.time.delayedCall(200,()=>{
                            
                            if(this._monsterCaptured){
                                this._battleStateMachine.setState(BATTLE_STATES.CAUGHT_MONSTER)
                                return
                            }
                            this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
                        })
                    })
                    this._controls.lockInput = false
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.SWITCH_MONSTER,
            onEnter:()=>{
                const hasOtherActiveMonster = this._sceneData.playerMonsters.some(monster=>{
                    return (monster.id !== this._sceneData.playerMonsters[this._activePlayerMonsterPartyIndex].id && monster.currentHp > 0)
                })
                if(!hasOtherActiveMonster){
                    this._battleMenu.updateInfoPaneMessageAndWaitForInput(['You have no other monsters...'],()=>{
                        this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
                    })
                    return
                }
                const sceneDataToPass:MonsterPartySceneData = {
                    previousScene:'BattleScene',
                    activeBattleMonsterInPartyIndex:this._activePlayerMonsterPartyIndex,
                    activeMonsterKnockedOut:this._activeMonsterKnockedOut
                }
                this.scene.launch('MonsterPartyScene', sceneDataToPass)
                this.scene.pause('BattleScene')

            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.USED_ITEM,
            onEnter:()=>{
                switch (this._battleMenu.itemUsed?.category) {
                    case ITEM_CATEGORY.HEAL:
                        this._battleStateMachine.setState(BATTLE_STATES.HEAL_ITEM_USED)
                        break;
                    case ITEM_CATEGORY.CAPTURE:
                        this._battleStateMachine.setState(BATTLE_STATES.CAPTURE_ITEM_USED)
                        break;
                    default:
                        break;
                }
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.HEAL_ITEM_USED,
            onEnter:()=>{
                this._activePlayerMonster.updateMonsterHealth(
                    dataManager.store.get(DATA_MANAGER_STORE_KEYS.MONSTER_IN_PARTY)[this._activePlayerMonsterPartyIndex].currentHp
                )
                this.time.delayedCall(500,()=>this._enemyAttck(()=>{
                    this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                }))
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.CAPTURE_ITEM_USED,
            onEnter:async ()=>{
                const wasCaptured = false
                await this._ball.playThrowBallAnimations()
                await this._activeEnemyMonster.playCatchEnemy()
                await this._ball.playShakeBallAnimations()
                
                if(wasCaptured){
                    this._monsterCaptured = true
                    this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                    return
                }
                await sleep(500)
                this._ball.hide()
                await this._activeEnemyMonster.playCatchEnemyFailed()
                this._battleMenu.updateInfoPaneMessageAndWaitForInput(['捕捉怪兽失败'],()=>{
                    this.time.delayedCall(500,()=>this._enemyAttck(()=>{
                        this._battleStateMachine.setState(BATTLE_STATES.POST_ATTACK_CHECK)
                    }))
                })
            }
        })
        this._battleStateMachine.addState({
            name:BATTLE_STATES.CAUGHT_MONSTER,
            onEnter:async ()=>{
                const updatedMonster = {
                    ...this._sceneData.enemyMonsters[0],
                    id:generateUuid(),
                    currentHp:this._activeEnemyMonster.currentHp
                }
                this._sceneData.playerMonsters.push(updatedMonster)
                this._battleStateMachine.setState(BATTLE_STATES.FINISHED)
            }
        })
        //启动状态机
        this._battleStateMachine.setState(BATTLE_STATES.INTRO)
    }
    /**
     * 监听回调
     * @param sys 系统数据
     * @param data 我们返回的数据
     */
     handleSceneResume(sys:Scene,data:BattleSceneWasResumedData){
        super.handleSceneResume(sys,data)
        if(!data || !data.wasMonsterSelected || data.selectedMonsterIndex === undefined){
            this._battleStateMachine.setState(BATTLE_STATES.PLAYER_INPUT)
            return
        }
        this._controls.lockInput = true
        this._switchingActiveMonster = true

        this._activePlayerMonster.playDeathAnimation(()=>{
            this._activePlayerMonsterPartyIndex = data.selectedMonsterIndex as number
            this._activePlayerMonster.switchMonster(this._sceneData.playerMonsters[(data.selectedMonsterIndex as number)])
            this._battleMenu.updateMonsterAttackSubMenu()
            this._controls.lockInput = false
            this._battleStateMachine.setState(BATTLE_STATES.BRING_OUT_MONSTER)
        })
    }
    /**
     * 创建精灵球其显示ui逻辑
     */
    _createAvailableMonsterUi(){
        this._availableMonsterUiContainer = this.add.container(this.scale.width - 24,304,[])
        this._sceneData.playerMonsters.forEach((monster,index)=>{
            const alpha = monster.currentHp > 0 ? 1: 0.4
            const ball = this.add.image(30 * (-index),0,BATTLLE_ASSET_KEYS.BALL_THUMBNAIL,0).setScale(0.8).setAlpha(alpha)
            this._availableMonsterUiContainer.add(ball)
        })
        this._availableMonsterUiContainer.setAlpha(0)
    }
}