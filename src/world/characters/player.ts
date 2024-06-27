import { Scene } from 'phaser';
import { CHARACTER_ASSET_KEYS } from '../../assets/asset-keys';
import { Coordinate } from '../../types/typedef';
import { Character } from "./character";

type PlayerConfig = {
    scene:Scene,
    position:Coordinate
}

export class Player extends Character {
    constructor(config:PlayerConfig){
        super({
            ...config,
            assetKey:CHARACTER_ASSET_KEYS.PLAYER,
            assetFrame:7
        })
    }
}