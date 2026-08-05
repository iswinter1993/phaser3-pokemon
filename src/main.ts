

import { Game } from "phaser";
import { BattleScene } from "./scenes/BattleScene";
import { InventoryScene } from "./scenes/InventoryScene";
import { MonsterDetailScene } from "./scenes/MonsterDetailScene";
import { MonsterPartyScene } from "./scenes/MonsterPartyScene";
import { OptionScene } from "./scenes/OptionScene";
import  {Preloader}  from './scenes/Preloader'
import { TestScene } from "./scenes/TestScene";
import { TestWorldCollies } from "./scenes/TestWorldCollies";
import { TitleScene } from "./scenes/TitleScene";
import { WorldScene } from "./scenes/WorldScene";
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


export default new Game({
    type:Phaser.AUTO,
    pixelArt:true,
    backgroundColor:'#000',
    physics: {
        default: "arcade",
        arcade: {
          gravity: {x:0, y: 0 },
        },
    },
    scale:{//缩放比例
        parent:'game-container',
        width:823,
        height:823,
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
        MonsterDetailScene,
        InventoryScene,
        TestWorldCollies
    ]
});


