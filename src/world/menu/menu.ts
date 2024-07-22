import { DATA_MANAGER_STORE_KEYS } from './../../utils/data-manager';
import { DIRECTION } from './../../common/direction';
import { Scene, GameObjects } from 'phaser';
import { UI_ASSET_KEYS } from '../../assets/asset-keys';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../../assets/font-keys';
import { DirectionType } from '../../common/direction';
import { dataManager } from '../../utils/data-manager';
import { MENU_COLOR } from './menu-config';
import { MenuColorOptions } from '../../common/option';

export const MENU_TEXT_STYLE:Phaser.Types.GameObjects.Text.TextStyle = Object.freeze({
    color:'#FFFFFF',
    fontSize:'32px',
    fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME
}) 

export type MenuOptions = keyof typeof MENU_OPTIONS

export const MENU_OPTIONS = Object.freeze({
    MONSTERDEX:'MONSTERDEX',
    MONSTERS:'MONSTERS',
    BAG:'BAG',
    SAVE:'SAVE',
    OPTIONS:'OPTIONS',
    EXIT:'EXIT'
})

export class Menu {
    _scene:Scene
    _padding:number
    _width:number
    _height:number
    _graphics:GameObjects.Graphics
    _container:GameObjects.Container
    _isVisible:boolean
    //可用菜单
    _availabelMenuOptions:MenuOptions[]
    _menuOptionsTextGameObjects:GameObjects.Text[]
    _selectedMenuOptionIndex:number
    _selectedMenuOption:MenuOptions
    _userInputCursor:GameObjects.Image
    constructor(scene:Scene){
        this._scene = scene
        this._availabelMenuOptions = [MENU_OPTIONS.MONSTERS,MENU_OPTIONS.SAVE,MENU_OPTIONS.EXIT]
        this._menuOptionsTextGameObjects = []
        this._selectedMenuOptionIndex = 0
        this._padding = 4
        this._width = 300
        // cal height based on current available options
        this._height = 10 + this._padding * 2 + this._availabelMenuOptions.length * 50
        this._graphics = this._createGraphics()
        this._container = this._scene.add.container(0,0,[this._graphics])
        
        //update menu container with menu options
        for(var i=0;i<this._availabelMenuOptions.length;i++){
            const y = 10 + 50 * i + this._padding
            const textObj = this._scene.add.text(40 + this._padding, y, this._availabelMenuOptions[i],MENU_TEXT_STYLE)
            this._menuOptionsTextGameObjects.push(textObj)
        }

        this._container.add(this._menuOptionsTextGameObjects)
        // add player input cursor
        this._userInputCursor = this._scene.add.image(20 + this._padding, 28 + this._padding, UI_ASSET_KEYS.CURSOR_WHITE).setScale(2)

        this._container.add(this._userInputCursor)

        this.hide()
        
    }

    get isVisible(){
        return this._isVisible
    }

    get selectedOption(){
        return this._selectedMenuOption
    }

    show(){
        console.log(this._scene.cameras.main.worldView)
        const { right, top } = this._scene.cameras.main.worldView
        this._container.setPosition(right - this._width - this._padding * 2, top + this._padding * 2)
        this._container.setDepth(3)
        this._container.setAlpha(1)
        this._isVisible = true
    }

    hide(){
        this._container.setAlpha(0)
        this._isVisible = false
        this._selectedMenuOptionIndex = 0
        this._moveMenuCursor(DIRECTION.NONE)
    }

    handlePlayerInput(input:DirectionType|'OK'|'CANCEL'){
        if(input === 'CANCEL'){
            this.hide()
            return
        }
        if(input === 'OK'){
            this._handleSelectedMenuOption()
            return
        }
        //update select menu option based on player input
        this._moveMenuCursor(input)
    }

    _createGraphics(){
        const g = this._scene.add.graphics()
        const menuColor = this._getMenuColorFromDataManager()
        g.fillStyle(menuColor.main,1)
        g.fillRect(1,0,this._width - 1,this._height - 1)
        g.lineStyle(8,menuColor.border,1)
        g.strokeRect(0,0,this._width,this._height)
        g.setAlpha(0.9)
        return g
    }

    _handleSelectedMenuOption(){
        this._selectedMenuOption = this._availabelMenuOptions[this._selectedMenuOptionIndex]
        console.log('OK pressed',this._selectedMenuOption)

    }

    _moveMenuCursor(direction:DirectionType){
        switch (direction) {
            case DIRECTION.NONE:
                break;
            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
                return;
            case DIRECTION.DOWN:
                this._selectedMenuOptionIndex += 1
                if(this._selectedMenuOptionIndex > this._availabelMenuOptions.length - 1){
                    this._selectedMenuOptionIndex = 0
                }
                break;
            case DIRECTION.UP:
                this._selectedMenuOptionIndex -= 1
                if(this._selectedMenuOptionIndex < 0){
                    this._selectedMenuOptionIndex = this._availabelMenuOptions.length - 1
                }
                break;
            default:
                break;
        }

        const y = 28 + this._padding + this._selectedMenuOptionIndex * 50
        console.log(this._availabelMenuOptions[this._selectedMenuOptionIndex])
        this._userInputCursor.setY(y)
    }

    _getMenuColorFromDataManager():{main:number,border:number}{
        const menucolor = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR) as MenuColorOptions
        if(menucolor ===undefined){
            return MENU_COLOR[0]
        }
        return MENU_COLOR[menucolor]
    }
}