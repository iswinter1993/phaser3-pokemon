import { KENNEY_FUTURE_NARROW_FONT_NAME } from './../assets/font-keys';
import { GameObjects } from 'phaser';
import { INVENTORY_ASSET_KEYS, UI_ASSET_KEYS } from './../assets/asset-keys';
import { BaseScene } from './BaseScene';
//背包场景
export class InventoryScene extends BaseScene{
    _sceneData:any
    _nineContainer:GameObjects.Container
    constructor(){
        super('InventoryScene')
    }
    init(data?: any): void {
        super.init()
        this._sceneData = data
        
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

    }
    update(time: number, delta: number): void {
        
    }
}

