import { GameObjects, Scene } from 'phaser';
import { TITLE_ASSET_KEYS, UI_ASSET_KEYS } from '../assets/asset-keys';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';

export const MENU_TEXT_STYLE:Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
    color:'#4D4A49',
    fontSize:'30px',
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
}) 

const PLAYER_INPUT_CURSOR_POSITION = Object.freeze({
    x:150
})

export class TitleScene extends Scene {
    _mainMenuCursorPhaserImageGameObject:GameObjects.Image
    constructor(){
        super('TitleScene')
    }
    create(){
        console.log('Title Scene 创建')
        //create Title Scene background
        this.add.image(0,0,TITLE_ASSET_KEYS.BACKGROUND).setOrigin(0).setScale(0.58)
        this.add.image(this.scale.width/2,150,TITLE_ASSET_KEYS.PANEL).setScale(0.25).setAlpha(0.5)
        this.add.image(this.scale.width/2,150,TITLE_ASSET_KEYS.TITLE).setScale(0.55).setAlpha(0.5)
        //create menu
        const menuWidth = 500
        const menuBg = this.add.image(125,0,UI_ASSET_KEYS.MENU_BACKGROUND).setOrigin(0).setScale(2.4,2)
        const menuBgContainer = this.add.container(0,0,[menuBg])

        const newGameText = this.add.text(menuWidth/2,40,'New Game',MENU_TEXT_STYLE).setOrigin(0.5)
        const continueText = this.add.text(menuWidth/2,90,'Continue',MENU_TEXT_STYLE).setOrigin(0.5)
        const optionsText = this.add.text(menuWidth/2,140,'Options',MENU_TEXT_STYLE).setOrigin(0.5)
        const menuContainer = this.add.container(0,0,[
            menuBgContainer,
            newGameText,
            continueText,
            optionsText
        ])
        menuContainer.setPosition(this.scale.width/2 - menuWidth/2,300)
        //create cursors
        this._mainMenuCursorPhaserImageGameObject = this.add.image(PLAYER_INPUT_CURSOR_POSITION.x,41,UI_ASSET_KEYS.CURSOR).setOrigin(0.5).setScale(2.5)
        menuBgContainer.add(this._mainMenuCursorPhaserImageGameObject)
        //add in fade effect
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

    }
}