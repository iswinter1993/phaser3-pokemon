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
  - [ ] save & loading options
  - [ ] connecting option data to battle scene

## Bug Fixes Part 1:
  - [ ] battle scene - health bar value when battle starts
  - [ ] health bar - animation when value of delay is provided
  - [ ] battle scene - at battle start player can provide input
  - [ ] world scene - player movement, handle when only sprite direction changes

## Tools Part 1:
  - [ ] using tweakpane for testing
    - [ ] tweakpane basics
    - [ ] positioning game objects
    - [ ] monster attacks
    - [ ] animations
  - [ ] util function for moving game objects

## Saving & Loading:
  - [ ] add game menu with option to save game
  - [ ] update menu scene with continue option to load game
  - [ ] on new game, we should reset the player data (pos, monsters, etc)

## Monster Party & Monster Detail Scenes:
  - [ ] create monster party scene
  - [ ] allow player to select a monster in the scene
  - [ ] create monster detail scene
  - [ ] connect monster detail scene to monster party scene
  - [ ] add game menu option for viewing monster party scene

## Inventory:
  - [ ] create class for items and inventory
  - [ ] create ui screen for viewing items
  - [ ] update menu to have view bag option
  - [ ] update data manager to allow saving of inventory items
  - [ ] update ui screen to allow player to use items

## Battle Scene Part 2:
  - [ ] using items
  - [ ] running away
  - [ ] enemy random attack
  - [ ] player faint
  - [ ] attacking order
  - [ ] update data manager to persist monster data and current stats
  - [ ] dynamic monster data based on player party and encounter

## Audio:
  - [ ] adding background music
  - [ ] adding battle music
  - [ ] adding attack effects
  - [ ] connecting audio options to settings

## World Scene Part 3:
  - [ ] advanced wild monster encounter logic
  - [ ] buildings
  - [ ] items in the field
  - [ ] npc event data structure
  - [ ] respawn next to npc

## Leveling & Experience:
  - [ ] review math for leveling and exp gain
  - [ ] update monseters json file and types to include exp info
  - [ ] add new assets for exp bar
  - [ ] refactor hp bar into re-usable class
  - [ ] update battle scene to display exp bar
  - [ ] update monster details scene to display exp bar
  - [ ] gain exp when battle is over
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
