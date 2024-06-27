import { Animation } from './../types/typedef';
import { DataUtils } from './../utils/data-utils';
import { Scene } from "phaser";
import { ATTACK_ASSET_KEYS, BATTLE_BACKGROUND_ASSET_KEYS, BATTLLE_ASSET_KEYS, CHARACTER_ASSET_KEYS, DATA_ASSET_KEYS, HEALTH_BAR_ASSET_KEYS, MONSTER_ASSET_KEYS, UI_ASSET_KEYS, WORLD_ASSET_KEYS } from "../assets/asset-keys";
import { WebFontFileLoader } from "../assets/web-font-file-loader";
import { KENNEY_FUTURE_NARROW_FONT_NAME } from "../assets/font-keys";

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
        const kenneysAssetPath = 'assets/images/kenneys-assets'
        const dataAssetPath = 'assets/data'
        const pimenAssetPath = 'assets/images/pimen'
        const axulArtAssetPath = 'assets/images/axulart'
        const pbGamesAssetPath = 'assets/images/parabellum-games'
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
        this.load.image(WORLD_ASSET_KEYS.WORLD_BACKGROUND,`${monsterTamerAssetPath}/map/level_background.png`)
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
        
    }

    create(){
        console.log('Preloader >>> create')
        // console.log(this.textures.get(BATTLE_BACKGROUND_ASSET_KEYS.FOREST))
        // this.add.image(0,0,BATTLE_BACKGROUND_ASSET_KEYS.FOREST).setOrigin(0,0)
        
        this.scene.start('WorldScene')
        this._createAnimations()
         
    }

    update(){
       
    }

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