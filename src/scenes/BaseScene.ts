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
    init(){
        this._log(`[${this.constructor.name}] >>> init`)
    }
    preload(){
        this._log(`[${this.constructor.name}] >>> preload`)
    }
    create(){
        this._log(`[${this.constructor.name}] >>> create`)
        this._controls = new Controls(this)
    }
    update(time: number, delta: number): void {
        // update
    }
    _log(message:string){
        console.log(`%c${message}`,'color:orange; background:black;')
    }
}