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
        this._ball = this._scene.add.follower(this._ballPath,0,500,config.assetKey,config.assetFrame||0).setScale(config.scale||1).setAlpha(0)
       
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
        this._ballPathGraphics.setAlpha(0)

    }

    hide(){
        this._ball.setAlpha(0)
    }

    showBallPath(){
        this._ballPathGraphics.setAlpha(1)
    }

    hideBallPath(){
        this._ballPathGraphics.setAlpha(0)
    }

    playThrowBallAnimations(){
        return new Promise((resolve)=>{
            if(this._skipBattleAnimations){
                this._ball.setPosition(725,180)
                this._ball.setAlpha(1)
                resolve('onComplete')
                return
            }
            this._ball.setPosition(0,500)
            this._ball.setAlpha(1)
            this._ball.startFollow({
                delay:0,
                duration:1000,
                ease:Phaser.Math.Easing.Sine.InOut,
                onComplete:(tween)=>{
                    resolve('onComplete')
                }
            })
        })

    }

    playShakeBallAnimations(repeat=2){
        return new Promise((resolve)=>{
            if(this._skipBattleAnimations){
                resolve('done')
                return
            }
            this._scene.tweens.add({
                targets:this._ball,
                delay:200,
                duration:100,
                repeatDelay:700,
                repeat:repeat,
                x:{
                    from:this._ball.x,
                    start:this._ball.x,
                    to:this._ball.x + 10,
                },
                angle:{
                    from:this._ball.angle,
                    start:this._ball.angle,
                    to:this._ball.angle + 40,
                },
                yoyo:true,
                ease:Phaser.Math.Easing.Sine.InOut,
                onComplete:()=>{
                    resolve('done')
                }
            })
        })
    }
}