export type OptionMenuOptions = keyof typeof OPTION_MENU_OPTIONS
export const OPTION_MENU_OPTIONS = Object.freeze({
    TEXT_SPEED:'TEXT_SPEED',
    BATTLE_SCENE:'BATTLE_SCENE',
    BATTLE_STYLE:'BATTLE_STYLE',
    SOUND:'SOUND',
    VOLUME:'VOLUME',
    MENU_COLOR:'MENU_COLOR',
    CONFIRM:'CONFIRM'
})

export type TextSpeedOptions = keyof typeof TEXT_SPEED_OPTIONS
export const TEXT_SPEED_OPTIONS = Object.freeze({
    SLOW:'SLOW',
    MID:'MID',
    FAST:'FAST'
})

export type BattleSceneOptions = keyof typeof BATTLE_SCENE_OPTIONS
export const BATTLE_SCENE_OPTIONS = Object.freeze({
    ON:'ON',
    OFF:'OFF',
})

export type BattleStyleOptions = keyof typeof BATTLE_STYLE_OPTIONS
export const BATTLE_STYLE_OPTIONS = Object.freeze({
    SET:'SET',
    SHIFT:'SHIFT',
})

export type SoundOptions = keyof typeof SOUND_OPTIONS
export const SOUND_OPTIONS = Object.freeze({
    ON:'ON',
    OFF:'OFF',
})

export type VolumeOptions = 0|1|2|3|4
export type MenuColorOptions = 0|1|2
