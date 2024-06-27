import { DIRECTION, DirectionType } from "../common/direction"
import { TILE_SIZE } from "../config";
import { Coordinate } from "../types/typedef"

/**
 * 获取目标位置的坐标
 * @param currentPosition 
 * @param direction 
 * @returns
 */
export const getTargetPositionFromGameObjectPositionAndDirection = (currentPosition:Coordinate,direction:DirectionType):Coordinate => {
    const targetPosition = {...currentPosition}

    switch (direction) {
        case DIRECTION.DOWN:
            targetPosition.y += TILE_SIZE
            
            break;
        case DIRECTION.LEFT:
            targetPosition.x -= TILE_SIZE
            break;
        case DIRECTION.UP:
            targetPosition.y -= TILE_SIZE
            break;
        case DIRECTION.RIGHT:
            targetPosition.x += TILE_SIZE
            break; 
        case DIRECTION.NONE:
        
            break;        
        default:
            break;
    }

    return targetPosition
}