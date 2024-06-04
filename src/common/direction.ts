// 从 DIRECTION 对象的值中提取类型
export type DirectionType = typeof DIRECTION[keyof typeof DIRECTION];
export const DIRECTION = Object.freeze({
    LEFT:'LEFT',
    RIGHT:'RIGHT',
    UP:'UP',
    DOWN:'DOWN',
    NONE:'NONE'
})