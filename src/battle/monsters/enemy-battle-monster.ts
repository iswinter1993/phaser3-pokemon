import { BattleMonster } from "./battle-monster";
import { BattleMonsterConfig,Coordinate } from "../../types/typedef";


const ENEMY_POSITION:Coordinate = Object.freeze({
    x:768,
    y:144
})
export class EnemyBattleMonster extends BattleMonster {
    constructor(config:BattleMonsterConfig){
        super(config,ENEMY_POSITION)

    }
}