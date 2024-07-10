import { Scene, GameObjects, Cameras } from 'phaser';
import { UI_ASSET_KEYS } from '../assets/asset-keys';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { DIRECTION, DirectionType } from '../common/direction';
import { OptionMenuOptions, OPTION_MENU_OPTIONS } from '../common/option';
import { Controls } from '../utils/controls';

const OPTION_TEXT_STYLE:Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
    color:'#FFF',
    fontSize:'30px',
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
}) 

const OPTION_MENU_OPTION_INFO_MSG = Object.freeze({
    TEXT_SPEED:'Choose one of three text display speeds.',
    BATTLE_SCENE:'Choose to display battle animations and effects or not.',
    BATTLE_STYLE:'Choose to allow your monster to be recalled between rounds.',
    SOUND:'Choose to enable or disable the sound.',
    VOLUME:'Choose the volume for the music and sound effects of the game.',
    MENU_COLOR:'Choose one of the three menu color options.',
    CONFIRM:'Save your changes and go back to the main menu.'
})


export class OptionScene extends Scene {

    _mainContainer:GameObjects.Container
    _nineSliceMainContainer:GameObjects.NineSlice
    _textSpeadOptionTextGameObjects:GameObjects.Group
    _battleSceneOptionTextGameObjects:GameObjects.Group
    _battleStyleOptionTextGameObjects:GameObjects.Group
    _soundOptionTextGameObjects:GameObjects.Group
    _volumeOptionsMenuCursor:GameObjects.Rectangle
    _volumeOptionsValueText:GameObjects.Text
    _selectedMenuColorTextGameObjects:GameObjects.Text
    _infoContainer:GameObjects.NineSlice
    _selectedOptionInfoMsgTextGameObjects:GameObjects.Text
    _optionsMenuCursor:GameObjects.Rectangle
    _controls:Controls
    _selectedOptionMenu:OptionMenuOptions


    constructor(){
        super('OptionScene')
    }

    init(){
        this._selectedOptionMenu = OPTION_MENU_OPTIONS.TEXT_SPEED
    }

    create(){
        console.log('create OptionScene')
        //create main options container
        const {width,height} = this.scale
        const optionWidth = width - 200
        this._nineSliceMainContainer = this.add.nineslice(0,0,UI_ASSET_KEYS.MENU_BACKGROUND,0,optionWidth,432,32,32,32,32).setOrigin(0)
        this._mainContainer = this.add.container(0,0,[
            this._nineSliceMainContainer
        ])
        this._mainContainer.setX(100).setY(20)
        this.add.text(width/2,40,'Options',OPTION_TEXT_STYLE).setOrigin(0.5)

        //create main options sections
        const menuOption = [
            'Text Speed',
            'Battle Scene',
            'Battle Style',
            'Sound',
            'Volume',
            'Menu Color',
            'Close'
        ]
        const menuOptionPosition = {
            x:25,
            yStart:55,
        }
        menuOption.forEach((option,index)=>{
            const textGameObject = this.add.text(menuOptionPosition.x, menuOptionPosition.yStart + 55 * index, option,OPTION_TEXT_STYLE)
            this._mainContainer.add(textGameObject)
        })

        //create text speed options
        this._textSpeadOptionTextGameObjects = this.add.group([
            this.add.text(420,75,'Slow',OPTION_TEXT_STYLE),
            this.add.text(590,75,'Mid',OPTION_TEXT_STYLE),
            this.add.text(760,75,'Fast',OPTION_TEXT_STYLE)
        ])

        //create battle scene options
        this._battleSceneOptionTextGameObjects = this.add.group([
            this.add.text(420,130,'On',OPTION_TEXT_STYLE),
            this.add.text(590,130,'Off',OPTION_TEXT_STYLE),
        ])

        //create battle style options
        this._battleStyleOptionTextGameObjects = this.add.group([
            this.add.text(420,185,'Set',OPTION_TEXT_STYLE),
            this.add.text(590,185,'Shift',OPTION_TEXT_STYLE),
        ])

        //create sound options
        this._soundOptionTextGameObjects = this.add.group([
            this.add.text(420,240,'On',OPTION_TEXT_STYLE),
            this.add.text(590,240,'Off',OPTION_TEXT_STYLE),
        ])

        //create volume options
        this.add.rectangle(420,312,300,4,0xffffff,1).setOrigin(0,0.5)
        this._volumeOptionsMenuCursor = this.add.rectangle(710,312,10,25,0xff2222,1).setOrigin(0,0.5)
        this._volumeOptionsValueText = this.add.text(760,295,'100%',OPTION_TEXT_STYLE)
        //create menu color options
        this._selectedMenuColorTextGameObjects = this.add.text(590,350,'1',OPTION_TEXT_STYLE)
        this.add.image(530,352,UI_ASSET_KEYS.CURSOR_WHITE).setOrigin(1,0).setScale(2.5).setFlipX(true)
        this.add.image(660,352,UI_ASSET_KEYS.CURSOR_WHITE).setOrigin(0,0).setScale(2.5)

        //option details container
        this._infoContainer = this.add.nineslice(0,442,UI_ASSET_KEYS.MENU_BACKGROUND,0,optionWidth,100,32,32,32,32).setOrigin(0)
        this._mainContainer.add(this._infoContainer)
        this._selectedOptionInfoMsgTextGameObjects = this.add.text(125,480,OPTION_MENU_OPTION_INFO_MSG.TEXT_SPEED,{...OPTION_TEXT_STYLE,wordWrap:{width:width - 250}})

        this._optionsMenuCursor = this.add.rectangle(110,70,optionWidth - 20,40,0xffffff,0).setStrokeStyle(4,0xe4434a,1).setOrigin(0)

        this._controls = new Controls(this)
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            this.scene.start('TitleScene')
        })
    }

    update(time: number, delta: number): void {
        if(this._controls.isInputLocked){
            return
        }

        if(this._controls.wasBackKeyPressed()){
            this._controls.lockInput = true
            this.cameras.main.fadeOut(500,0,0,0)
            return
        }

        const selectedDirection = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._moveOptionMenuCursor(selectedDirection)
        }


        if(this._controls.wasSpaceKeyPressed() && this._selectedOptionMenu === OPTION_MENU_OPTIONS.CONFIRM){
            this._controls.lockInput = true
            this.cameras.main.fadeOut(500,0,0,0)
            return
        }
    }

    _moveOptionMenuCursor(direction:DirectionType){
        this._updateSelectOptionMenuOptionFromInput(direction)
        switch (this._selectedOptionMenu) {
            case OPTION_MENU_OPTIONS.TEXT_SPEED:
                this._optionsMenuCursor.setY(70)
                break;
            case OPTION_MENU_OPTIONS.BATTLE_SCENE:
                this._optionsMenuCursor.setY(125)
                break;
            case OPTION_MENU_OPTIONS.BATTLE_STYLE:
                this._optionsMenuCursor.setY(180)
                break;
            case OPTION_MENU_OPTIONS.SOUND:
                this._optionsMenuCursor.setY(235)
                break;
            case OPTION_MENU_OPTIONS.VOLUME:
                this._optionsMenuCursor.setY(290)
                break;
            case OPTION_MENU_OPTIONS.MENU_COLOR:
                this._optionsMenuCursor.setY(345)
                break;
            case OPTION_MENU_OPTIONS.CONFIRM:
                this._optionsMenuCursor.setY(400)
                break;
            default:
                break;
        }

        this._selectedOptionInfoMsgTextGameObjects.setText(OPTION_MENU_OPTION_INFO_MSG[this._selectedOptionMenu])

    }
    _updateSelectOptionMenuOptionFromInput(direction:DirectionType){
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.TEXT_SPEED){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.BATTLE_SCENE
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.CONFIRM
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.BATTLE_SCENE){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.BATTLE_STYLE
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.TEXT_SPEED
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.BATTLE_STYLE){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.SOUND
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.BATTLE_SCENE
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.SOUND){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.VOLUME
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.BATTLE_STYLE
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.VOLUME){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.MENU_COLOR
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.SOUND
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.MENU_COLOR){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.CONFIRM
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.VOLUME
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }
        if(this._selectedOptionMenu === OPTION_MENU_OPTIONS.CONFIRM){
            switch (direction) {
                case DIRECTION.DOWN:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.TEXT_SPEED
                    break;
                case DIRECTION.UP:
                    this._selectedOptionMenu = OPTION_MENU_OPTIONS.MENU_COLOR
                    break;
                case DIRECTION.RIGHT:
                    break;
                case DIRECTION.LEFT:
                    break;
                case DIRECTION.NONE:
                    break;
                default:
                    break;
            }
            return
        }

    }
}