// 从 ATTACK_KEYS 对象的值中提取类型
export type AttackKeys = typeof ATTACK_KEYS[keyof typeof ATTACK_KEYS];
export const ATTACK_KEYS = Object.freeze({
    ICE_SHARD:'ICE_SHARD',
    SLASH:'SLASH'
})