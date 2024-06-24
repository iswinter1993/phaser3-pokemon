import * as Phaser from "phaser";
import * as WebFont from '../lib/webfontloader'
//自定义File加载器，加载网络字体
export class WebFontFileLoader extends Phaser.Loader.File{
    _fontNames:string[]
    /**
     * 
     * @param loader 加载器插件
     * @param fontNames 字体名称数组
     */
    constructor(loader:Phaser.Loader.LoaderPlugin,fontNames:string[]){
        super(loader,{
            type:'webfont',
            key:fontNames.toString()
        })
        this._fontNames = fontNames
    }

    load(): void {
        /**
         * 加载字体
         */
         WebFont.default.load({
            custom:{
                families:this._fontNames
            },
            active:()=>{
                console.log('font 已加载')
                this.loader.nextFile(this,true)
            },
            inactive:()=>{
                console.error('font 加载失败')
                this.loader.nextFile(this,false)
            }
        })
    }
}