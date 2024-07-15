import { Background } from '../battle/background.js';
import { AttackKeys, ATTACK_KEYS } from '../battle/attacks/attack-keys.js';
import { IceShard } from '../battle/attacks/ice-shard.js';
import { Slash } from '../battle/attacks/slash.js';
import { MONSTER_ASSET_KEYS } from '../assets/asset-keys.js';
import { makeDraggable } from '../utils/draggable.js';
import { Scene } from 'phaser';
import * as TweakPane from 'tweakpane'
export class TestScene extends Scene {
  #selectedAttack:AttackKeys
  #iceShardAttack:IceShard
  #slashAttack:Slash
  #playerMonster:Phaser.GameObjects.Image
  #enemyMonster:Phaser.GameObjects.Image

  constructor() {
    super({ key: 'TestScene' });
  }

  /**
   * @returns {void}
   */
  init() {
    this.#selectedAttack = ATTACK_KEYS.SLASH;
  }

  /**
   * @returns {void}
   */
  create() {
    const background = new Background(this);
    background.showForest();

    this.#playerMonster = this.add.image(256, 316, MONSTER_ASSET_KEYS.IGUANIGNITE, 0).setFlipX(true);
    this.#enemyMonster = this.add.image(768, 144, MONSTER_ASSET_KEYS.CARNODUSK, 0).setFlipX(false);
    makeDraggable(this.#enemyMonster);

    this.#iceShardAttack = new IceShard(this, { x: 256, y: 344 });
    this.#slashAttack = new Slash(this, { x: 745, y: 140 });

    this.#addDataGui();
  }

  /**
   * @returns {void}
   */
  #addDataGui() {
    const pane = new TweakPane.Pane()
    const f1 = pane.addFolder({
      title:'Monster',
      expanded:true
    })
    const playerMonsterFolder = f1.addFolder({
      title:'Player',
      expanded:true
    })
    playerMonsterFolder.addBinding(this.#playerMonster,'x',{
      min:0,
      max:1024,
      step:1
    })
    playerMonsterFolder.addBinding(this.#playerMonster,'y',{
      min:0,
      max:576,
      step:1
    })

    const enemyMonsterFolder = f1.addFolder({
      title:'Enemy',
      expanded:true
    })

    enemyMonsterFolder.addBinding(this.#enemyMonster,'x',{
      min:0,
      max:1024,
      step:1
    })
    enemyMonsterFolder.addBinding(this.#enemyMonster,'y',{
      min:0,
      max:576,
      step:1
    })

    const f2Params = {
      attack:this.#selectedAttack,
      x:745,
      y:120
    }
    const f2 = pane.addFolder({
      title:'Attacks',
      expanded:true
    })
    f2.addBinding(f2Params,'attack',{
      options:{
        [ATTACK_KEYS.SLASH]:ATTACK_KEYS.SLASH,
        [ATTACK_KEYS.ICE_SHARD]:ATTACK_KEYS.ICE_SHARD,
      }
    }).on('change',(ev)=>{
      console.log(`change: ${ev.value}`);
      this.#selectedAttack = ev.value
      if(ev.value === ATTACK_KEYS.SLASH){
        f2Params.x = this.#slashAttack.gameObject?.x as number
        f2Params.y = this.#slashAttack.gameObject?.y as number
        f2.refresh()//更改数据后刷新
      }
      if(ev.value === ATTACK_KEYS.ICE_SHARD){
        f2Params.x = this.#iceShardAttack.gameObject?.x as number
        f2Params.y = this.#iceShardAttack.gameObject?.y as number
        f2.refresh()
      }
    })

    f2.addBinding(f2Params,'x',{
      min:0,
      max:1024,
      step:1
    }).on('change',(ev)=>{
      console.log(`change: ${ev.value}`);
      this.#updateAttackGameObjectPosition('x',ev.value)
    })
    f2.addBinding(f2Params,'y',{
      min:0,
      max:576,
      step:1
    }).on('change',(ev)=>{
      console.log(`change: ${ev.value}`);
      this.#updateAttackGameObjectPosition('y',ev.value)
    })

    const playAttackButton = f2.addButton({
      title:'Play'
    })
    playAttackButton.on('click',()=>{
      if(this.#selectedAttack === ATTACK_KEYS.SLASH){
        this.#slashAttack.playAnimation()
        return
      }
      if(this.#selectedAttack === ATTACK_KEYS.ICE_SHARD){
        this.#iceShardAttack.playAnimation()
        return
      }
    })

  }

  /**
   * @param {'x' | 'y'} param
   * @param {number} value
   * @returns {void}
   */
  #updateAttackGameObjectPosition(param, value) {
    if (param === 'x') {
      if (this.#selectedAttack === ATTACK_KEYS.SLASH) {
        this.#slashAttack.gameObject.setX(value);
        return;
      }
      if (this.#selectedAttack === ATTACK_KEYS.ICE_SHARD) {
        this.#iceShardAttack.gameObject.setX(value);
        return;
      }
    }
    if (this.#selectedAttack === ATTACK_KEYS.SLASH) {
      this.#slashAttack.gameObject.setY(value);
      return;
    }
    if (this.#selectedAttack === ATTACK_KEYS.ICE_SHARD) {
      this.#iceShardAttack.gameObject.setY(value);
      return;
    }
  }
}
