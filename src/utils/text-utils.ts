import { GameObjects } from 'phaser';
import { Scene } from 'phaser';
type AnimateTextConfig = {
    callback?:()=>void,
    delay?:number
}
/**
 * 文字显示动画
 * @param scene 
 * @param targets phaser文本对象
 * @param text  字符串
 * @param config 配置
 */
export const animateText = (scene:Scene,targets:GameObjects.Text,text:string,config?:AnimateTextConfig) => {
    let length = text.length
    let i = 0
    scene.time.addEvent({
        delay:config?.delay || 25,
        repeat: length - 1,
        callback:()=>{
            targets.text += text[i]
            ++i
            if(i === length - 1 && config?.callback){
                config.callback()
            } 
        }
    })
}