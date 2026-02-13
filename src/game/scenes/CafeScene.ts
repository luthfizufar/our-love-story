import Phaser from 'phaser';
import { DialogSystem } from '../systems/DialogSystem';
import { audioSystem } from '../systems/AudioSystem';
import { renderMap, setupInput, handleMovement, type GameInput } from '../utils/SceneHelpers';

export class CafeScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private raina!: Phaser.GameObjects.Image;
  private dialog!: DialogSystem;
  private input2!: GameInput;
  private dialogStarted = false;

  constructor() { super('CafeScene'); }

  create() {
    this.cameras.main.fadeIn(1200, 0, 0, 0);
    this.cameras.main.setBackgroundColor('#1a0f0a');
    audioSystem.playBGM('cafe');

    // Cafe interior: 6=cafe floor, 7=cafe wall, 8=counter, 5=table
    const map = [
      [7,7,7,7,7,7,7,7,7,7,7,7,7,7,7],
      [7,8,8,8,8,8,8,8,8,8,8,8,8,8,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,6,5,6,6,5,6,6,5,6,6,5,6,6,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,6,5,6,6,5,6,6,5,6,6,5,6,6,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,6,6,6,6,6,6,6,6,6,6,6,6,6,7],
      [7,7,7,7,7,6,6,6,6,6,7,7,7,7,7],
      [7,7,7,7,7,6,6,6,6,6,7,7,7,7,7],
    ];

    const walls = renderMap(this, map);

    // Cafe sign
    this.add.text(7 * 32 + 16, 1 * 32 + 8, '☕ KopiKitaku', {
      fontSize: '9px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FFD5A0',
    }).setOrigin(0.5).setDepth(10);

    // Player at door
    this.player = this.physics.add.sprite(7 * 32 + 16, 10 * 32, 'luthfi');
    this.player.setCollideWorldBounds(true);
    this.player.body!.setSize(20, 20);
    this.physics.add.collider(this.player, walls);

    // Raina at a table
    this.raina = this.add.image(5 * 32 + 16, 6 * 32 + 16, 'raina');

    const glow = this.add.graphics();
    glow.fillStyle(0xFF8BC1, 0.12);
    glow.fillCircle(5 * 32 + 16, 6 * 32 + 16, 24);
    this.tweens.add({ targets: glow, alpha: 0.25, duration: 1200, yoyo: true, repeat: -1 });

    this.physics.world.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.setBounds(0, 0, 15 * 32, 12 * 32);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.add.text(400, 20, '☕ Café KopiKitaku', {
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
          { name: 'Raina♥', text: 'KopiKitaku... tempat first date kita.' },
          { name: 'Raina♥', text: 'Aku masih ingat kamu membuatkan aku makanan dan membawanya ke tempat ini untuk kita makan berdua, kamu membawakan aku tahu, siomay dan pangsit hihi.' },
          { name: 'Luthfi', text: 'Hahaha kamu masih ingat yah sayang, aku masih ingat kamu menceritakan semua hal yang kamu alami pada masa ospek dengan sangat antusias.' },
          { name: 'Raina♥', text: 'Dan kamu terlalu gugup sampai kamu ga berani liat aku! Hahaha.' },
          { name: 'Luthfi', text: 'H-hei! Itu karena aku duku terlalu culun, tapi aku terlalu fokus sama kamu yang sangat baik padaku dan aku mulai merasa suka padamu...' },
          { name: 'Raina♥', text: 'hihi kamu sekarang lebih tenang yah sama aku' },
          { name: 'Luthfi', text: 'Kamu pun dulu terlihat  malu malu ah, saat bertatapan sama aku, ngaku aja deh hahaha.' },
          { name: 'Raina♥', text: 'ihhh... diamm... huft...' },
          { name: 'Luthfi', text: 'hiihiiii....' },
          { name: 'Luthfi', text: '....' },
          { name: 'Luthfi', text: 'Raina, terima kasih sudah menjadi bagian terindah dalam hidupku.' },
          { name: 'Raina♥', text: 'Luthfi... aku juga berterima kasih, kamu hadir di hidupku.' },
          { name: 'Luthfi', text: 'Mau jalan-jalan malam? Aku bawa keliling kota Bandung pake motor, kamu pake jaket aku yah biat ga kedinginan :).' },
          { name: 'Raina♥', text: 'Ayoooo! Aku suka jalan jalan malam sama kamu.' },
        ], () => {
          audioSystem.fadeOutBGM(1200);
          audioSystem.playTransitionSfx();
          this.cameras.main.fadeOut(1500, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('RideScene');
          });
        });
      }
    }
  }
}
