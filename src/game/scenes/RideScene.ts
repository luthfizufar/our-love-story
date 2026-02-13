import Phaser from 'phaser';
import { DialogSystem } from '../systems/DialogSystem';
import { audioSystem } from '../systems/AudioSystem';

export class RideScene extends Phaser.Scene {
  private sky!: Phaser.GameObjects.TileSprite;
  private buildingsFar!: Phaser.GameObjects.TileSprite;
  private buildingsNear!: Phaser.GameObjects.TileSprite;
  private road!: Phaser.GameObjects.TileSprite;
  private dialog!: DialogSystem;
  private scrolling = true;

  constructor() { super('RideScene'); }

  create() {
    this.cameras.main.fadeIn(2000, 0, 0, 0);
    audioSystem.playBGM('ride');

    // Parallax layers
    this.sky = this.add.tileSprite(400, 100, 800, 200, 'sky_night');
    this.buildingsFar = this.add.tileSprite(400, 260, 800, 200, 'buildings_far');
    this.buildingsNear = this.add.tileSprite(400, 370, 800, 250, 'buildings_near');
    this.road = this.add.tileSprite(400, 530, 800, 150, 'road_surface');

    // Streetlights
    this.time.addEvent({
      delay: 1800,
      callback: () => {
        if (!this.scrolling) return;
        const light = this.add.image(830, 420, 'streetlight').setDepth(5);
        this.tweens.add({
          targets: light,
          x: -40,
          duration: 2500,
          onComplete: () => light.destroy(),
        });
      },
      loop: true,
    });

    // Motorcycle
    const moto = this.add.image(400, 480, 'motorcycle').setScale(2).setDepth(10);
    this.tweens.add({
      targets: moto,
      y: '+=4',
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Scene label
    this.add.text(400, 20, '🏍️ Malam yang Indah', {
      fontSize: '8px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF8BC1',
    }).setOrigin(0.5).setDepth(50);

    this.dialog = new DialogSystem(this);

    // Start dialog after a moment
    this.time.delayedCall(2500, () => {
      this.dialog.start([
        { name: 'Raina♥', text: 'Anginnya sejuk banget... hmmm...' },
        { name: 'Luthfi', text: 'Pegang yang erat ya, Raina.' },
        { name: 'Raina♥', text: 'Luthfi... aku suka momen seperti ini.' },
        { name: 'Luthfi', text: 'Aku juga. Bersama kamu, semuanya terasa sempurna.' },
        { name: 'Raina♥', text: 'Bintangnya indah malam ini... hihi.' },
        { name: 'Luthfi', text: 'Tidak seindah kamu.' },
        { name: 'Raina♥', text: 'Mulai lah tuh gombalan mautnya... tapi aku suka. Hehe.' },
        { name: 'Luthfi', text: 'Hahahaha bukan gombal, emng beneran kok.' },
        { name: 'Luthfi', text: 'Raina... ada sesuatu yang ingin aku katakan.' },
        { name: 'Raina♥', text: 'Apa itu?' },
        { name: 'Luthfi', text: 'Aku cinta kamu♥.' },
        { name: 'Raina♥', text: 'Aku cinta sama kamu juga luthfiku tersayang♥.' },
      ], () => {
        // Sparkles intensify after dialog
        this.startSparkles();
        this.time.delayedCall(3000, () => {
          this.scrolling = false;
          audioSystem.fadeOutBGM(1500);
          audioSystem.playTransitionSfx();
          this.cameras.main.fadeOut(2000, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('FinalScene');
          });
        });
      });
    });

    // Ambient stars
    this.add.particles(0, 0, 'star', {
      x: { min: 0, max: 800 },
      y: { min: 0, max: 150 },
      lifespan: 3000,
      frequency: 400,
      scale: { start: 0.8, end: 0 },
      alpha: { start: 0.6, end: 0 },
      blendMode: 'ADD',
    }).setDepth(1);
  }

  private startSparkles() {
    this.add.particles(0, 0, 'star', {
      x: { min: 0, max: 800 },
      y: { min: 0, max: 400 },
      lifespan: 2000,
      frequency: 80,
      scale: { start: 1.2, end: 0 },
      alpha: { start: 1, end: 0 },
      blendMode: 'ADD',
      tint: [0xffffff, 0xFFFF88, 0xFF8BC1, 0xFF6B96],
    }).setDepth(15);

    // Heart particles too
    this.add.particles(0, 0, 'heart', {
      x: { min: 200, max: 600 },
      y: 550,
      speedY: { min: -40, max: -20 },
      speedX: { min: -10, max: 10 },
      lifespan: 3000,
      frequency: 400,
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
    }).setDepth(15);
  }

  update() {
    this.dialog.update();
    if (this.scrolling) {
      this.sky.tilePositionX += 0.2;
      this.buildingsFar.tilePositionX += 0.6;
      this.buildingsNear.tilePositionX += 1.8;
      this.road.tilePositionX += 3.5;
    }
  }
}
