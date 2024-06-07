import { Scene } from "phaser";
import { BATTLE_BACKGROUND_ASSET_KEYS, BATTLLE_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS, UI_ASSET_KEYS } from "../assets/asset-keys";
export class Preloader extends Scene {
    constructor () {
        //通过构造函数创建场景，super函数中字符串为场景的key
        super({
            key:'Preloader',
            // active:true
        })
        console.log('Preloader load')
    }
    //生命周期init，preload，create，update
    init(){
        console.log('Preloader >>> init')
        this.load.on('progress',(progress: any)=>{
            console.log('listen progress:',progress)
        })
        this.load.on('filecomplete',(key: any)=>{
            console.log('listen filecomplete:',key)
        })
    }

    preload(){
        const monsterTamerAssetPath = 'assets/images/monster-tamer'
        const kenneysAssetPath = 'assets/images/kenneys-assets/'
        console.log('Preloader >>> preload')
        /**
         * battle background assets
         */
        this.load.image(BATTLE_BACKGROUND_ASSET_KEYS.FOREST,`${monsterTamerAssetPath}/battle-backgrounds/forest-background.png`)
        /**
         * battle assets
         */
        this.load.image(BATTLLE_ASSET_KEYS.HEALTH_BAR_BACKGROUND,`${kenneysAssetPath}/ui-space-expansion/custom-ui.png`)
        /**
         * health bar assets
         */
        this.load.image(HEALTH_BAR_ASSET_KEYS.LEFT_CAP,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_left.png`)
        this.load.image(HEALTH_BAR_ASSET_KEYS.MIDDLE,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_mid.png`)
        this.load.image(HEALTH_BAR_ASSET_KEYS.RIGHT_CAP,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_green_right.png`)
        this.load.image(HEALTH_BAR_ASSET_KEYS.LEFT_CAP_SHADOW,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_left.png`)
        this.load.image(HEALTH_BAR_ASSET_KEYS.MIDDLE_SHADOW,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_mid.png`)
        this.load.image(HEALTH_BAR_ASSET_KEYS.RIGHT_CAP_SHADOW,`${kenneysAssetPath}/ui-space-expansion/barHorizontal_shadow_right.png`)
        /**
         * monster assets
         */
        this.load.image(MONSTER_ASSET_KEYS.CARNODUSK,`${monsterTamerAssetPath}/monsters/carnodusk.png`)
        this.load.image(MONSTER_ASSET_KEYS.IGUANIGNITE,`${monsterTamerAssetPath}/monsters/iguanignite.png`)
        /**
         * 光标
         */
        this.load.image(UI_ASSET_KEYS.CURSOR,`${monsterTamerAssetPath}/ui/cursor.png`)
    }

    create(){
        console.log('Preloader >>> create')
        // console.log(this.textures.get(BATTLE_BACKGROUND_ASSET_KEYS.FOREST))
        // this.add.image(0,0,BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0,0)
        this.scene.start('BattleScene')
    }

    update(){
       
    }
}