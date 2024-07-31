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
        })
    }

}

export function playSoundFx(scene:Scene,audioKey:AudioKey){
    if(dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND)!== SOUND_OPTIONS.ON){
        return
    }
    scene.sound.play(audioKey,{
        volume:20 * dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME) / 4
    })
}


export const setGlobalSoundSetting = (scene:Scene) => {
    scene.sound.setVolume(dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_VOLUME) / 4)
    scene.sound.setMute(dataManager.store.get(DATA_MANAGER_STORE_KEYS.OPTIONS_SOUND) === SOUND_OPTIONS.OFF)
}