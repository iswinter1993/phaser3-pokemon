

import { Game } from "phaser";
import { BattleScene } from "./scenes/BattleScene";
import { MonsterDetailScene } from "./scenes/MonsterDetailScene";
import { MonsterPartyScene } from "./scenes/MonsterPartyScene";
import { OptionScene } from "./scenes/OptionScene";
import  {Preloader}  from './scenes/Preloader'
import { TestScene } from "./scenes/TestScene";
import { TitleScene } from "./scenes/TitleScene";
import { WorldScene } from "./scenes/WorldScene";
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


export default new Game({
    type:Phaser.AUTO,
    pixelArt:false,
    backgroundColor:'#000',
    scale:{//缩放比例
        parent:'game-container',
        width:1024,
        height:576,
        mode:Phaser.Scale.FIT, //缩放模式
        autoCenter:Phaser.Scale.CENTER_BOTH
    },
    //在场景属性中配置，会自动启动第一个场景
    scene:[
        Preloader,
        TitleScene,
        OptionScene,
        BattleScene,
        WorldScene,
        TestScene,
        MonsterPartyScene,
        MonsterDetailScene
    ]
});


