import { Scene } from 'phaser';
export type BallConfig = {
    scene:Scene,
    assetKey:string,
    assetFrame?:number,
    skipBattleAnimations?:boolean,
    scale?:number,

} 
export class Ball {
    _scene:Scene
    _ball:Phaser.GameObjects.PathFollower//图片跟随对象，自动处理图片跟随路径运动
    _ballPath:Phaser.Curves.Path
    _ballPathGraphics:Phaser.GameObjects.Graphics//图形对象
    _skipBattleAnimations:boolean
    constructor(config:BallConfig){
        this._scene = config.scene
        this._skipBattleAnimations = config.skipBattleAnimations || false
        this._createCurvePath()
        this._ball = this._scene.add.follower(this._ballPath,0,500,config.assetKey,config.assetFrame||0).setScale(config.scale||1)
        this._ball.startFollow({
            delay:0,
            duration:1000,
            ease:Phaser.Math.Easing.Sine.InOut,
            onComplete:(tween)=>{
                console.log('done')
            }
        })
    }
    /**
     * 定义精灵球抛出曲线
     */
    _createCurvePath(){
        //定义构成曲线的四个点
        const startPoint = new Phaser.Math.Vector2(0,500)
        const controlPoint1 = new Phaser.Math.Vector2(200,100)
        const controlPoint2 = new Phaser.Math.Vector2(725,180)
        const endPoint = new Phaser.Math.Vector2(725,180)
        //创建曲线函数
        const curve = new Phaser.Curves.CubicBezier(startPoint,controlPoint1,controlPoint2,endPoint)
        //创建曲线路径,设置起始点，添加路径曲线
        this._ballPath = new Phaser.Curves.Path(0,500).add(curve)

        //场景中添加图形对象画出曲线
        this._ballPathGraphics = this._scene.add.graphics()
        this._ballPathGraphics.clear()
        this._ballPathGraphics.lineStyle(1,0x00ff00,1)
        //曲线路径中添加图形对象，画出路径
        this._ballPath.draw(this._ballPathGraphics)

    }
}