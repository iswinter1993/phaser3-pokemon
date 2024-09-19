import { InventorySceneData, InventorySceneItemUsedData } from './../../../scenes/InventoryScene';
import { DIRECTION, DirectionType } from './../../../common/direction';
import { GameObjects, Scene, Tweens } from "phaser";
import { MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../../../assets/asset-keys";
import { ActiveBattleMenu, ACTIVE_BATTLE_MENU, AttackMoveOption, ATTACK_MOVE_OPTION, BattleMenuOption, BATTLE_MENU_OPTION } from './battle-menu-option';
import { BATTLE_UI_TEXT_STYLE } from './battle-menu-config';
import { PlayerBattleMonster } from '../../monsters/player-battle-monster';
import { animateText } from '../../../utils/text-utils';
import { dataManager } from '../../../utils/data-manager';
import { BattleSceneWasResumedData } from '../../../scenes/BattleScene';
import { Item } from '../../../types/typedef';


const BATTLE_MENU_CURSOR_POS =Object.freeze({
    x:42,
    y:38
}) 

const ATTACK_MENU_CURSOR_POS =Object.freeze({
    x:42,
    y:38
}) 
const PLAYER_INPUT_CURSOR_POS =Object.freeze({
    y:38
}) 

export class BattleMenu {
    _scene:Scene;
    _mainBattleMenuPhaserContainerGameObject: GameObjects.Container;
    _moveSelectionSubBattleMenuPhaserContainerGameObject: GameObjects.Container;
    _battleTextGameObjectLine1:GameObjects.Text;
    _battleTextGameObjectLine2:GameObjects.Text;
    _mainBattleMenuCursorPhaserImageGameObject:GameObjects.Image;
    _attackBattleMenuCursorPhaserImageGameObject:GameObjects.Image;
    /**
     * @_selectedBattleMenuOption 主菜单中选择的项
     */
    _selectedBattleMenuOption:BattleMenuOption;
    /**
     * @_selectedAttackMenuOption 选择的招式
     */
    _selectedAttackMenuOption:AttackMoveOption;
    /**
     * @_activeBattleMenu 当前所在的菜单
     */
    _activeBattleMenu:ActiveBattleMenu;
    /**
     * @_queuedInfoPanelMessage 消息队列
     */
    _queuedInfoPanelMessage:string[];
    /**
     * @_queuedInfoPanelCallback 消息队列为空时的回调函数
     */
    _queuedInfoPanelCallback:(()=>void) | undefined;
    /**
     * @_waitingForPlayerInput 是否等待玩家输入, 消息队列不为空则设施为true
     */
    _waitingForPlayerInput:Boolean;
    /**
     * @_selectedAttackIndex 选择招式的索引
     */
     _selectedAttackIndex:number | undefined;
     _activePlayerMonster:PlayerBattleMonster;
     /**
      * 文案后提醒用户输入光标
      */
     _userInputCursorPhaserImageObject:GameObjects.Image;
     /**
      * 文案后提醒用户输入光标的动画
      */
     _userInputCursorPhaserTween:Tweens.Tween
     /**
      * 是否跳过文字动画
      */
     _skipAnimations:boolean
     /**
      * 文字动画是否正在播放
      */
     _quequeMessagesAnimationPlaying:boolean
     //使用的道具
     _usedItem:Item | undefined
     //逃跑
     _fleeAttempt:boolean
     //切换怪兽
     _switchMonsterAttempt:boolean
     //是否使用了道具
     _wasItemUsed:boolean

    constructor(scene: Scene, activePlayerMonster:PlayerBattleMonster,skipAnimations=false){
        this._scene = scene
        this._activePlayerMonster = activePlayerMonster
        this._selectedAttackIndex = undefined
        this._queuedInfoPanelCallback = undefined
        this._queuedInfoPanelMessage = []
        this._waitingForPlayerInput = false
        this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN 
        this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FIGHT
        this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_1
        this._skipAnimations = skipAnimations
        this._quequeMessagesAnimationPlaying = false
        this._init()
        this._wasItemUsed = false
        this._usedItem = undefined
        this._fleeAttempt = false
        this._switchMonsterAttempt = false
        //不是继承自Scene，所以监听场景resume场景重启事件要单独写一次
        //监听场景resume场景重启事件，获取返回数据
         this._scene.events.on(Phaser.Scenes.Events.RESUME,this._handleSceneResume,this)
         //监听调用scene.stop方法时，清理上面的监听事件
         this._scene.events.once(Phaser.Scenes.Events.SHUTDOWN,()=>{
            this._scene.events.off(Phaser.Scenes.Events.RESUME,this._handleSceneResume,this)
         },this)
    }
    /**
     * 是否在招式选择菜单，选择了招式。
     */
    get selectedAttack(){
        if(this._activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT){
            return this._selectedAttackIndex
        }
        return undefined
    }

    get wasItemUsed(){
        return this._wasItemUsed
    }

    get itemUsed(){
        return this._usedItem
    }

    get isAttemptingToFlee(){
        return this._fleeAttempt
    }

    get isAttemptingToSwitchMonster(){
        return this._switchMonsterAttempt
    }

    updateMonsterAttackSubMenu(){
        this._moveSelectionSubBattleMenuPhaserContainerGameObject.getAll().forEach(gameObject=>{
            if(gameObject.type === 'text') {
                (gameObject as GameObjects.Text).setText('-')
            }
        })
        this._activePlayerMonster.attacks.forEach((attack,index)=>{
            (this._moveSelectionSubBattleMenuPhaserContainerGameObject.getAt(index) as GameObjects.Text).setText(attack.name)
        })
    }

    playInputCursorAnimate(){
        this._userInputCursorPhaserImageObject.setPosition(this._battleTextGameObjectLine1.displayWidth + this._userInputCursorPhaserImageObject.displayWidth * 2.7,
            this._userInputCursorPhaserImageObject.y
        )
        this._userInputCursorPhaserImageObject.setAlpha(1)
        this._userInputCursorPhaserTween.restart()
    }
    hideInputCursorAnimate(){
        this._userInputCursorPhaserImageObject.setAlpha(0)
        this._userInputCursorPhaserTween.pause()
    }

    showMainBattleMenu(){
        this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN
        this._battleTextGameObjectLine1.setText('what should')
        this._mainBattleMenuPhaserContainerGameObject.setAlpha(1)
        this._battleTextGameObjectLine1.setAlpha(1)
        this._battleTextGameObjectLine2.setAlpha(1)
        this._selectedAttackIndex = undefined
        this._wasItemUsed = false
        this._usedItem = undefined
        this._fleeAttempt = false
        this._switchMonsterAttempt = false
        // this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FIGHT
        // this._mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x,BATTLE_MENU_CURSOR_POS.y)
    }
    hideMainBattleMenu(){
        this._mainBattleMenuPhaserContainerGameObject.setAlpha(0)
        this._battleTextGameObjectLine1.setAlpha(0)
        this._battleTextGameObjectLine2.setAlpha(0)
    }
    showMonsterAttackSubMenu(){
        this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT
        this._moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(1)
    }
    hideMonsterAttackSubMenu(){
        this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_MAIN
        this._moveSelectionSubBattleMenuPhaserContainerGameObject.setAlpha(0)
    }

    handlePlayerInput(input:'OK'|'CANCEL'| DirectionType){
        console.log(input)
        if(this._quequeMessagesAnimationPlaying && input === 'OK') return
        if(this._waitingForPlayerInput && (input === 'CANCEL' || input === 'OK')){
            this._updateInfoPanelWithMessage()
            return
        }
        if(input === 'CANCEL'){
            this._switchToMainBattelMenu()
            return
        }
        
        if(input === 'OK'){
            if(this._activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MAIN){
                this._handlePlayerChooseMainBattelOption()
                return
            }
            if(this._activeBattleMenu === ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT){
                this._handlePlayerChooseAttack()
                return
            }
            
            return
        }
        //控制主菜单
        this._updateSelectedBattelMenuOptionFormInput(input)
        this._moveMainBattleMenuCursor()
        //控制招式菜单
        this._updateSelectedMoveMenuOptionFormInput(input)
        this._moveMoveBattleMenuCursor()
    }
    /**
     * 
     * @param message 
     * @param callback 
     * 
     */
    updateInfoPaneMessageNoInputRequired(message:string,callback?:()=>void){
        //因为要设置文字动画，所以先设置为空。
        this._battleTextGameObjectLine1.setText('').setAlpha(1)
        if(this._skipAnimations){
            this._battleTextGameObjectLine1.setText(message)
            this._waitingForPlayerInput = false
            if(callback){
                callback()
            }
            return
        }

        //TODO animate message
        animateText(this._scene,this._battleTextGameObjectLine1,message,{
            delay:dataManager.getAnimatedTextSpeed(),
            callback:()=>{
            this._waitingForPlayerInput = false
            if(callback){
                callback()
            }
        }})
    }

    /**
     * 消息队列，玩家输入ok 或 cancel 消息会按队列一条条显示，消息队列为空时，再输入ok 或 cancel，调用回调方法。
     * @param message 
     * @param callback 
     * @param skipAnimation 是否跳过文字动画
     */
    updateInfoPaneMessageAndWaitForInput(message:string[],callback?:(()=>void)|undefined){
        this._queuedInfoPanelMessage = message
        this._queuedInfoPanelCallback = callback
        
        this._updateInfoPanelWithMessage()
    }
    _updateInfoPanelWithMessage(){
        this._quequeMessagesAnimationPlaying = false
        this._waitingForPlayerInput = false
        this._battleTextGameObjectLine1.setText('').setAlpha(1)
        this.hideInputCursorAnimate()


        //检查消息队列中的信息是否已经全部显示 并且 调用回调函数
        if(this._queuedInfoPanelMessage.length === 0){
            //再判断是否有回调函数
            if(this._queuedInfoPanelCallback){
                //调用后 设置 为 undefined
                this._queuedInfoPanelCallback()
                this._queuedInfoPanelCallback = undefined
            }
            return
        }

        //消息队列中还有没显示的信息，获取第一条显示，并且在消息队列中删除,等待玩家输入
        const messageToDisplay = this._queuedInfoPanelMessage.shift() || ''
        console.log(messageToDisplay)
        if(this._skipAnimations){
            this._battleTextGameObjectLine1.setText(messageToDisplay)
            this._waitingForPlayerInput = true
            this._quequeMessagesAnimationPlaying = false
            this.playInputCursorAnimate()
            return
        }
        this._quequeMessagesAnimationPlaying = true
        animateText(this._scene,this._battleTextGameObjectLine1,messageToDisplay,{
            delay:dataManager.getAnimatedTextSpeed(),
            callback:()=>{
                this.playInputCursorAnimate()
                this._waitingForPlayerInput = true
                this._quequeMessagesAnimationPlaying = false
            }
        })
        

    }
    _init(){
        console.log('init BattleMenu')
        
        this._battleTextGameObjectLine1 = this._scene.add.text(30,26,'what should',{
            ...BATTLE_UI_TEXT_STYLE,
            wordWrap:{
                width:this._scene.scale.width - 55
            }
        })
        this._battleTextGameObjectLine2 = this._scene.add.text(30,64,`${this._activePlayerMonster.name} do next?`,BATTLE_UI_TEXT_STYLE)
        this._scene.add.container(0,this._scene.scale.height-132,[
            this._createMainInfoPane(),
            this._createMainBattleMenu(),
            this._createMonsterAttackSubMenu(),
            this._createPlayerInputCursor(),
            this._battleTextGameObjectLine1,
            this._battleTextGameObjectLine2
        ])
    }

    _createMainBattleMenu(){
        this._mainBattleMenuCursorPhaserImageGameObject = this._scene.add.image(42,38,UI_ASSET_KEYS.CURSOR).setOrigin(0.5).setScale(2.5)
        this._mainBattleMenuPhaserContainerGameObject = this._scene.add.container(520,4,[
            this._createMainSubInfoPane(),
            this._scene.add.text(55,22,BATTLE_MENU_OPTION.FIGHT,BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(240,22,BATTLE_MENU_OPTION.SWITCH,BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(55,70,BATTLE_MENU_OPTION.ITEM,BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(240,70,BATTLE_MENU_OPTION.FLEE,BATTLE_UI_TEXT_STYLE),
            this._mainBattleMenuCursorPhaserImageGameObject
        ])
        this.hideMainBattleMenu()
        return this._mainBattleMenuPhaserContainerGameObject
    }

    _createMonsterAttackSubMenu(){
        const attackNames = []
        for(var i = 0; i<4; i++){
            attackNames.push(this._activePlayerMonster.attacks[i]?.name || '-')
        }
        this._attackBattleMenuCursorPhaserImageGameObject = this._scene.add.image(ATTACK_MENU_CURSOR_POS.x,ATTACK_MENU_CURSOR_POS.y,UI_ASSET_KEYS.CURSOR).setOrigin(0.5).setScale(2.5)
        this._moveSelectionSubBattleMenuPhaserContainerGameObject = this._scene.add.container(0,4,[
            this._scene.add.text(55,22,attackNames[0],BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(240,22,attackNames[1],BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(55,70,attackNames[2],BATTLE_UI_TEXT_STYLE),
            this._scene.add.text(240,70,attackNames[3],BATTLE_UI_TEXT_STYLE),
            this._attackBattleMenuCursorPhaserImageGameObject
        ])
        this.hideMonsterAttackSubMenu()
        return this._moveSelectionSubBattleMenuPhaserContainerGameObject
    }

    _createMainInfoPane(){
        const padding = 4
        const reactHeight = 124
        //rectangle设置矩形  setStrokeStyle描绘边框
        return this._scene.add.rectangle(padding,padding,this._scene.scale.width - padding * 2,reactHeight,0xede4f3,1).setOrigin(0,0)
        .setStrokeStyle(8,0xe4434a,1)
    }

    _createMainSubInfoPane(){
        const reactWidth = 500
        const reactHeight = 124
        return this._scene.add.rectangle(0,0,reactWidth,reactHeight,0xede4f3,1).setOrigin(0).setStrokeStyle(8,0x905ac2,1)
    }

    /**
     * 
     * @param direction 
     */
     _updateSelectedBattelMenuOptionFormInput(direction:DirectionType){
        if(this._activeBattleMenu != ACTIVE_BATTLE_MENU.BATTLE_MAIN) return
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.FIGHT){
            switch(direction){
                case DIRECTION.RIGHT:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.SWITCH
                    break;
                case DIRECTION.DOWN:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.ITEM
                    break;
                case DIRECTION.LEFT:
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.SWITCH){
            switch(direction){
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.DOWN:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FLEE
                    break;
                case DIRECTION.LEFT:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FIGHT
                    break;
                case DIRECTION.UP:
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.ITEM){
            switch(direction){
                case DIRECTION.RIGHT:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FLEE
                    break;
                case DIRECTION.DOWN:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.UP:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.FIGHT
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.FLEE){
            switch(direction){
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.DOWN:
                    break;
                case DIRECTION.LEFT:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.ITEM
                    break;
                case DIRECTION.UP:
                    this._selectedBattleMenuOption = BATTLE_MENU_OPTION.SWITCH
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }

    }
    _moveMainBattleMenuCursor () {
        if(this._activeBattleMenu != ACTIVE_BATTLE_MENU.BATTLE_MAIN) return
        switch(this._selectedBattleMenuOption){
            case BATTLE_MENU_OPTION.FIGHT:
                this._mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x,BATTLE_MENU_CURSOR_POS.y)
                break;
            case BATTLE_MENU_OPTION.FLEE:
                this._mainBattleMenuCursorPhaserImageGameObject.setPosition(228,86)
                break;
            case BATTLE_MENU_OPTION.ITEM:
                this._mainBattleMenuCursorPhaserImageGameObject.setPosition(BATTLE_MENU_CURSOR_POS.x,86)
                break;
            case BATTLE_MENU_OPTION.SWITCH:
                this._mainBattleMenuCursorPhaserImageGameObject.setPosition(228,BATTLE_MENU_CURSOR_POS.y)
                break;
            default:
                break;
        }
    }
    _updateSelectedMoveMenuOptionFormInput(direction:DirectionType){
        if(this._activeBattleMenu != ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) return
        if(this._selectedAttackMenuOption === ATTACK_MOVE_OPTION.MOVE_1){
            switch (direction) {
                case DIRECTION.UP:
                    
                    break;
                case DIRECTION.DOWN:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_3
                    break;
                case DIRECTION.LEFT:
                
                    break;
                case DIRECTION.RIGHT:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_2
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedAttackMenuOption === ATTACK_MOVE_OPTION.MOVE_2){
            switch (direction) {
                case DIRECTION.UP:
                    
                    break;
                case DIRECTION.DOWN:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_4
                    break;
                case DIRECTION.LEFT:
                
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_1
                    break;
                case DIRECTION.RIGHT:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedAttackMenuOption === ATTACK_MOVE_OPTION.MOVE_3){
            switch (direction) {
                case DIRECTION.UP:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_1
                    break;
                case DIRECTION.DOWN:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.RIGHT:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_4
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedAttackMenuOption === ATTACK_MOVE_OPTION.MOVE_4){
            switch (direction) {
                case DIRECTION.UP:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_2
                    break;
                case DIRECTION.DOWN:
                    break;
                case DIRECTION.LEFT:
                    this._selectedAttackMenuOption = ATTACK_MOVE_OPTION.MOVE_3
                    break;
                case DIRECTION.RIGHT:
                    break;
                default:
                    break;
            }
            return
        }

    }
    _moveMoveBattleMenuCursor(){
        if(this._activeBattleMenu != ACTIVE_BATTLE_MENU.BATTLE_MOVE_SELECT) return
        switch (this._selectedAttackMenuOption) {
            case ATTACK_MOVE_OPTION.MOVE_1:
                this._attackBattleMenuCursorPhaserImageGameObject.setPosition(ATTACK_MENU_CURSOR_POS.x,ATTACK_MENU_CURSOR_POS.y)
                break;
            case ATTACK_MOVE_OPTION.MOVE_2:
                this._attackBattleMenuCursorPhaserImageGameObject.setPosition(228,ATTACK_MENU_CURSOR_POS.y)
                break;
            case ATTACK_MOVE_OPTION.MOVE_3:
                this._attackBattleMenuCursorPhaserImageGameObject.setPosition(ATTACK_MENU_CURSOR_POS.x,86)
                break;
            case ATTACK_MOVE_OPTION.MOVE_4:
                this._attackBattleMenuCursorPhaserImageGameObject.setPosition(228,86)
                break;
            default:
                break;
        }
    }
    _switchToMainBattelMenu(){
        //
        this._waitingForPlayerInput = false
        this.hideInputCursorAnimate()
        this.hideMonsterAttackSubMenu()
        this.showMainBattleMenu()
    }
    _handlePlayerChooseMainBattelOption(){
        this.hideMainBattleMenu()
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.FIGHT){
            this.showMonsterAttackSubMenu()
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.SWITCH){
            this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_SWITCH
            this._switchMonsterAttempt = true
            // this.updateInfoPaneMessageAndWaitForInput(['You have no other monsters...'],this._switchToMainBattelMenu)
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.ITEM){
            this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_ITEM
            const sceneData:InventorySceneData = {
                previousScene:'BattleScene'
            }
            this._scene.scene.launch('InventoryScene',sceneData)
            this._scene.scene.pause('BattleScene')
            // this.updateInfoPaneMessageAndWaitForInput(['Your bag is empty...'],this._switchToMainBattelMenu)
            return
        }
        if(this._selectedBattleMenuOption === BATTLE_MENU_OPTION.FLEE){
            this._activeBattleMenu = ACTIVE_BATTLE_MENU.BATTLE_FLEE
            this._fleeAttempt = true
            return
        }
    }
    _handlePlayerChooseAttack(){
        let selectedAttackIndex = 0
        switch (this._selectedAttackMenuOption) {
            case ATTACK_MOVE_OPTION.MOVE_1:
                selectedAttackIndex = 0
                break;
            case ATTACK_MOVE_OPTION.MOVE_2:
                selectedAttackIndex = 1
                break;
            case ATTACK_MOVE_OPTION.MOVE_3:
                selectedAttackIndex = 2
                break;
            case ATTACK_MOVE_OPTION.MOVE_4:
                selectedAttackIndex = 3
                break;
        
            default:
                break;
        }
        this._selectedAttackIndex = selectedAttackIndex
    }
    _createPlayerInputCursor(){
        this._userInputCursorPhaserImageObject = this._scene.add.image(0,0,UI_ASSET_KEYS.CURSOR)
        this._userInputCursorPhaserImageObject.setAngle(90).setScale(2.5,1.5)
        this._userInputCursorPhaserImageObject.setAlpha(0)

        this._userInputCursorPhaserTween = this._scene.add.tween({
            delay:0,
            duration:500,
            repeat:-1,
            y:{
                from:PLAYER_INPUT_CURSOR_POS.y,
                start:PLAYER_INPUT_CURSOR_POS.y,
                to:PLAYER_INPUT_CURSOR_POS.y + 6,
            },
            targets:this._userInputCursorPhaserImageObject
        })
        this._userInputCursorPhaserTween.pause()
        return this._userInputCursorPhaserImageObject
    }
    /**
     * 监听回调
     * @param sys 系统数据
     * @param data 我们返回的数据
     */
    _handleSceneResume(sys:Scene,data:BattleSceneWasResumedData){
        console.log(`[${BattleMenu.name}]: has been resumed`,{data})
        if(data && data.wasMonsterSelected){
            
            return
        }
        if(!data || !data.wasItemUsed){
            this._switchToMainBattelMenu()
            return
        }
        this._usedItem = data.item
        this._wasItemUsed = true
        this.updateInfoPaneMessageAndWaitForInput([`You used following item: ${data.item?.name}`])
    }
   
}