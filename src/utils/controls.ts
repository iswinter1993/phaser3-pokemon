import { Input, Scene, Types } from 'phaser';
import { DIRECTION, DirectionType } from '../common/direction';
export class Controls {
    _scene:Scene
    _cursorKeys:Types.Input.Keyboard.CursorKeys | undefined
    _lockPlayerInput:boolean
    constructor(scene:Scene){
        this._scene = scene
        this._cursorKeys = this._scene.input.keyboard?.createCursorKeys()
        this._lockPlayerInput = false
    }

    get isInputLocked(){
        return this._lockPlayerInput
    }

    set lockInput(val: boolean){
        this._lockPlayerInput = val
    }

    wasSpaceKeyPressed(){
        if(this._cursorKeys === undefined){
            return false
        }
        return Input.Keyboard.JustDown(this._cursorKeys.space)
    }

    wasBackKeyPressed(){
        if(this._cursorKeys === undefined){
            return false
        }
        return Input.Keyboard.JustDown(this._cursorKeys.shift)

    }

    getDirectionKeyJustPressed(){
        if(this._cursorKeys === undefined){
            return DIRECTION.NONE
        }
        // Input.Keyboard.JustDown(this._cursorKeys.right) 
        //每次按键只能调用 justDown 一次。它只会返回 true 一次，直到松开并再次按下该键为止。这允许您在想要检查该键是否按下而不使用事件的情况下使用它，例如在核心游戏循环中。
        let selectedDirection:DirectionType = DIRECTION.NONE
        if(Input.Keyboard.JustDown(this._cursorKeys.left)){
            selectedDirection = DIRECTION.LEFT
        } else if(Input.Keyboard.JustDown(this._cursorKeys.right)){
            selectedDirection = DIRECTION.RIGHT
        } else if(Input.Keyboard.JustDown(this._cursorKeys.up)){
            selectedDirection = DIRECTION.UP
        } else if(Input.Keyboard.JustDown(this._cursorKeys.down)){
            selectedDirection = DIRECTION.DOWN
        } 
        return selectedDirection

    }

    getDirectionKeyPressedDown(){
        if(this._cursorKeys === undefined){
            return DIRECTION.NONE
        }
        let selectedDirection:DirectionType = DIRECTION.NONE
        if(this._cursorKeys?.left.isDown){
            selectedDirection = DIRECTION.LEFT
        } else if(this._cursorKeys?.right.isDown){
            selectedDirection = DIRECTION.RIGHT
        } else if(this._cursorKeys?.up.isDown){
            selectedDirection = DIRECTION.UP
        } else if(this._cursorKeys?.down.isDown){
            selectedDirection = DIRECTION.DOWN
        } 
        return selectedDirection

    }

}