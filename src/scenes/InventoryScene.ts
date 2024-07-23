import { Item } from './../types/typedef';
import { dataManager } from './../utils/data-manager';
import { DIRECTION, DirectionType } from './../common/direction';
import { KENNEY_FUTURE_NARROW_FONT_NAME } from './../assets/font-keys';
import { GameObjects } from 'phaser';
import { INVENTORY_ASSET_KEYS, UI_ASSET_KEYS } from './../assets/asset-keys';
import { BaseScene } from './BaseScene';
//背包场景
type Inventory = {
    item:Item,
    quantity:number
    gameObjects:any
}

const INVENTORY_ITEM_POSITION = Object.freeze({
    x:50,
    y:14,
    space:50
})
const CANCEL_TEXT_DESC = 'Close you bag'
export class InventoryScene extends BaseScene{
    _sceneData:any
    _nineContainer:GameObjects.Container
    _selectedInventoryText:GameObjects.Text
    _userInputCursor:GameObjects.Image
    _inventory:Inventory[]
    _selectedInventoryOptionIndex:number
    constructor(){
        super('InventoryScene')
    }
    init(data: any): void {
        super.init(data)
        this._sceneData = data
        const inventory = dataManager.getInventory(this)
        this._inventory = inventory.map(inventoryItem=>{
            return{
                item:inventoryItem.item,
                quantity:inventoryItem.quantity,
                gameObjects:{}
            }
        })
        this._selectedInventoryOptionIndex = 0
        
    }
    create(): void {
        super.create()
        //create background
        this.add.image(0,0,INVENTORY_ASSET_KEYS.INVENTORY_BACKGROUND,0).setOrigin(0)
        this.add.image(40,120,INVENTORY_ASSET_KEYS.INVENTORY_BAG,0).setOrigin(0).setScale(0.5)

        const nineslice = this.add.nineslice(0,0,UI_ASSET_KEYS.MENU_BACKGROUND,0,700,360,32,32,32,32).setOrigin(0)
        this._nineContainer = this.add.container(0,0,[nineslice]).setPosition(300,20)
        const nineContainerBackground = this.add.rectangle(4,4,692,352,0xffff88,0.6).setOrigin(0)
        this._nineContainer.add(nineContainerBackground)
        this._userInputCursor = this.add.image(30,30,UI_ASSET_KEYS.CURSOR).setScale(3)
        this._nineContainer.add(this._userInputCursor)

        const cancelText = this.add.text(INVENTORY_ITEM_POSITION.x,INVENTORY_ITEM_POSITION.y + this._inventory.length * INVENTORY_ITEM_POSITION.space,'Cancel',{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#000000',
            fontSize:'30px'
        })

        this._nineContainer.add(cancelText)


        this._inventory.forEach((item,index) => {
            const itemText = this.add.text(INVENTORY_ITEM_POSITION.x,INVENTORY_ITEM_POSITION.y + index * INVENTORY_ITEM_POSITION.space,item.item.name,{
                fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
                color:'#000000',
                fontSize:'30px'
            })
            const qty1Text = this.add.text(620,INVENTORY_ITEM_POSITION.y + 2 + index * INVENTORY_ITEM_POSITION.space,'x',{
                fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
                color:'#000000',
                fontSize:'30px'
            })
            const qty2Text = this.add.text(650,INVENTORY_ITEM_POSITION.y + index * INVENTORY_ITEM_POSITION.space,item.quantity+'',{
                fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
                color:'#000000',
                fontSize:'30px'
            })

            this._nineContainer.add([itemText,qty1Text,qty2Text])
            item.gameObjects = {
                itemName:itemText,
                quantity:qty2Text,
                quantitySign:qty1Text
            }
        });

        const titleNine = this.add.nineslice(0,0,UI_ASSET_KEYS.MENU_BACKGROUND,0,240,64,32,32,32,32).setOrigin(0)
        const titleNineContainer = this.add.container(0,0,[titleNine]).setPosition(64,20)
        const titleNineContainerBackground = this.add.rectangle(4,4,232,56,0xffff88,0.6).setOrigin(0)
        titleNineContainer.add(titleNineContainerBackground)

        const titleText = this.add.text(116,28,'Items',{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#000000',
            fontSize:'30px'
        }).setOrigin(0.5)

        titleNineContainer.add(titleText)


        this._selectedInventoryText = this.add.text(25,420,'aaaa',{
            fontFamily:KENNEY_FUTURE_NARROW_FONT_NAME,
            color:'#ffffff',
            fontSize:'30px',
            wordWrap:{
                width:this.scale.width - 18
            }
        })
        this._updateItemDescriptionText()

    }
    update(time: number, delta: number): void {
        if(this._controls.isInputLocked){
            return
        }
        if(this._controls.wasBackKeyPressed()){
            this._goBackToPreviousScene()
            return
        }
        const wasSpaceKeyPressed = this._controls.wasSpaceKeyPressed()
        if(wasSpaceKeyPressed){
            if(this._isCancelButtonSelected()){
                this._goBackToPreviousScene()
                return
            }
            this._controls.lockInput = true
            const sceneDataToPass = {
                previousScene:'InventoryScene'
            }
            this.scene.launch('MonsterPartyScene',sceneDataToPass)
            this.scene.pause('InventoryScene')
            return
        }
        const selectedDirection = this._controls.getDirectionKeyJustPressed()
        if(selectedDirection !== DIRECTION.NONE){
            this._movePlayerInputCursor(selectedDirection)
            this._updateItemDescriptionText()
        }
        
    }
    _updateItemDescriptionText(){
        if(this._isCancelButtonSelected()){
            this._selectedInventoryText.setText(CANCEL_TEXT_DESC)
            return
        }
        this._selectedInventoryText.setText(this._inventory[this._selectedInventoryOptionIndex].item.description)
    }
    _isCancelButtonSelected(){
        return this._selectedInventoryOptionIndex === this._inventory.length
    }

    _goBackToPreviousScene(){
        this._controls.lockInput = true
        this.scene.stop('InventoryScene')
        this.scene.resume(this._sceneData.previousScene)
    }

    _movePlayerInputCursor(direction:DirectionType){
        switch (direction) {
            case DIRECTION.DOWN:
                this._selectedInventoryOptionIndex += 1
                if(this._selectedInventoryOptionIndex > this._inventory.length) {
                    this._selectedInventoryOptionIndex = 0
                }
                break;
            case DIRECTION.UP:
                this._selectedInventoryOptionIndex -= 1
                if(this._selectedInventoryOptionIndex < 0 ){
                    this._selectedInventoryOptionIndex = this._inventory.length
                }
                
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
        const y = 30 + this._selectedInventoryOptionIndex * 50
        this._userInputCursor.setY(y)
    }
}

