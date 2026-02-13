import Phaser from 'phaser';
import { DialogSystem } from '../systems/DialogSystem';
import { audioSystem } from '../systems/AudioSystem';
import { renderMap, setupInput, handleMovement, type GameInput } from '../utils/SceneHelpers';

export class HomeScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private dialog!: DialogSystem;
  private input2!: GameInput;

  constructor() { super('HomeScene'); }

  create() {
    this.cameras.main.fadeIn(1500, 0, 0, 0);
    this.cameras.main.setBackgroundColor('#1a0a05');
    audioSystem.playBGM('home');

    // 15x12 room map
    const map = [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,5,5,0,0,0,0,0,0,0,5,5,0,1],
      [1,0,5,5,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,5,0,0,0,0,0,0,0,0,0,5,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,1,1,1,0,0,0,1,1,1,1,1,1],
      [1,1,1,1,1,1,9,9,9,1,1,1,1,1,1],
    ];

    const walls = renderMap(this, map);

    this.player = this.physics.add.sprite(7 * 32 + 16, 6 * 32 + 16, 'luthfi');
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(20, 20);
    this.physics.add.collider(this.player, walls);

    this.physics.world.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Scene label
    this.add.text(400, 20, '🏠 Rumah Luthfi', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF8BC1',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

    this.input2 = setupInput(this);
    this.dialog = new DialogSystem(this);

    this.time.delayedCall(1500, () => {
      this.dialog.start([
        { name: 'Luthfi', text: 'Setiap perjalanan besar dimulai dari langkah kecil...' },
        { name: 'Luthfi', text: 'Hari ini akan menjadi hari yang istimewa.' },
        { name: 'Luthfi', text: 'Aku harus pergi menemuinya... menemui Raina♥.' },
        { name: 'Luthfi', text: 'Dia pasti sudah menunggu di luar.' },
      ], () => {
        audioSystem.fadeOutBGM(1000);
        audioSystem.playTransitionSfx();
        this.cameras.main.fadeOut(1200, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('TownScene');
        });
      });
    });
  }

  update() {
    this.dialog.update();
    handleMovement(this.player, this.input2, this.dialog.active);
  }
}
