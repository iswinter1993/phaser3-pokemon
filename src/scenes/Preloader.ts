import { setGlobalSoundSetting } from './../utils/audio-utils';
import { MONSTER_PARTY_ASSET_KEYS, INVENTORY_ASSET_KEYS, AUDIO_ASSET_KEYS, BUILDING_ASSET_KEYS } from './../assets/asset-keys';
import { BaseScene } from './BaseScene';
import { Animation } from './../types/typedef';
import { DataUtils } from './../utils/data-utils';
import { Scene } from "phaser";
import { ATTACK_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, BATTLLE_ASSET_KEYS, CHARACTER_ASSET_KEYS, DATA_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS, TITLE_ASSET_KEYS, UI_ASSET_KEYS, WORLD_ASSET_KEYS } from "../assets/asset-keys";
import { WebFontFileLoader } from "../assets/web-font-file-loader";
import { KENNEY_FUTURE_NARROW_FONT_NAME } from "../assets/font-keys";
import { dataManager } from '../utils/data-manager';

export class Preloader extends BaseScene {
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
        super.init()
        this.load.on('progress',(progress: any)=>{
            console.log('listen progress:',progress)
        })
        this.load.on('filecomplete',(key: any)=>{
            console.log('listen filecomplete:',key)
        })
    }

    preload(){
        super.preload()
        const monsterTamerAssetPath = 'assets/images/monster-tamer'
        const kenneysAssetPath = 'assets/images/kenneys-assets'
        const dataAssetPath = 'assets/data'
        const pimenAssetPath = 'assets/images/pimen'
        const axulArtAssetPath = 'assets/images/axulart'
        const pbGamesAssetPath = 'assets/images/parabellum-games'
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
        this.load.image(MONSTER_ASSET_KEYS.AQUAVALOR,`${monsterTamerAssetPath}/monsters/aquavalor.png`)
        this.load.image(MONSTER_ASSET_KEYS.FROSTSABER,`${monsterTamerAssetPath}/monsters/frostsaber.png`)
        this.load.image(MONSTER_ASSET_KEYS.IGNIVOLT,`${monsterTamerAssetPath}/monsters/Ignivolt.png`)
        this.load.json(DATA_ASSET_KEYS.MONSTERS,`${dataAssetPath}/monsters.json`)
        this.load.json(DATA_ASSET_KEYS.ENCOUNTERS,`${dataAssetPath}/encounters.json`)
        //npc json
        this.load.json(DATA_ASSET_KEYS.NPCS,`assets/data/npcs.json`)
        /**
         * 光标
         */
        this.load.image(UI_ASSET_KEYS.CURSOR,`${monsterTamerAssetPath}/ui/cursor.png`)
        this.load.image(UI_ASSET_KEYS.CURSOR_WHITE,`${monsterTamerAssetPath}/ui/cursor_white.png`)
        /**
         * 招式json
         */
        this.load.json(DATA_ASSET_KEYS.ATTACKS,`${dataAssetPath}/attacks.json`)
        /**
         * 加载字体文件
         */
        this.load.addFile(new WebFontFileLoader(this.load,[KENNEY_FUTURE_NARROW_FONT_NAME]))
        /**
         * 加载攻击资源
         * 使用 this.load.spritesheet 方法预加载 spritesheet。
         *  frameWidth 和 frameHeight 是每帧的宽度和高度。
         */
        this.load.spritesheet(ATTACK_ASSET_KEYS.ICE_SHARD,`${pimenAssetPath}/ice-attack/active.png`,{
            frameHeight:32,
            frameWidth:32
        })
        this.load.spritesheet(ATTACK_ASSET_KEYS.ICE_SHARD_START,`${pimenAssetPath}/ice-attack/start.png`,{
            frameHeight:32,
            frameWidth:32
        })
        this.load.spritesheet(ATTACK_ASSET_KEYS.SLASH,`${pimenAssetPath}/slash.png`,{
            frameHeight:48,
            frameWidth:48
        })

        /**
         * load world assets
         */
        this.load.image(WORLD_ASSET_KEYS.MAIN_1_BACKGROUND,`${monsterTamerAssetPath}/map/main_1_level_background.png`)
        //加载地图数据
        this.load.tilemapTiledJSON(WORLD_ASSET_KEYS.MAIN_1_LEVEL,`assets/data/main_1.json`)
        //加载地图上碰撞块的图层
        this.load.image(WORLD_ASSET_KEYS.WORLD_COLLISION,`${monsterTamerAssetPath}/map/collision.png`)
        this.load.image(WORLD_ASSET_KEYS.MAIN_1_FOREGROUND,`${monsterTamerAssetPath}/map/main_1_level_foreground.png`)
        this.load.image(WORLD_ASSET_KEYS.WORLD_ENCOUNTER_ZONE,`${monsterTamerAssetPath}/map/encounter.png`)

        this.load.spritesheet(WORLD_ASSET_KEYS.BEACH,`${axulArtAssetPath}/beach/AxulArtīs_Basic-Top-down-interior_By_AxulArt_scaled_4x_pngcrushed.png`,{
            frameHeight:64,
            frameWidth:64
        })

        this.load.image(BUILDING_ASSET_KEYS.BUILDING_1_BACKGROUND,`${monsterTamerAssetPath}/map/buildings/building_1_level_background.png`)
        this.load.image(BUILDING_ASSET_KEYS.BUILDING_1_FOREGROUND,`${monsterTamerAssetPath}/map/buildings/building_1_level_foreground.png`)
        this.load.tilemapTiledJSON(BUILDING_ASSET_KEYS.BUILDING_1_LEVEL,`assets/data/building_1.json`)

        this.load.image(BUILDING_ASSET_KEYS.BUILDING_2_BACKGROUND,`${monsterTamerAssetPath}/map/buildings/building_2_level_background.png`)
        this.load.image(BUILDING_ASSET_KEYS.BUILDING_2_FOREGROUND,`${monsterTamerAssetPath}/map/buildings/building_2_level_foreground.png`)
        this.load.tilemapTiledJSON(BUILDING_ASSET_KEYS.BUILDING_2_LEVEL,`assets/data/building_2.json`)


        /**
         * load characters image
         */
        this.load.spritesheet(CHARACTER_ASSET_KEYS.PLAYER,`${axulArtAssetPath}/character/custom.png`,{
            frameWidth:64,
            frameHeight:88
        })
        this.load.spritesheet(CHARACTER_ASSET_KEYS.NPC,`${pbGamesAssetPath}/characters.png`,{
            frameWidth:16,
            frameHeight:16
        })
        /**
         * 加载动画json
         */
        this.load.json(DATA_ASSET_KEYS.ANIMATIONS,`${dataAssetPath}/animations.json`)

        /**
         * 加载title scene 资源
         */
        this.load.image(TITLE_ASSET_KEYS.BACKGROUND,`${monsterTamerAssetPath}/ui/title/background.png`)
        this.load.image(TITLE_ASSET_KEYS.PANEL,`${monsterTamerAssetPath}/ui/title/title_background.png`)
        this.load.image(TITLE_ASSET_KEYS.TITLE,`${monsterTamerAssetPath}/ui/title/title_text.png`)
        this.load.image(UI_ASSET_KEYS.MENU_BACKGROUND,`${kenneysAssetPath}/ui-space-expansion/glassPanel.png`)
        this.load.image(UI_ASSET_KEYS.MENU_BACKGROUND_GREEN,`${kenneysAssetPath}/ui-space-expansion/glassPanel_green.png`)
        this.load.image(UI_ASSET_KEYS.MENU_BACKGROUND_PURPLE,`${kenneysAssetPath}/ui-space-expansion/glassPanel_purple.png`)
        /**
         * 加载monster party资源
         */
        this.load.image(UI_ASSET_KEYS.BLUE_BUTTON,`${kenneysAssetPath}/ui-pack/blue_button01.png`)
        this.load.image(UI_ASSET_KEYS.BLUE_BUTTON_SELECTED,`${kenneysAssetPath}/ui-pack/blue_button00.png`)
        this.load.image(MONSTER_PARTY_ASSET_KEYS.PARTY_BACKGROUND,`${monsterTamerAssetPath}/ui/monster-party/background.png`)
        this.load.image(MONSTER_PARTY_ASSET_KEYS.MONSTER_DETAILS_BACKGROUND,`${monsterTamerAssetPath}/ui/monster-party/monster-details-background.png`)
        /**
         * 加载 背包资源
         */
        this.load.image(INVENTORY_ASSET_KEYS.INVENTORY_BACKGROUND,`${monsterTamerAssetPath}/ui/inventory/bag_background.png`)
        this.load.image(INVENTORY_ASSET_KEYS.INVENTORY_BAG,`${monsterTamerAssetPath}/ui/inventory/bag.png`)
        this.load.json(DATA_ASSET_KEYS.ITEM,`${dataAssetPath}/items.json`)
        //加载音频资源
        this.load.setPath('assets/audio/xDeviruchi')
        this.load.audio(AUDIO_ASSET_KEYS.MAIN,'And-the-Journey-Begins.wav')
        this.load.audio(AUDIO_ASSET_KEYS.BATTLE,'Decisive-Battle.wav')
        this.load.audio(AUDIO_ASSET_KEYS.TITLE,'Title-Theme.wav')
        this.load.setPath('assets/audio/leohpaz')
        this.load.audio(AUDIO_ASSET_KEYS.CLAW,'03_Claw_03.wav')
        this.load.audio(AUDIO_ASSET_KEYS.FLEE,'51_Flee_02.wav')
        this.load.audio(AUDIO_ASSET_KEYS.GRASS,'03_Step_grass_03.wav')
        this.load.audio(AUDIO_ASSET_KEYS.ICE,'13_Ice_explosion_01.wav')
        
    }

    create(){
        super.create()
        
        this._createAnimations()
        dataManager.init(this)
        dataManager.loadData()
        setGlobalSoundSetting(this)
        this.scene.start('TitleScene')
         
    }

    update(){
       
    }
    /**
     * 创建animation.json中的所有动画，包括攻击动画
     */
    _createAnimations(){
        const animations = DataUtils.getAnimations(this)
        animations.forEach((animation:Animation) => {
            const {
                key,
                frames,
                frameRate,
                repeat,
                delay,
                yoyo,
                assetKey
            } = animation
            this.anims.create({
                key: key,
                frames:this.anims.generateFrameNumbers(assetKey,{frames}),
                frameRate,//帧速率
                delay,
                repeat,
                yoyo //动画应该有yoyo吗？ （反向回到起点）然后再重复？
             })
        });
    }
}