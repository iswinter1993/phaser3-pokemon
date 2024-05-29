

import { Game, Types } from "phaser";
import  {Preloader}  from './scenes/Preloader'
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


export default new Game({
    parent:'game-container',
    //在场景属性中配置，会自动启动第一个场景
    scene:[
        Preloader
    ]
});


