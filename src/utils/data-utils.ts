import { CHARACTER_ASSET_KEYS } from './../assets/asset-keys';
import { EncounterData, Monster, NpcData } from './../types/typedef';
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
    /**
     * 通过id获取道具
     * @param scene 
     * @param itemId 
     * @returns 
     */
    static getItemById(scene:Scene,itemId:number){
        const data:Item[] = scene.cache.json.get(DATA_ASSET_KEYS.ITEM)
        return data.find( item => item.id === itemId)
    }
    /**
     * 通过多个id获取多个道具
     * @param scene 
     * @param itemId 
     * @returns 
     */
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
    /**
     * 通过id获取怪兽
     * @param scene 
     * @param monsterId 
     * @returns 
     */
    static getMonsterById(scene:Scene,monsterId:number){
        const data:Monster[] = scene.cache.json.get(DATA_ASSET_KEYS.MONSTERS)
        return data.find( monster => monster.monsterId === monsterId)
    }
    /**
     * 获取动画数据
     * @param scene 
     * @returns 
     */
    static getAnimations(scene:Scene){
        const data:Animation[] = scene.cache.json.get(DATA_ASSET_KEYS.ANIMATIONS)
        return data
    }
    /**
     * 通过地区ID获取可以遇到的怪兽
     * @param scene 
     * @param areaId 地区id
     * @returns 
     */
    static getEncountersMonsterByAreaId(scene:Scene,areaId:number){
        const data:EncounterData = scene.cache.json.get(DATA_ASSET_KEYS.ENCOUNTERS)
        const monsterId:[][] = data[areaId]
        return monsterId
    }
    /**
     * 通过id获取npc数据
     * @param scene 
     * @param id 
     * @returns 
     */
    static getNPCById(scene:Scene,id:number){
        const data:NpcData = scene.cache.json.get(DATA_ASSET_KEYS.NPCS)
        return data[id.toString()]
    }
}