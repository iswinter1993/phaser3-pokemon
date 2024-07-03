import { BATTLE_UI_TEXT_STYLE } from './../battle/ui/menu/battle-menu-config';
import { GameObjects, Scene, Tweens } from 'phaser';
import { UI_ASSET_KEYS } from '../assets/asset-keys';
import { CANNOT_READ_SIGN_TEXT } from '../utils/text-utils';
export class DialogUi {

    _scene:Scene
    _width:number
    _padding:number
    _height:number
    _container:GameObjects.Container
    _isVisible:boolean
    /**
     * 文案后提醒用户输入光标
     */
    _userInputCursor:GameObjects.Image;
    /**
     * 文案后提醒用户输入光标的动画
     */
    _userInputCursorTween:Tweens.Tween
    /**
     * 显示文本
     */
    _uiText:GameObjects.Text
    _textAnimationPlaying:boolean
    _messageToShow:string[]
    constructor(scene:Scene,width:number){
        this._scene = scene
        this._padding = 90
        this._width = width - this._padding * 2
        this._height = 124
        this._messageToShow = []
        this._textAnimationPlaying = false

        const panel = this._scene.add.rectangle(0,0,this._width,this._height,0xede4f3,0.9).setOrigin(0).setStrokeStyle(8,0x905ac2,1)
        this._container = this._scene.add.container(0,0,[
            panel
        ])
        

        this._uiText = this._scene.add.text(18,12,CANNOT_READ_SIGN_TEXT,{...BATTLE_UI_TEXT_STYLE,wordWrap:{width:this._width - 18}})
        this._container.add(this._uiText)
        this._container.add(this._createPlayerInputCursor())

        this.hideDialogModal()
    }

    get isVisible () {
        return this._isVisible
    }
    showDialogModal(){
        //获取相机可视区域矩形的 位置 大小等信息 
        const {x,bottom} = this._scene.cameras.main.worldView
        const startX = x + this._padding
        const startY = bottom - this._height - this._padding / 4
        this._container.setPosition(startX,startY)
        this._userInputCursorTween.restart()
        this._container.setAlpha(1)
        this._isVisible = true
    }

    hideDialogModal(){
        this._userInputCursorTween.pause()
        this._container.setAlpha(0)
        this._isVisible = false
    }
    _createPlayerInputCursor(){
        const y = this._height - 24
        this._userInputCursor = this._scene.add.image(this._width - 16,y,UI_ASSET_KEYS.CURSOR)
        this._userInputCursor.setAngle(90).setScale(4.5,2)
        this._userInputCursor.setAlpha(1)

        this._userInputCursorTween = this._scene.add.tween({
            delay:0,
            duration:500,
            repeat:-1,
            y:{
                from:y,
                start:y,
                to:y + 6,
            },
            targets:this._userInputCursor
        })
        this._userInputCursorTween.pause()
        return this._userInputCursor
    }
}