import { Scene } from "phaser";
import { DATA_ASSET_KEYS } from "../assets/asset-keys";
import { Attack } from "../types/typedef";

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
}