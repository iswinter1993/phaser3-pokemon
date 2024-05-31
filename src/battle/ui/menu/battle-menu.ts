import { GameObjects } from "phaser";

const BATTLE_MENU_OPTION = Object.freeze({
    FIGHT:'FIGHT', //战斗
    SWITCH:'SWITCH',//切换
    ITEM:'ITEM',//背包
    FLEE:'FLEE'//逃跑
})

const battleUiTextStyle = {
    color:'black',
    fontSize:'30px'
}


export class BattleMenu {
    _scene;
    _mainBattleMenuPhaserContainerGameObject: GameObjects.Container;
    _moveSelectionSubBattleMenuPhaserContainerGameObject: GameObjects.Container;
    _battleTextGameObjectLine1:GameObjects.Text;
    _battleTextGameObjectLine2:GameObjects.Text;
    constructor(scene: any){
        this._scene = scene
        this._init()
    }

    showMainBattleMenu(){
        this._mainBattleMenuPhaserContainerGameObject.setAlpha(1)
    }
    hideMainBattleMenu(){
        this._mainBattleMenuPhaserContainerGameObject.setAlpha(0)
    }

    _init(){
        console.log('init BattleMenu')
        this._scene.add.container(0,this._scene.scale.height-132,[
            this._createMainInfoPane(),
            this._createMainBattleMenu(),
            this._createMonsterAttackSubMenu()
        ])
    }

    _createMainBattleMenu(){
        this._mainBattleMenuPhaserContainerGameObject = this._scene.add.container(520,4,[
            this._createMainSubInfoPane(),
            this._scene.add.text(55,22,BATTLE_MENU_OPTION.FIGHT,battleUiTextStyle),
            this._scene.add.text(240,22,BATTLE_MENU_OPTION.SWITCH,battleUiTextStyle),
            this._scene.add.text(55,70,BATTLE_MENU_OPTION.ITEM,battleUiTextStyle),
            this._scene.add.text(240,70,BATTLE_MENU_OPTION.FLEE,battleUiTextStyle),
        ])
        return this._mainBattleMenuPhaserContainerGameObject
    }

    _createMonsterAttackSubMenu(){
        this._moveSelectionSubBattleMenuPhaserContainerGameObject = this._scene.add.container(0,4,[
            this._scene.add.text(55,22,'slash',battleUiTextStyle),
            this._scene.add.text(240,22,'growl',battleUiTextStyle),
            this._scene.add.text(55,70,'-',battleUiTextStyle),
            this._scene.add.text(240,70,'-',battleUiTextStyle),
        ])
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
}