import Phaser from 'phaser';
import { audioSystem } from './AudioSystem';

export interface DialogEntry {
  name: string;
  text: string;
}

export class DialogSystem {
  private scene: Phaser.Scene;
  private bg: Phaser.GameObjects.Graphics;
  private nameText: Phaser.GameObjects.Text;
  private bodyText: Phaser.GameObjects.Text;
  private promptText: Phaser.GameObjects.Text;
  private queue: DialogEntry[] = [];
  private currentIndex = 0;
  private fullText = '';
  private displayedText = '';
  private charIndex = 0;
  private typingTimer?: Phaser.Time.TimerEvent;
  private isTyping = false;
  private _active = false;
  private onComplete?: () => void;
  private spaceKey: Phaser.Input.Keyboard.Key | null;
  private container: Phaser.GameObjects.Container;
  private clickZone: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const w = 800;
    const h = 600;
    const boxH = 140;
    const boxY = h - boxH - 10;
    const boxX = 10;
    const boxW = w - 20;

    this.bg = scene.add.graphics();
    this.bg.fillStyle(0x1a0005, 0.93);
    this.bg.fillRoundedRect(boxX, boxY, boxW, boxH, 8);
    this.bg.lineStyle(3, 0xC00000, 1);
    this.bg.strokeRoundedRect(boxX, boxY, boxW, boxH, 8);
    this.bg.lineStyle(1, 0xFF3354, 0.5);
    this.bg.strokeRoundedRect(boxX + 3, boxY + 3, boxW - 6, boxH - 6, 6);

    this.nameText = scene.add.text(boxX + 16, boxY + 12, '', {
      fontSize: '14px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FF3354',
    });

    this.bodyText = scene.add.text(boxX + 16, boxY + 38, '', {
      fontSize: '11px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#FFD5E0',
      wordWrap: { width: boxW - 40 },
      lineSpacing: 10,
    });

    this.promptText = scene.add.text(boxX + boxW - 30, boxY + boxH - 22, '▼', {
      fontSize: '12px',
      fontFamily: 'monospace',
      color: '#FF6B96',
    });

    scene.tweens.add({
      targets: this.promptText,
      alpha: 0,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    this.clickZone = scene.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0);
    this.clickZone.setInteractive({ useHandCursor: true });
    this.clickZone.on('pointerdown', () => this.handleAdvance());

    this.container = scene.add.container(0, 0, [
      this.bg, this.nameText, this.bodyText, this.promptText, this.clickZone,
    ]);
    this.container.setDepth(100);
    this.container.setScrollFactor(0);
    this.container.setVisible(false);

    this.spaceKey = scene.input.keyboard
      ? scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
      : null;
  }

  start(entries: DialogEntry[], onComplete?: () => void) {
    this.queue = entries;
    this.currentIndex = 0;
    this.onComplete = onComplete;
    this._active = true;
    this.container.setVisible(true);
    this.scene.game.registry.set('dialogAdvance', () => this.handleAdvance());
    this.scene.game.events.emit('dialog-active');
    this.showEntry();
  }

  private showEntry() {
    if (this.currentIndex >= this.queue.length) {
      this.hide();
      this.onComplete?.();
      return;
    }
    const entry = this.queue[this.currentIndex];
    this.nameText.setText(entry.name);
    this.fullText = entry.text;
    this.displayedText = '';
    this.charIndex = 0;
    this.bodyText.setText('');
    this.isTyping = true;
    this.promptText.setVisible(false);

    this.typingTimer = this.scene.time.addEvent({
      delay: 30,
      callback: () => {
        if (this.charIndex < this.fullText.length) {
          this.displayedText += this.fullText[this.charIndex];
          this.bodyText.setText(this.displayedText);
          this.charIndex++;
          if (this.charIndex % 2 === 0) audioSystem.playTypeSfx();
        }
        if (this.charIndex >= this.fullText.length) {
          this.isTyping = false;
          this.promptText.setVisible(true);
          this.typingTimer?.destroy();
        }
      },
      loop: true,
    });
  }

  private skipTyping() {
    this.typingTimer?.destroy();
    this.displayedText = this.fullText;
    this.bodyText.setText(this.displayedText);
    this.isTyping = false;
    this.promptText.setVisible(true);
  }

  private handleAdvance() {
    if (!this._active) return;
    if (this.isTyping) {
      this.skipTyping();
    } else {
      audioSystem.playAdvanceSfx();
      this.currentIndex++;
      this.showEntry();
    }
  }

  update() {
    if (!this._active) return;
    if (this.spaceKey && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.handleAdvance();
    }
  }

  hide() {
    this._active = false;
    this.container.setVisible(false);
    this.typingTimer?.destroy();
    this.scene.game.registry.remove('dialogAdvance');
    this.scene.game.events.emit('dialog-inactive');
  }

  get active() {
    return this._active;
  }
}
