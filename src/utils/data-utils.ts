import { Scene } from "phaser";
import { DATA_ASSET_KEYS } from "../assets/asset-keys";
import { Animation, Attack, Item } from "../types/typedef";

export class DataUtils {
    /**
     * 获取招式数据
     * @param scene 
     * @param attackId 
     * @returns 
     */
    static getMonsterAttackById(scene:Scene,attackId:number){
        /**
         * 获取缓存的json
         */
        const data:Attack[] = scene.cache.json.get(DATA_ASSET_KEYS.ATTACKS)
        return data.find( attack => attack.id === attackId)
    }

    static getItemById(scene:Scene,itemId:number){
        const data:Item[] = scene.cache.json.get(DATA_ASSET_KEYS.ITEM)
        return data.find( item => item.id === itemId)
    }

    static getItemsByIds(scene:Scene,itemId:number[]){
        const data:Item[] = scene.cache.json.get(DATA_ASSET_KEYS.ITEM)
        const items:Item[] = []
        itemId.reduce((pre,cur)=>{
            const item = data.find( item => item.id === cur) as Item
            if(item !== undefined){
                items.push(item)
            }
            return cur
        },itemId[0])
        return items
    }

    static getAnimations(scene:Scene){
        const data:Animation[] = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS)
        return data
    }
}