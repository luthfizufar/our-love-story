import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.generateTextures();
    this.showTitle();
  }

  private generateTextures() {
    // Base tile
    let g = this.add.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(0, 0, 32, 32);
    g.generateTexture('tile', 32, 32);
    g.destroy();

    // Characters
    this.createCharacter('luthfi', 0x1a1a2e, 0xd4a574, 0x16213e, 0x0f3460);
    this.createCharacter('raina', 0x3d2914, 0xf5d5c8, 0xfff0f0, 0xffb6c1);

    // Heart
    g = this.add.graphics();
    g.fillStyle(0xFF3354);
    g.fillCircle(5, 5, 5);
    g.fillCircle(13, 5, 5);
    g.fillTriangle(0, 7, 9, 18, 18, 7);
    g.generateTexture('heart', 18, 18);
    g.destroy();

    // Star
    g = this.add.graphics();
    g.fillStyle(0xffffff);
    g.fillRect(1, 0, 2, 4);
    g.fillRect(0, 1, 4, 2);
    g.generateTexture('star', 4, 4);
    g.destroy();

    // Motorcycle with riders
    g = this.add.graphics();
    g.fillStyle(0x333333);
    g.fillRect(12, 28, 48, 10);
    g.fillStyle(0x222222);
    g.fillCircle(18, 42, 8);
    g.fillCircle(52, 42, 8);
    g.fillStyle(0x555555);
    g.fillCircle(18, 42, 4);
    g.fillCircle(52, 42, 4);
    g.fillStyle(0xFFCC00);
    g.fillRect(58, 26, 4, 6);
    // Luthfi (front rider)
    g.fillStyle(0x16213e);
    g.fillRect(38, 12, 12, 16);
    g.fillStyle(0xd4a574);
    g.fillRect(40, 6, 8, 8);
    g.fillStyle(0x1a1a2e);
    g.fillRect(40, 4, 8, 4);
    // Raina (back rider)
    g.fillStyle(0xfff0f0);
    g.fillRect(22, 12, 12, 16);
    g.fillStyle(0xf5d5c8);
    g.fillRect(24, 6, 8, 8);
    g.fillStyle(0x3d2914);
    g.fillRect(24, 4, 8, 4);
    g.generateTexture('motorcycle', 72, 52);
    g.destroy();

    // Parallax sky
    g = this.add.graphics();
    g.fillStyle(0x0a0a2e);
    g.fillRect(0, 0, 256, 200);
    g.fillStyle(0x0f0f3a);
    g.fillRect(0, 100, 256, 100);
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * 0.8 + 0.2;
      g.fillStyle(0xffffff, a);
      const s = Math.random() > 0.8 ? 3 : 2;
      g.fillRect(Math.floor(Math.random() * 254), Math.floor(Math.random() * 180), s, s);
    }
    g.generateTexture('sky_night', 256, 200);
    g.destroy();

    // Far buildings
    g = this.add.graphics();
    g.fillStyle(0x0a0a20, 0);
    g.fillRect(0, 0, 256, 200);
    const farShapes = [[5, 50, 35, 150], [50, 30, 30, 170], [90, 60, 40, 140],
      [140, 40, 28, 160], [178, 55, 35, 145], [222, 35, 34, 165]];
    for (const [bx, by, bw, bh] of farShapes) {
      g.fillStyle(0x101030);
      g.fillRect(bx, by, bw, bh);
      g.fillStyle(0xFFFF66, 0.25);
      for (let wy = by + 8; wy < by + bh - 8; wy += 14) {
        for (let wx = bx + 4; wx < bx + bw - 4; wx += 10) {
          if (Math.random() > 0.5) g.fillRect(wx, wy, 4, 6);
        }
      }
    }
    g.generateTexture('buildings_far', 256, 200);
    g.destroy();

    // Near buildings
    g = this.add.graphics();
    g.fillStyle(0x000000, 0);
    g.fillRect(0, 0, 256, 250);
    const nearShapes = [[0, 40, 55, 210], [65, 20, 45, 230], [120, 55, 50, 195],
      [180, 30, 40, 220], [228, 50, 28, 200]];
    for (const [bx, by, bw, bh] of nearShapes) {
      g.fillStyle(0x080818);
      g.fillRect(bx, by, bw, bh);
      g.fillStyle(0xFFAA00, 0.4);
      for (let wy = by + 12; wy < by + bh - 12; wy += 18) {
        for (let wx = bx + 6; wx < bx + bw - 6; wx += 12) {
          if (Math.random() > 0.35) g.fillRect(wx, wy, 5, 7);
        }
      }
    }
    g.generateTexture('buildings_near', 256, 250);
    g.destroy();

    // Road
    g = this.add.graphics();
    g.fillStyle(0x2a2a2a);
    g.fillRect(0, 0, 256, 150);
    g.fillStyle(0x444444);
    g.fillRect(0, 0, 256, 12);
    g.fillStyle(0xffffff, 0.4);
    for (let x = 0; x < 256; x += 40) {
      g.fillRect(x, 68, 20, 3);
    }
    g.generateTexture('road_surface', 256, 150);
    g.destroy();

    // Streetlight
    g = this.add.graphics();
    g.fillStyle(0x888888);
    g.fillRect(4, 8, 2, 56);
    g.fillStyle(0xFFFF88);
    g.fillCircle(5, 6, 5);
    g.fillStyle(0xFFFF44, 0.3);
    g.fillCircle(5, 6, 12);
    g.generateTexture('streetlight', 24, 64);
    g.destroy();
  }

  private createCharacter(key: string, hair: number, skin: number, shirt: number, pants: number) {
    const g = this.add.graphics();
    g.fillStyle(hair);
    g.fillRect(10, 2, 12, 6);
    g.fillStyle(skin);
    g.fillRect(11, 7, 10, 8);
    g.fillStyle(0x222222);
    g.fillRect(13, 9, 2, 2);
    g.fillRect(17, 9, 2, 2);
    g.fillStyle(shirt);
    g.fillRect(8, 15, 16, 9);
    g.fillRect(5, 16, 3, 7);
    g.fillRect(24, 16, 3, 7);
    g.fillStyle(pants);
    g.fillRect(10, 24, 5, 6);
    g.fillRect(17, 24, 5, 6);
    g.fillStyle(0x222222);
    g.fillRect(9, 30, 6, 2);
    g.fillRect(17, 30, 6, 2);
    g.generateTexture(key, 32, 32);
    g.destroy();
  }

  private showTitle() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0005, 0x1a0005, 0x0a0000, 0x0a0000);
    bg.fillRect(0, 0, 800, 600);

    const title = this.add.text(400, 180, 'Our Love: Looking back', {
      fontSize: '26px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF3354',
      stroke: '#600000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    const sub = this.add.text(400, 230, 'A Valentine Web Story', {
      fontSize: '11px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF8BC1',
    }).setOrigin(0.5);

    const dedication = this.add.text(400, 290, '~ Dibuat khusus untuk Raina♥ ~', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF6B96',
    }).setOrigin(0.5);

    const prompt = this.add.text(400, 420, 'Klik/Tap/Tekan SPACE untuk memulai', {
      fontSize: '10px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF6B96',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.2,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    this.add.particles(0, 0, 'heart', {
      x: { min: 50, max: 750 },
      y: 620,
      speedY: { min: -50, max: -25 },
      speedX: { min: -15, max: 15 },
      lifespan: 5000,
      frequency: 600,
      scale: { start: 0.6, end: 0 },
      alpha: { start: 0.7, end: 0 },
      rotate: { min: -30, max: 30 },
    });

    const startGame = () => {
      audioSystem.unlock().then(() => {
        audioSystem.playBGM('boot');
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          audioSystem.fadeOutBGM(500);
          audioSystem.playTransitionSfx();
          this.scene.start('HomeScene');
        });
      });
    };
    if (this.input.keyboard) {
      this.input.keyboard.once('keydown-SPACE', startGame);
    }
    const hitZone = this.add.rectangle(400, 300, 800, 600, 0x000000, 0);
    hitZone.setInteractive({ useHandCursor: true });
    hitZone.once('pointerdown', startGame);
  }
}

