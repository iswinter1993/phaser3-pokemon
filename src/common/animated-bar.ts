import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
import { HEALTH_BAR_ASSET_KEYS } from '../assets/asset-keys';

export type AnimatedBarConfig = {
    scene:Scene,
    x:number,
    y:number,
    width:number,
    scaleY:number,
    leftCapAssetKey:string,
    middleAssetKey:string,
    rightCapAssetKey:string,
    leftShadowCapAssetKey:string,
    middleShadowAssetKey:string,
    rightShadowCapAssetKey:string,
}

export class AnimatedBar {
    _scene:Scene;
    _container:GameObjects.Container;
    _fullWidth:number;
    _scaleY:number;
    _leftCap:GameObjects.Image;
    _mid:GameObjects.Image;
    _rightCap:GameObjects.Image;
    _leftCapShadow:GameObjects.Image;
    _midShadow:GameObjects.Image;
    _rightCapShadow:GameObjects.Image;

    _leftCapAssetKey:string
    _middleAssetKey:string
    _rightCapAssetKey:string
    _leftShadowCapAssetKey:string
    _middleShadowAssetKey:string
    _rightShadowCapAssetKey:string
    /**
     * 
     * @param scene
     * @param x 
     * @param y 
     */
    constructor(config:AnimatedBarConfig){
        if(this.constructor === AnimatedBar){
            throw new Error('AnimatedBar 是一个静态类，无法实例化')
        }
        this._fullWidth = config.width
        this._scaleY = config.scaleY
        this._scene = config.scene
        this._leftCapAssetKey = config.leftCapAssetKey
        this._middleAssetKey = config.middleAssetKey
        this._rightCapAssetKey = config.rightCapAssetKey
        this._leftShadowCapAssetKey = config.leftShadowCapAssetKey
        this._middleShadowAssetKey = config.middleShadowAssetKey
        this._rightShadowCapAssetKey = config.rightShadowCapAssetKey

        this._container = this._scene.add.container(config.x,config.y,[])
        this._createBarShadowImage(config.x,config.y)
        this._createBarImage(config.x,config.y)
        this._setMeterPercentage(1)
    }

    get container(){
        return this._container
    }
    /**
     * 
     * @param x X轴的坐标位置
     * @param y Y轴的坐标位置
     * @returns {void}
     */
     _createBarImage(x:number,y:number){

        this._leftCap = this._scene.add.image(x,y,this._leftCapAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._mid = this._scene.add.image(this._leftCap.x + this._leftCap.width,y,this._middleAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        
        this._rightCap = this._scene.add.image(this._mid.x + this._mid.displayWidth,y,this._rightCapAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._container.add([this._leftCap,this._mid,this._rightCap])
    }
    /**
     * 
     * @param x X轴的坐标位置
     * @param y Y轴的坐标位置
     * @returns {void}
     */
    _createBarShadowImage(x:number,y:number){
        this._leftCapShadow = this._scene.add.image(x,y,this._leftShadowCapAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._midShadow = this._scene.add.image(this._leftCapShadow.x + this._leftCapShadow.width,y,this._middleShadowAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._midShadow.displayWidth = this._fullWidth
        this._rightCapShadow = this._scene.add.image(this._midShadow.x + this._midShadow.displayWidth,y,this._rightShadowCapAssetKey).setOrigin(0,0.5).setScale(1,this._scaleY)
        this._container.add([ this._leftCapShadow,this._midShadow, this._rightCapShadow])
    }
    /**
     * 设置百分比
     * @param percent 百分比
     */
    _setMeterPercentage(percent = 1){
        const width = this._fullWidth * percent
        this._mid.displayWidth = width
        this._updateBarGameObjects()
    }
    
    _updateBarGameObjects(){
        //更新右侧顶部图片的位置
        this._rightCap.x = this._mid.x + this._mid.displayWidth;

        const isVisible = this._mid.displayWidth > 0;
        this._leftCap.visible = isVisible;
        this._mid.visible = isVisible;
        this._rightCap.visible = isVisible;
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
                this._updateBarGameObjects()
            },
            onComplete:options?.callback

        })
    }
}