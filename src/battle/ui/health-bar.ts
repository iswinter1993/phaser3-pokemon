import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { HEALTH_BAR_ASSET_KEYS } from '../../assets/asset-keys';
export class HealthBar {
    _scene:Scene;
    _healthBarContainer:GameObjects.Container;
    _fullWidth:number;
    _scaleY:number;
    _leftCap:GameObjects.Image;
    _mid:GameObjects.Image;
    _rightCap:GameObjects.Image;
    _leftCapShadow:GameObjects.Image;
    _midShadow:GameObjects.Image;
    _rightCapShadow:GameObjects.Image;
    /**
     * 
     * @param scene
     * @param x 
     * @param y 
     */
    constructor(scene:Scene,x:number,y:number){
        this._fullWidth = 360
        this._scaleY = 0.7
        this._scene = scene
        this._healthBarContainer = this._scene.add.container(x,y,[])
        this._createHealthBarShadowImage(x,y)
        this._createHealthBarImage(x,y)
        this._setMeterPercentage(1)
    }

    get container(){
        return this._healthBarContainer
    }
    /**
     * 
     * @param x X轴的坐标位置
     * @param y Y轴的坐标位置
     * @returns {void}
     */
     _createHealthBarImage(x:number,y:number){

        this._leftCap = this._scene.add.image(x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._mid = this._scene.add.image(this._leftCap.x + this._leftCap.width,y,HEALTH_BAR_ASSET_KEYS.MIDDLE).setOrigin(0,0.5).setScale(1,this._scaleY)
        
        this._rightCap = this._scene.add.image(this._mid.x + this._mid.displayWidth,y,HEALTH_BAR_ASSET_KEYS.RIGHT_CAP).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._healthBarContainer.add([this._leftCap,this._mid,this._rightCap])
    }
    /**
     * 
     * @param x X轴的坐标位置
     * @param y Y轴的坐标位置
     * @returns {void}
     */
    _createHealthBarShadowImage(x:number,y:number){
        this._leftCapShadow = this._scene.add.image(x,y,HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._midShadow = this._scene.add.image(this._leftCapShadow.x + this._leftCapShadow.width,y,HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._midShadow.displayWidth = this._fullWidth
        this._rightCapShadow = this._scene.add.image(this._midShadow.x + this._midShadow.displayWidth,y,HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._healthBarContainer.add([ this._leftCapShadow,this._midShadow, this._rightCapShadow])
    }
    /**
     * 设置百分比
     * @param percent 百分比
     */
    _setMeterPercentage(percent = 1){
        const width = this._fullWidth * percent
        this._mid.displayWidth = width
        //更新右侧顶部图片的位置
        this._rightCap.x = this._mid.x + this._mid.displayWidth
    }
    /**
     * 设置百分比的动画
     * @param percent 
     * @param options 
     */
    setMeterPercentageAnimated(percent:number,options?: any){
        const width = this._fullWidth * percent
        if(options?.skipBattleAnimations){
            this._setMeterPercentage(percent)
            if(options?.callback){
                options.callback()
            }
            return
        }
 
        this._scene.tweens.add({
            targets:this._mid,
            displayWidth:width,
            duration: options?.duration || options?.duration === 0 ? 0 : 1000,
            ease:'Sine.Out',
            onUpdate:() => {
                this._rightCap.x = this._mid.x + this._mid.displayWidth
                const isVisible = this._mid.displayWidth > 0
                this._leftCap.visible = isVisible
                this._mid.visible = isVisible
                this._rightCap.visible = isVisible
            },
            onComplete:options?.callback

        })
    }
}