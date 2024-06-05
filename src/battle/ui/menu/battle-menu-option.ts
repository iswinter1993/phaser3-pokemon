export type BattleMenuOption= typeof BATTLE_MENU_OPTION[keyof typeof BATTLE_MENU_OPTION]
export const BATTLE_MENU_OPTION = Object.freeze({
    FIGHT:'FIGHT', //战斗
    SWITCH:'SWITCH',//切换
    ITEM:'ITEM',//背包
    FLEE:'FLEE'//逃跑
})

export type AttackMoveOption = typeof ATTACK_MOVE_OPTION[keyof typeof ATTACK_MOVE_OPTION]
export const ATTACK_MOVE_OPTION = Object.freeze({
    MOVE_1:'MOVE_1',
    MOVE_2:'MOVE_2',
    MOVE_3:'MOVE_3',
    MOVE_4:'MOVE_4'
})

export type ActiveBattleMenu = typeof ACTIVE_BATTLE_MENU[keyof typeof ACTIVE_BATTLE_MENU]
export const ACTIVE_BATTLE_MENU = Object.freeze({
    BATTLE_MAIN:'BATTLE_MAIN',
    BATTLE_MOVE_SELECT:'BATTLE_MOVE_SELECT',
    BATTLE_ITEM:'BATTLE_ITEM',
    BATTLE_SWITCH:'BATTLE_SWITCH',
    BATTLE_FLEE:'BATTLE_FLEE'
})