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
    /**
     * Analog axis from on-screen joystick (range -1..1).
     * x: -1 left, +1 right
     * y: -1 up, +1 down
     */
    axis?: { x: number; y: number };
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

  // Virtual input state that can be driven by an on-screen joystick (React overlay).
  // Scenes subscribe to global game events so the joystick works across scene transitions.
  const virtualState: NonNullable<GameInput['virtual']> = {
    up: false,
    down: false,
    left: false,
    right: false,
    axis: { x: 0, y: 0 },
  };
  input.virtual = virtualState;

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const AXIS_TO_DIGITAL_THRESHOLD = 0.35;

  const onJoystick = (payload: unknown) => {
    const p = payload as { x?: unknown; y?: unknown } | null | undefined;
    const x = typeof p?.x === 'number' ? p.x : 0;
    const y = typeof p?.y === 'number' ? p.y : 0;

    const cx = clamp(x, -1, 1);
    const cy = clamp(y, -1, 1);
    virtualState.axis = { x: cx, y: cy };

    virtualState.left = cx < -AXIS_TO_DIGITAL_THRESHOLD;
    virtualState.right = cx > AXIS_TO_DIGITAL_THRESHOLD;
    virtualState.up = cy < -AXIS_TO_DIGITAL_THRESHOLD;
    virtualState.down = cy > AXIS_TO_DIGITAL_THRESHOLD;
  };

  scene.game.events.on('virtual-joystick', onJoystick);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
    scene.game.events.off('virtual-joystick', onJoystick);
  });

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
  const axis = v?.axis;

  // Prefer analog axis if joystick is being used.
  if (axis) {
    const ax = axis.x ?? 0;
    const ay = axis.y ?? 0;
    const deadzone = 0.18;
    if (Math.abs(ax) > deadzone || Math.abs(ay) > deadzone) {
      // Clamp magnitude so diagonal doesn't exceed 1.0
      const len = Math.hypot(ax, ay);
      const nx = len > 1 ? ax / len : ax;
      const ny = len > 1 ? ay / len : ay;
      player.setVelocity(nx * speed, ny * speed);
      return;
    }
  }

  if (input.cursors.left.isDown || input.wasd.left.isDown || v?.left) vx = -speed;
  else if (input.cursors.right.isDown || input.wasd.right.isDown || v?.right) vx = speed;

  if (input.cursors.up.isDown || input.wasd.up.isDown || v?.up) vy = -speed;
  else if (input.cursors.down.isDown || input.wasd.down.isDown || v?.down) vy = speed;

  player.setVelocity(vx, vy);
}
