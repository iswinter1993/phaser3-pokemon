import { setGlobalSoundSetting } from './../utils/audio-utils';
import { BaseScene } from './BaseScene';
import { BattleStyleOptions, BATTLE_SCENE_OPTIONS, BATTLE_STYLE_OPTIONS, MenuColorOptions, SoundOptions, SOUND_OPTIONS, TEXT_SPEED_OPTIONS, VolumeOptions } from './../common/option';
import { Scene, GameObjects, Cameras } from 'phaser';
import { UI_ASSET_KEYS } from '../assets/asset-keys';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from '../assets/font-keys';
import { DIRECTION, DirectionType } from '../common/direction';
import { BattleSceneOptions, OptionMenuOptions, OPTION_MENU_OPTIONS, TextSpeedOptions } from '../common/option';
import { Controls } from '../utils/controls';
import { DATA_MANAGER_STORE_KEYS, dataManager } from '../utils/data-manager';

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


const TEXT_FONT_COLOR = Object.freeze({
    NOT_SELECTED:'#FFFFFF',
    SELECTED:'#FF2222'
})

export class OptionScene extends BaseScene {

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
    _selectedOptionMenu:OptionMenuOptions
    _selectedTextSpeedOption:TextSpeedOptions
    _selectedBattleSceneOption:BattleSceneOptions
    _selectedBattleStyleOption:BattleStyleOptions
    _selectedSoundOption:SoundOptions
    _selectedVolumeOption:VolumeOptions
    _selectedMenuColorOption:MenuColorOptions

    constructor(){
        super('OptionScene')
    }

    init(){
        super.init()
        this._selectedOptionMenu = OPTION_MENU_OPTIONS.TEXT_SPEED
        this._selectedTextSpeedOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED)
        this._selectedBattleSceneOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE)
        this._selectedBattleStyleOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE)
        this._selectedSoundOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND)
        this._selectedVolumeOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME)
        this._selectedMenuColorOption = dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR)
    }

    create(){
        super.create()
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

        this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE,()=>{
            this.scene.start('TitleScene')
        })
        this._updateTextSpeadOptionTextGameObjects()
        this._updateBattleSceneOptionTextGameObjects()
        this._updateBattleStyleOptionTextGameObjects()
        this._updateSoundOptionTextGameObjects()
        this._updateVolumeOptionSlider()
        this._updateMenuColorTextGameObjects()
        
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
            this._updateOptionDataInDataManager()
            setGlobalSoundSetting(this)
            this.cameras.main.fadeOut(500,0,0,0)
            return
        }
    }

    _updateOptionDataInDataManager(){
        dataManager.store.set({
            [DATA_MANAGER_STORE_KEYS.OPTIONS_TEXT_SPEED]:this._selectedTextSpeedOption,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_SCENE]:this._selectedBattleSceneOption,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_BATTLE_STYLE]:this._selectedBattleStyleOption,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND]:this._selectedSoundOption,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME]:this._selectedVolumeOption,
            [DATA_MANAGER_STORE_KEYS.OPTIONS_MENU_COLOR]:this._selectedMenuColorOption
        })
        dataManager.saveData()
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
                    this._updateTextSpeedOption(direction)
                    this._updateTextSpeadOptionTextGameObjects()
                    break;
                case DIRECTION.LEFT:
                    this._updateTextSpeedOption(direction)
                    this._updateTextSpeadOptionTextGameObjects()
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
                    this._updateBattleSceneOption(direction)
                    this._updateBattleSceneOptionTextGameObjects()
                    break;
                case DIRECTION.LEFT:
                    this._updateBattleSceneOption(direction)
                    this._updateBattleSceneOptionTextGameObjects()
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
                    this._updataBattleStyleOption(direction)
                    this._updateBattleStyleOptionTextGameObjects()
                    break;
                case DIRECTION.LEFT:
                    this._updataBattleStyleOption(direction)
                    this._updateBattleStyleOptionTextGameObjects()
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
                    this._updateSoundOption(direction)
                    this._updateSoundOptionTextGameObjects()
                    break;
                case DIRECTION.LEFT:
                    this._updateSoundOption(direction)
                    this._updateSoundOptionTextGameObjects()
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
                    this._updateVolumeOption(direction)
                    this._updateVolumeOptionSlider()
                    break;
                case DIRECTION.LEFT:
                    this._updateVolumeOption(direction)
                    this._updateVolumeOptionSlider()
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
                    this._updateMenuColorOption(direction)
                    this._updateMenuColorTextGameObjects()
                    break;
                case DIRECTION.LEFT:
                    this._updateMenuColorOption(direction)
                    this._updateMenuColorTextGameObjects()
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

    _updateTextSpeedOption(direction:DirectionType){
        
        switch (direction) {
            case DIRECTION.DOWN:
                
                break;
            case DIRECTION.UP:
            
                break;
            case DIRECTION.LEFT:
                if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.SLOW){
                    this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.FAST
                    return
                }
                if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.FAST){
                    this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.MID
                    return
                }
                this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.SLOW
                break;
            case DIRECTION.RIGHT:
                if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.FAST){
                    this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.SLOW
                    return
                }
                if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.SLOW){
                    this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.MID
                    return
                }
                this._selectedTextSpeedOption = TEXT_SPEED_OPTIONS.FAST
                break;
            case DIRECTION.NONE:
                break;
            default:
                break;
        }
       

    }

    _updateTextSpeadOptionTextGameObjects(){
        const textSpeadOptionTextGameObjects = this._textSpeadOptionTextGameObjects.getChildren() as GameObjects.Text[]
        textSpeadOptionTextGameObjects.forEach((obj)=>{
            obj.setColor(TEXT_FONT_COLOR.NOT_SELECTED)
        })
        if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.SLOW){
            textSpeadOptionTextGameObjects[0].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
        if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.MID){
            textSpeadOptionTextGameObjects[1].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
        if(this._selectedTextSpeedOption === TEXT_SPEED_OPTIONS.FAST){
            textSpeadOptionTextGameObjects[2].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
    }

    _updateBattleSceneOption(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.NONE:
                break;
            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
                if(this._selectedBattleSceneOption === BATTLE_SCENE_OPTIONS.ON){
                    this._selectedBattleSceneOption = BATTLE_SCENE_OPTIONS.OFF
                    return
                }
                if(this._selectedBattleSceneOption === BATTLE_SCENE_OPTIONS.OFF){
                    this._selectedBattleSceneOption = BATTLE_SCENE_OPTIONS.ON
                    return
                }
                break;
            default:
                break;
        }

    }

    _updateBattleSceneOptionTextGameObjects(){
        const battleSceneOptionTextGameObjects = this._battleSceneOptionTextGameObjects.getChildren() as GameObjects.Text[]
        battleSceneOptionTextGameObjects.forEach(obj=>{
            obj.setColor(TEXT_FONT_COLOR.NOT_SELECTED)
        })
        if(this._selectedBattleSceneOption === BATTLE_SCENE_OPTIONS.ON){
            battleSceneOptionTextGameObjects[0].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
        if(this._selectedBattleSceneOption === BATTLE_SCENE_OPTIONS.OFF){
            battleSceneOptionTextGameObjects[1].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }

    }

    _updataBattleStyleOption(direction:DirectionType){
        switch (direction) {
            case DIRECTION.UP:
            case DIRECTION.DOWN:
            case DIRECTION.NONE:
                break;

            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
                if(this._selectedBattleStyleOption === BATTLE_STYLE_OPTIONS.SET){
                    this._selectedBattleStyleOption = BATTLE_STYLE_OPTIONS.SHIFT
                    return
                }
                if(this._selectedBattleStyleOption === BATTLE_STYLE_OPTIONS.SHIFT){
                    this._selectedBattleStyleOption = BATTLE_STYLE_OPTIONS.SET
                    return
                }
                break;
            default:
                break;
        }
    }

    _updateBattleStyleOptionTextGameObjects(){
        const battleStyleOptionTextGameObjects = this._battleStyleOptionTextGameObjects.getChildren() as GameObjects.Text[]
        battleStyleOptionTextGameObjects.forEach(obj=>{
            obj.setColor(TEXT_FONT_COLOR.NOT_SELECTED)
        })
        if(this._selectedBattleStyleOption === BATTLE_STYLE_OPTIONS.SET){
            battleStyleOptionTextGameObjects[0].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
        if(this._selectedBattleStyleOption === BATTLE_STYLE_OPTIONS.SHIFT){
            battleStyleOptionTextGameObjects[1].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }

    }

    _updateSoundOption(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.NONE:
                break;
            case DIRECTION.LEFT:
            case DIRECTION.RIGHT:
                if(this._selectedSoundOption === SOUND_OPTIONS.ON){
                    this._selectedSoundOption = SOUND_OPTIONS.OFF
                    return
                }
                if(this._selectedSoundOption === SOUND_OPTIONS.OFF){
                    this._selectedSoundOption = SOUND_OPTIONS.ON
                    return
                }
                break;
            default:
                break;
        }

    }

    _updateSoundOptionTextGameObjects(){
        const soundOptionTextGameObjects = this._soundOptionTextGameObjects.getChildren() as GameObjects.Text[]
        soundOptionTextGameObjects.forEach(obj=>{
            obj.setColor(TEXT_FONT_COLOR.NOT_SELECTED)
        })
        if(this._selectedSoundOption === SOUND_OPTIONS.ON){
            soundOptionTextGameObjects[0].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }
        if(this._selectedSoundOption === SOUND_OPTIONS.OFF){
            soundOptionTextGameObjects[1].setColor(TEXT_FONT_COLOR.SELECTED)
            return
        }

    }

    _updateVolumeOption(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.NONE:
                break;

            case DIRECTION.LEFT:
                if(this._selectedVolumeOption === 0){
                    return
                }
                this._selectedVolumeOption = (this._selectedVolumeOption - 1) as VolumeOptions

                break;
            case DIRECTION.RIGHT:
                if(this._selectedVolumeOption === 4){
                    return
                }
                this._selectedVolumeOption = (this._selectedVolumeOption + 1) as VolumeOptions
                
                break;
            default:
                break;
        }
    }

    _updateVolumeOptionSlider(){
        switch (this._selectedVolumeOption) {
            case 0:
                this._volumeOptionsMenuCursor.setX(420)
                this._volumeOptionsValueText.setText('0%')
                break;
            case 1:
                this._volumeOptionsMenuCursor.setX(492.5)
                this._volumeOptionsValueText.setText('25%')
                break;
            case 2:
                this._volumeOptionsMenuCursor.setX(565)
                this._volumeOptionsValueText.setText('50%')
                break;
            case 3:
                this._volumeOptionsMenuCursor.setX(637.5)
                this._volumeOptionsValueText.setText('75%')
                break;
            case 4:
                this._volumeOptionsMenuCursor.setX(710)
                this._volumeOptionsValueText.setText('100%')
                break;
        
            default:
                break;
        }
    }

    _updateMenuColorOption(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
            case DIRECTION.UP:
            case DIRECTION.NONE:
                break;

            case DIRECTION.LEFT:
                if(this._selectedMenuColorOption === 0){
                    return
                }
                this._selectedMenuColorOption = (this._selectedMenuColorOption - 1) as MenuColorOptions

                break;
            case DIRECTION.RIGHT:
                if(this._selectedMenuColorOption === 2){
                    return
                }
                this._selectedMenuColorOption = (this._selectedMenuColorOption + 1) as MenuColorOptions
                
                break;
            default:
                break;
        }
    }

    _updateMenuColorTextGameObjects(){
        //获取 容器中所有NineSlice类型 对象
        const mainContainerNineSlice = this._mainContainer.getAll('type',"NineSlice") as GameObjects.NineSlice[]
        switch (this._selectedMenuColorOption) {
            case 0:
                this._selectedMenuColorTextGameObjects.setText('1')
                mainContainerNineSlice.forEach(obj=>{
                    //替换菜单颜色
                    obj.setTexture(UI_ASSET_KEYS.MENU_BACKGROUND,0)
                })
                break;
            case 1:
                this._selectedMenuColorTextGameObjects.setText('2')
                mainContainerNineSlice.forEach(obj=>{
                    //替换菜单颜色
                    obj.setTexture(UI_ASSET_KEYS.MENU_BACKGROUND_GREEN,0)
                })
               
                break;
            case 2:
                this._selectedMenuColorTextGameObjects.setText('3')
                mainContainerNineSlice.forEach(obj=>{
                    //替换菜单颜色
                    obj.setTexture(UI_ASSET_KEYS.MENU_BACKGROUND_PURPLE,0)
                })
                break;
            default:
                break;
        }
    }

}