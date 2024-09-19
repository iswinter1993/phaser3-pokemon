import { Scene } from 'phaser';
export const sleep = (ms:number,scene:Scene) => {
    return new Promise(resolve=>{
        scene.time.delayedCall(ms,()=>{
            console.log('sleep...')
            resolve('sleep...')
        })
    })
}