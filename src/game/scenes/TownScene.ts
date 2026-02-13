import Phaser from 'phaser';
import { DialogSystem } from '../systems/DialogSystem';
import { audioSystem } from '../systems/AudioSystem';
import { renderMap, setupInput, handleMovement, type GameInput } from '../utils/SceneHelpers';

export class TownScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private raina!: Phaser.GameObjects.Image;
  private dialog!: DialogSystem;
  private input2!: GameInput;
  private dialogStarted = false;

  constructor() { super('TownScene'); }

  create() {
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    this.cameras.main.setBackgroundColor('#1a2a10');
    audioSystem.playBGM('town');

    const map = [
      [4,2,2,2,2,3,3,2,2,2,2,4,2,2,4],
      [2,2,2,4,2,3,3,2,2,4,2,2,2,2,2],
      [2,2,2,2,2,3,3,2,2,2,2,2,2,4,2],
      [2,4,2,2,2,3,3,2,2,2,2,2,2,2,2],
      [2,2,2,2,2,3,3,2,2,4,2,2,2,2,2],
      [2,2,4,2,2,3,3,2,2,2,2,4,2,2,2],
      [2,2,2,2,2,3,3,2,2,2,2,2,2,2,4],
      [2,2,2,2,2,3,3,2,2,2,4,2,2,2,2],
      [4,2,2,4,2,3,3,2,2,2,2,2,4,2,2],
      [2,2,2,2,2,3,3,2,2,2,2,2,2,2,2],
      [2,4,2,2,2,3,3,2,2,4,2,2,2,4,2],
      [4,2,2,2,2,3,3,2,2,2,2,4,2,2,4],
    ];

    const walls = renderMap(this, map);

    // Player starts at bottom of path
    this.player = this.physics.add.sprite(5 * 32 + 32, 10 * 32 + 16, 'luthfi');
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(20, 20);
    this.physics.add.collider(this.player, walls);

    // Raina stands on the path
    this.raina = this.add.image(6 * 32, 3 * 32 + 16, 'raina');

    // Gentle glow around Raina
    const glow = this.add.graphics();
    glow.fillStyle(0xFF8BC1, 0.15);
    glow.fillCircle(6 * 32, 3 * 32 + 16, 28);
    this.tweens.add({ targets: glow, alpha: 0.3, duration: 1000, yoyo: true, repeat: -1 });

    this.physics.world.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.add.text(400, 20, '🌳 Taman Kota', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF8BC1',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);

    this.input2 = setupInput(this);
    this.dialog = new DialogSystem(this);
  }

  update() {
    this.dialog.update();
    handleMovement(this.player, this.input2, this.dialog.active);

    if (!this.dialogStarted && !this.dialog.active) {
      const dist = Phaser.Math.Distance.Between(
        this.player.x, this.player.y, this.raina.x, this.raina.y
      );
      if (dist < 55) {
        this.dialogStarted = true;
        this.dialog.start([
          { name: 'Raina♥', text: 'Luthfi! Kamu datang!' },
          { name: 'Luthfi', text: 'Sayang... tentu saja aku datang.' },
          { name: 'Raina♥', text: 'Masih ingat pertama kali kita bertemu di sini?' },
          { name: 'Luthfi', text: 'Bagaimana mungkin aku lupa? Itu adalah hari yang mengubah segalanya.' },
          { name: 'Raina♥', text: 'Hehe... kamu selalu bisa membuat aku tersenyum.' },
          { name: 'Luthfi', text: 'Karena senyummu adalah hal paling indah yang pernah aku lihat.' },
          { name: 'Raina♥', text: 'Luthfi...kamu gombal mulu sih, ayo sekarang kita ke KopiKitaku! Sudah lama kita tidak ke sana.' },
          { name: 'Luthfi', text: 'Ayo! Aku traktir americano kesukaanmu.' },
        ], () => {
          audioSystem.fadeOutBGM(1000);
          audioSystem.playTransitionSfx();
          this.cameras.main.fadeOut(1200, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CafeScene');
          });
        });
      }
    }
  }
}
