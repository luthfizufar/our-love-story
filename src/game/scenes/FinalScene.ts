import Phaser from 'phaser';
import { DialogSystem } from '../systems/DialogSystem';
import { audioSystem } from '../systems/AudioSystem';

export class FinalScene extends Phaser.Scene {
  private dialog!: DialogSystem;

  constructor() { super('FinalScene'); }

  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    audioSystem.playBGM('final');

    const ensureBGMOnFirstTap = () => {
      audioSystem.unlock().then(() => audioSystem.playBGM('final'));
      this.input.off('pointerdown', ensureBGMOnFirstTap);
      this.input.keyboard?.off('keydown', ensureBGMOnFirstTap);
    };
    this.input.once('pointerdown', ensureBGMOnFirstTap);
    this.input.keyboard?.once('keydown', ensureBGMOnFirstTap);

    // Night background with gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0020, 0x0a0020, 0x150008, 0x150008);
    bg.fillRect(0, 0, 800, 600);

    // Stars in background
    this.add.particles(0, 0, 'star', {
      x: { min: 0, max: 800 },
      y: { min: 0, max: 300 },
      lifespan: 4000,
      frequency: 300,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.7, end: 0.1 },
      blendMode: 'ADD',
    });

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x1a1a2e);
    ground.fillRect(0, 450, 800, 150);
    ground.fillStyle(0x222244);
    ground.fillRect(0, 448, 800, 4);

    // Characters facing each other
    const luthfi = this.add.image(340, 410, 'luthfi').setScale(3);
    const raina = this.add.image(460, 410, 'raina').setScale(3).setFlipX(true);

    // Romantic glow between them
    const glow = this.add.graphics();
    glow.fillStyle(0xFF3354, 0.08);
    glow.fillCircle(400, 420, 80);
    this.tweens.add({ targets: glow, alpha: 0.2, duration: 1500, yoyo: true, repeat: -1 });

    this.dialog = new DialogSystem(this);

    this.time.delayedCall(1500, () => {
      this.dialog.start([
        { name: 'Luthfi', text: 'Raina... sayang...' },
        { name: 'Raina♥', text: 'Ya, Luthfi?' },
        { name: 'Luthfi', text: 'Sejak pertama kali bertemu, hidupku tidak pernah sama lagi.' },
        { name: 'Luthfi', text: 'Kamu adalah alasan aku tersenyum setiap pagi.' },
        { name: 'Luthfi', text: 'Kamu adalah rumah yang selalu ingin aku pulang.' },
        { name: 'Luthfi', text: 'Kamu adalah bintang paling terang di langit malamku.' },
        { name: 'Raina♥', text: 'Luthfi...' },
        { name: 'Luthfi', text: 'Maukah kamu... tetap bersamaku selamanya?' },
      ], () => {
        this.dialog.hide();
        // Emit event to React for choice overlay
        this.game.events.emit('show-choice');
      });
    });

    // Listen for choice response from React
    this.game.events.on('choice-made', () => {
      this.dialog.start([
        { name: 'Raina♥', text: '...' },
        { name: 'Raina♥', text: 'Luthfi, kamu tahu jawabannya...' },
        { name: 'Raina♥', text: 'Aku juga ingin bersamamu selamanya. ♥' },
        { name: 'Luthfi', text: 'Raina♥... terima kasih. Aku mencintaimu.' },
      ], () => {
        this.dialog.hide();
        // Heart burst
        this.add.particles(400, 400, 'heart', {
          speed: { min: 50, max: 150 },
          lifespan: 3000,
          quantity: 30,
          scale: { start: 1, end: 0 },
          alpha: { start: 1, end: 0 },
          emitting: false,
        }).explode(30, 400, 400);

        this.time.delayedCall(2000, () => {
          this.cameras.main.fadeOut(2000, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.game.events.emit('show-letter');
          });
        });
      });
    });
  }

  update() {
    this.dialog.update();
  }
}
