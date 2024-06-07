类pokemon游戏
## Battle System:
  - [x] load game assets
  - [x] create battle scene layout
  - [x] create dialog menu 创建对话框菜单
  - [x] create option menu
  - [x] create monster attack move list
  - [x] handle player input
  - [ ] code optimization - move logic to components
    - [x] create health component
    - [x] create background component
    - [ ] create monster components
  - [ ] adding basic attack logic
  - [ ] taking damage and monster knock out
  - [ ] battle state machine
    - [ ] what is a finite state machine
    - [ ] review the battle states and what each one represents
    - [ ] implement each state
    - [ ] add item, flee, and monster states
    - [ ] player input improvements
 - [ ] battle scene polish
    - [ ] text animations
    - [ ] monster animations
    - [ ] skip animations
    - [ ] attack animations
    - [ ] scene transitions
    - [ ] custom fonts

## World Scene:
  - [ ] load level background
  - [ ] create player
  - [ ] handle player input
  - [ ] camera movement
  - [ ] handle grid based movement
  - [ ] handle collisions
  - [ ] add wild monster encounter logic
  - [ ] store player position in data manager

## Level Development With Tiled:
  - [ ] Basic level design concepts
  - [ ] Add collision layer
  - [ ] Add custom types to Tiled
  - [ ] Add game objects
  - [ ] Add npcs
  - [ ] Exporting level images and JSON

## World Scene Part 2:
  - [ ] add interactive game objects
  - [ ] dialog ui component
  - [ ] add npcs
  - [ ] add npc dialog
  - [ ] add npc movement

## Title Screen:
  - [ ] create basic title screen
  - [ ] add options menu
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
