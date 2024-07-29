import { BaseScene } from './BaseScene';
import { dataManager, DATA_MANAGER_STORE_KEYS } from './../utils/data-manager';
import { Cameras, GameObjects, Scene, Textures } from 'phaser';
import { TITLE_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { DIRECTION, DirectionType } from '../common/direction';
import { Controls } from '../utils/controls';

export const MENU_TEXT_STYLE:Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
    color:'#4D4A49',
    fontSize:'30px',
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
}) 

const PLAYER_INPUT_CURSOR_POSITION = Object.freeze({
    x:150,
    y:41
})

type MainMenuOptions = keyof typeof MAIN_MENU_OPTIONS

const MAIN_MENU_OPTIONS = Object.freeze({
    NEW_GAME:'NEW_GAME',
    CONTINUE:'CONTINUE',
    OPTIONS:'OPTIONS'
})

export class TitleScene extends BaseScene {
    _mainMenuCursorPhaserImageGameObject:GameObjects.Image
    // _controls:Controls   BaseScene中已经创建
    _selectMenuOption:MainMenuOptions
    //是否有存档
    _isContinueButtonEnable:boolean
    constructor(){
        super('TitleScene')
    }
    create(){
        super.create()
        this._selectMenuOption = MAIN_MENU_OPTIONS.NEW_GAME
        this._isContinueButtonEnable = dataManager.store.get(DATA_MANAGER_STORE_KEYS.GAME_STARTED) || false
        //create Title Scene background
        this.add.image(0,0,TITLE_ASSET_KEYS.BACKGROUND).setOrigin(0).setScale(0.58)
        this.add.image(this.scale.width/2,150,TITLE_ASSET_KEYS.PANEL).setScale(0.25).setAlpha(0.5)
        this.add.image(this.scale.width/2,150,TITLE_ASSET_KEYS.TITLE).setScale(0.55).setAlpha(0.5)
        //create menu
        const menuWidth = 500      

        //使用图片9分法切割缩放纹理图片,phaser3自带nineslice的只在webgl中有效，utils文件中有自定义实现webgl和canvas都能有效
        const menuBg = this.add.nineslice(125,0,UI_ASSET_KEYS.MENU_BACKGROUND,0,menuWidth/2,200,10,10,10,10).setOrigin(0)
        
        const menuBgContainer = this.add.container(0,0,[menuBg])

        const newGameText = this.add.text(menuWidth/2,40,'New Game',MENU_TEXT_STYLE).setOrigin(0.5)
        const continueText = this.add.text(menuWidth/2,90,'Continue',MENU_TEXT_STYLE).setOrigin(0.5)
        if(!this._isContinueButtonEnable){
            continueText.setAlpha(0.5)
        }
        const optionsText = this.add.text(menuWidth/2,140,'Options',MENU_TEXT_STYLE).setOrigin(0.5)
        const menuContainer = this.add.container(0,0,[
            menuBgContainer,
            newGameText,
            continueText,
            optionsText
        ])
        menuContainer.setPosition(this.scale.width/2 - menuWidth/2,300)
        //create cursors
        this._mainMenuCursorPhaserImageGameObject = this.add.image(PLAYER_INPUT_CURSOR_POSITION.x,PLAYER_INPUT_CURSOR_POSITION.y,UI_ASSET_KEYS.CURSOR).setOrigin(0.5).setScale(2.5)
        menuBgContainer.add(this._mainMenuCursorPhaserImageGameObject)
        this.tweens.add({
            targets:this._mainMenuCursorPhaserImageGameObject,
            x:{
                from:PLAYER_INPUT_CURSOR_POSITION.x,
                start:PLAYER_INPUT_CURSOR_POSITION.x,
                to:PLAYER_INPUT_CURSOR_POSITION.x+3
            },
            repeat:-1,
            delay:0,
            duration:500
        })
        //add in fade effect
        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            switch (this._selectMenuOption) {
                case MAIN_MENU_OPTIONS.NEW_GAME:
                case MAIN_MENU_OPTIONS.CONTINUE:
                    if(this._selectMenuOption === MAIN_MENU_OPTIONS.NEW_GAME){
                        dataManager.startNewGame(this)
                    }
                    this.scene.start('WorldScene')
                    break;
                case MAIN_MENU_OPTIONS.OPTIONS:
                    this.scene.start('OptionScene')
                    break;
                default:
                    break;
            }
            this._controls.lockInput = false
        })


    }
    update(time: number, delta: number): void {
        if(this._controls.isInputLocked){
            return
        }
        const wasSpaceKeyPressed = this._controls.wasSpaceKeyPressed()
        if(wasSpaceKeyPressed){
            this.cameras.main.fadeOut(500,0,0,0)
            this._controls.lockInput = true
            return
        }
        const selectedDirection = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._moveMenuSelectCursor(selectedDirection)
        }
    }
    /**
     * 
     * @param direction 
     */
    _moveMenuSelectCursor(direction:DirectionType){
        this._updateSelectMenuOptionFromInput(direction)
        switch (this._selectMenuOption) {
            case MAIN_MENU_OPTIONS.NEW_GAME:
                this._mainMenuCursorPhaserImageGameObject.setY(PLAYER_INPUT_CURSOR_POSITION.y)
                break;
            case MAIN_MENU_OPTIONS.CONTINUE:
                this._mainMenuCursorPhaserImageGameObject.setY(91)
                break;
            case MAIN_MENU_OPTIONS.OPTIONS:
                this._mainMenuCursorPhaserImageGameObject.setY(141)
                break;
        
            default:
                break;
        }
    }
    /**
     * 
     * @param direction 
     * @returns 
     */
    _updateSelectMenuOptionFromInput(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.OPTIONS){
                    return
                }
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.CONTINUE){
                    this._selectMenuOption = MAIN_MENU_OPTIONS.OPTIONS
                    return
                }
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.NEW_GAME && this._isContinueButtonEnable){
                    this._selectMenuOption = MAIN_MENU_OPTIONS.CONTINUE
                    return
                }

                this._selectMenuOption = MAIN_MENU_OPTIONS.OPTIONS
                
                break;
            case DIRECTION.UP:
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.OPTIONS && this._isContinueButtonEnable){
                    this._selectMenuOption = MAIN_MENU_OPTIONS.CONTINUE
                    return
                }
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.CONTINUE){
                    this._selectMenuOption = MAIN_MENU_OPTIONS.NEW_GAME
                    return
                }
                if(this._selectMenuOption === MAIN_MENU_OPTIONS.NEW_GAME){
                    return
                }
                this._selectMenuOption = MAIN_MENU_OPTIONS.NEW_GAME
                break;
            case DIRECTION.LEFT:
        
                break;
            case DIRECTION.RIGHT:
    
                break;
            case DIRECTION.NONE:

                break;
            default:
                break;
        }
    }
}