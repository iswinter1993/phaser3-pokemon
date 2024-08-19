类pokemon游戏

## 本地运行

安装

> npm i

运行

> npm run dev

## Battle System:
  - [x] load game assets
  - [x] create battle scene layout
  - [x] create dialog menu 
  - [x] create option menu
  - [x] create monster attack move list
  - [x] handle player input
  - [x] code optimization - move logic to components
    - [x] create health component
    - [x] create background component
    - [x] create monster components
  - [x] adding basic attack logic
  - [x] taking damage and monster knock out
  - [x] battle state machine
    - [x] what is a finite state machine
    - [x] review the battle states and what each one represents
    - [x] implement each state
    - [x] add item, flee, and monster states
    - [x] player input improvements
 - [x] battle scene polish
    - [x] text animations
    - [x] monster animations
    - [x] skip animations
    - [x] attack animations
    - [x] scene transitions
    - [x] custom fonts

## World Scene:
  - [x] load level background
  - [x] create player
  - [x] handle player input
  - [x] camera movement
  - [x] handle grid based movement
  - [x] handle collisions
  - [x] add wild monster encounter logic
  - [x] store player position in data manager

## Level Development With Tiled:
  - [x] Basic level design concepts
  - [x] Add collision layer
  - [x] Add custom types to Tiled
  - [x] Add game objects
  - [x] Add npcs
  - [x] Exporting level images and JSON

## World Scene Part 2:
  - [x] add interactive game objects
  - [x] dialog ui component
  - [x] add npcs
  - [x] add npc dialog
  - [x] add npc movement

## Title Screen:
  - [x] create basic title screen
  - [x] add options menu
  - [x] save & loading options
  - [x] connecting option data to battle scene

## Bug Fixes Part 1:
  - [x] battle scene - health bar value when battle starts
  - [x] health bar - animation when value of delay is provided
  - [x] battle scene - at battle start player can provide input
  - [x] world scene - player movement, handle when only sprite direction changes

## Tools Part 1:
  - [x] using tweakpane for testing
    - [x] tweakpane basics
    - [x] positioning game objects
    - [x] monster attacks
    - [x] animations
  - [x] util function for moving game objects

## Saving & Loading:
  - [x] add game menu with option to save game
  - [x] update menu scene with continue option to load game
  - [x] on new game, we should reset the player data (pos, monsters, etc)

## Monster Party & Monster Detail Scenes:
  - [x] create monster party scene
  - [x] allow player to select a monster in the scene
  - [x] create monster detail scene
  - [x] connect monster detail scene to monster party scene
  - [x] add game menu option for viewing monster party scene

## Inventory:
  - [x] create class for items and inventory
  - [x] create ui screen for viewing items
  - [x] update menu to have view bag option
  - [x] update data manager to allow saving of inventory items
  - [x] update ui screen to allow player to use items

## Battle Scene Part 2:
  - [x] using items
  - [x] running away
  - [x] enemy random attack
  - [x] player faint
  - [x] attacking order
  - [x] update data manager to persist monster data and current stats
  - [x] dynamic monster data based on player party and encounter

## Audio:
  - [x] adding background music
  - [x] adding battle music
  - [x] adding attack effects
  - [x] connecting audio options to settings

## World Scene Part 3:
  - [x] advanced wild monster encounter logic
  - [x] buildings
  - [x] items in the field
  - [x] npc event data structure
  - [x] respawn next to npc

## Leveling & Experience:
  - [x] review math for leveling and exp gain
  - [x] update monseters json file and types to include exp info
  - [x] add new assets for exp bar
  - [x] refactor hp bar into re-usable class
  - [x] update battle scene to display exp bar
  - [x] update monster details scene to display exp bar
  - [x] gain exp when battle is over
    - [ ] add new battle state for tracking
    - [ ] new leveling utils for updates
    - [ ] update monster classes to support
    - [ ] update battle menu ui to have wordwrap

-------------------------------

## Future Content:
  - [ ] cutscenes
  - [ ] in game events and tracking
  - [ ] shops
  - [ ] battle npcs
  - [ ] monster encyclopedia
  - [ ] monster league/gyms
  - [ ] leveling & experience
