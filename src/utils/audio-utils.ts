import { SOUND_OPTIONS } from './../common/option';
import { AUDIO_ASSET_KEYS } from './../assets/asset-keys';
import { Scene } from 'phaser';
import { dataManager, DATA_MANAGER_STORE_KEYS } from './data-manager';

type AudioKey = keyof typeof AUDIO_ASSET_KEYS

export function playBackgroundMusic(scene:Scene,audioKey:AudioKey){
    if(dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND)!== SOUND_OPTIONS.ON){
        return
    }
    const existingSounds = scene.sound.getAllPlaying()
    console.log(existingSounds)
    let musicAlreadyPlay = false
    existingSounds.forEach(sound=>{
        if(sound.key === audioKey){
            musicAlreadyPlay = true
            return
        }
        sound.stop()
    })

    if(!musicAlreadyPlay){
        //设置音乐
        scene.sound.play(audioKey,{
            loop:true,
            volume:dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME) / 4
        })
    }

}