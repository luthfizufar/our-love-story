import Phaser from 'phaser';

const TILE = 32;

const COLORS: Record<number, number> = {
  0: 0x8B7355,  // wood floor
  1: 0x4A3728,  // wall
  2: 0x3D8B37,  // grass
  3: 0xC4B590,  // path/dirt
  4: 0x1B5E20,  // tree
  5: 0x5D4037,  // furniture
  6: 0xD7CCC8,  // cafe floor
  7: 0x6D4C41,  // cafe wall
  8: 0x4E342E,  // counter
  9: 0x795548,  // door marker (non-solid, visual)
};

const SOLID = new Set([1, 4, 5, 7, 8]);

export function renderMap(scene: Phaser.Scene, map: number[][]): Phaser.Physics.Arcade.StaticGroup {
  const walls = scene.physics.add.staticGroup();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const t = map[y][x];
      const px = x * TILE + TILE / 2;
      const py = y * TILE + TILE / 2;
      const color = COLORS[t] ?? 0x333333;

      if (SOLID.has(t)) {
        const w = walls.create(px, py, 'tile') as Phaser.Physics.Arcade.Image;
        w.setTint(color);
        (w.body as Phaser.Physics.Arcade.StaticBody).setSize(TILE, TILE);
        w.refreshBody();
      } else {
        scene.add.image(px, py, 'tile').setTint(color);
      }
    }
  }
  return walls;
}

export interface GameInput {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd: Record<string, Phaser.Input.Keyboard.Key>;
  // Optional virtual/touch controls for mobile
  virtual?: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
  };
}

export function setupInput(scene: Phaser.Scene): GameInput {
  const input: GameInput = {
    cursors: scene.input.keyboard!.createCursorKeys(),
    wasd: {
      up: scene.input.keyboard!.addKey('W'),
      down: scene.input.keyboard!.addKey('S'),
      left: scene.input.keyboard!.addKey('A'),
      right: scene.input.keyboard!.addKey('D'),
    },
  };

  // Simple heuristic: if layar lebih kecil (portrait / mobile),
  // tambahkan tombol virtual di layar untuk kontrol sentuh.
  const width = scene.scale.width;
  const height = scene.scale.height;
  const isMobileLike = width < 720 || height > width;

  if (isMobileLike) {
    const virtualState = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    input.virtual = virtualState;

    // Izinkan multi-touch (lebih dari 1 pointer)
    scene.input.addPointer(1);

    const buttonSize = Math.min(width, height) * 0.12;
    const margin = 16;
    const bottomY = height - buttonSize / 2 - margin;

    // Helper untuk membuat tombol transparan dengan label
    const createButton = (
      x: number,
      y: number,
      label: string,
      dir: keyof typeof virtualState,
    ) => {
      const rect = scene.add
        .rectangle(x, y, buttonSize, buttonSize, 0x000000, 0.3)
        .setScrollFactor(0)
        .setDepth(100)
        .setInteractive({ useHandCursor: true });

      scene.add
        .text(x, y, label, {
          fontSize: `${Math.max(10, buttonSize * 0.4)}px`,
          fontFamily: '"Press Start 2P", monospace',
          color: '#FFFFFF',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(101);

      const setDown = (down: boolean) => {
        virtualState[dir] = down;
      };

      rect.on('pointerdown', () => setDown(true));
      rect.on('pointerup', () => setDown(false));
      rect.on('pointerout', () => setDown(false));
      rect.on('pointerupoutside', () => setDown(false));
    };

    // D-pad kiri bawah
    const leftCenterX = margin + buttonSize * 1.5;
    const leftCenterY = bottomY;

    createButton(leftCenterX, leftCenterY, '⬆', 'up');
    createButton(leftCenterX, leftCenterY + buttonSize + 8, '⬇', 'down');
    createButton(leftCenterX - buttonSize - 8, leftCenterY + (buttonSize + 8) / 2, '⬅', 'left');
    createButton(leftCenterX + buttonSize + 8, leftCenterY + (buttonSize + 8) / 2, '➡', 'right');
  }

  return input;
}

export function handleMovement(
  player: Phaser.Physics.Arcade.Sprite,
  input: GameInput,
  dialogActive: boolean,
) {
  if (dialogActive) {
    player.setVelocity(0, 0);
    return;
  }
  const speed = 130;
  let vx = 0;
  let vy = 0;

  const v = input.virtual;

  if (input.cursors.left.isDown || input.wasd.left.isDown || v?.left) vx = -speed;
  else if (input.cursors.right.isDown || input.wasd.right.isDown || v?.right) vx = speed;

  if (input.cursors.up.isDown || input.wasd.up.isDown || v?.up) vy = -speed;
  else if (input.cursors.down.isDown || input.wasd.down.isDown || v?.down) vy = speed;

  player.setVelocity(vx, vy);
}
