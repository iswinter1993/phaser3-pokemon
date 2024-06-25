import { Scene } from "phaser";
type OptionType = {
    callback?:()=>void,
    skipSceneTransition?:boolean
}
/**
 * 创建过场动画
 * @param scene 
 * @param option 
 */
export const createSceneTransition = (scene:Scene,option?:OptionType) => {
    const skipSceneTransition = option?.skipSceneTransition || false
    if(skipSceneTransition){
        if(option?.callback){
            option.callback()
        }
        return
    }
    //获取场景的宽高
    const {width , height} = scene.scale

    //创建矩形，当cameras setMask为蒙层时，为可见区域，
    // 当没有setMask 时，为一个矩形块
    const reactShape = new Phaser.Geom.Rectangle(0,height/2,width,0)

    //graphics - 创建一个新的图形游戏对象并将其添加到场景中。
    //fillRectShape - 填充给定的矩形。
    //setDepth - 等于 z-index
    //  fillStyle:{color:0x0000} 设置矩形填充颜色
    const g = scene.add
    .graphics(
    //     {
    //     fillStyle:{color:0x0000}
    // }
    ).fillRectShape(reactShape).setDepth(-1)
    //创建蒙层
    const mask = g.createGeometryMask()

    scene.cameras.main.setMask(mask)

    scene.tweens.add({
        targets:reactShape,
        height:{
            ease:'Sine.Out',
            from:0,
            start:0,
            to:height
        },
        y:{
            ease:'Sine.Out',
            from:height/2,
            start:height/2,
            to:0
        },
        delay:400,
        duration:800,
        repeat:0,
        onUpdate:()=>{
            g.clear().fillRectShape(reactShape)
        },
        onComplete:() => {
            mask.destroy()
            scene.cameras.main.clearMask()
            if(option?.callback){
                option.callback()
            }
        }
    })

} 