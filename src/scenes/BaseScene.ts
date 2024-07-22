import { Controls } from './../utils/controls';
import { Scene } from 'phaser';
export class BaseScene extends Scene {
    _controls:Controls
    constructor(config: string | Phaser.Types.Scenes.SettingsConfig | undefined){
        super(config)
        if(this.constructor === BaseScene){
            throw new Error('BaseScene 是抽象类，无法被创建')
        }
    }
    init(data?:any){
        this._log(`[${this.constructor.name}] >>> init`,data)
    }
    preload(){
        this._log(`[${this.constructor.name}] >>> preload`)
    }
    create(){
        this._log(`[${this.constructor.name}] >>> create`)
        this._controls = new Controls(this)
        //监听场景resume场景重启事件，获取返回数据
        this.events.on(Phaser.Scenes.Events.RESUME,this.handleSceneResume,this)
        //监听调用scene.stop方法时，清理上面的监听事件
        this.events.once(Phaser.Scenes.Events.SHUTDOWN,this.handleSceneResumeClear,this)
    }
    update(time: number, delta: number): void {
        // update
    }
    _log(message:string,data?:any){
        console.log(`%c${message}`,'color:orange; background:black;',data)
    }
    /**
     * 监听回调
     * @param sys 系统数据
     * @param data 我们返回的数据
     */
     handleSceneResume(sys:Scene,data:any){
        this._controls.lockInput = false
        this._log(`[${this.constructor.name}]: has been resumed`,{data,sys})
    }
    /**
     * 清理监听
     */
    handleSceneResumeClear(){
        this._log(`[${this.constructor.name}]: handleSceneResume has been clear!`)
        this.events.off(Phaser.Scenes.Events.RESUME,this.handleSceneResume,this)
    }
}