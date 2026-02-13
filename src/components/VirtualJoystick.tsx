import { useEffect, useMemo, useRef, useState } from 'react';

export type VirtualJoystickAxis = { x: number; y: number };

interface VirtualJoystickProps {
  visible: boolean;
  onChange: (axis: VirtualJoystickAxis) => void;
  sizePx?: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function VirtualJoystick({ visible, onChange, sizePx }: VirtualJoystickProps) {
  const baseRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 }); // px offset from center

  const size = useMemo(() => sizePx ?? 128, [sizePx]);
  const radius = size * 0.38;
  const knobSize = Math.round(size * 0.45);

  useEffect(() => {
    if (!visible) {
      draggingRef.current = false;
      pointerIdRef.current = null;
      setKnob({ x: 0, y: 0 });
      onChange({ x: 0, y: 0 });
    }
  }, [visible, onChange]);

  if (!visible) return null;

  const updateFromClientPoint = (clientX: number, clientY: number) => {
    const el = baseRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = clientX - cx;
    const dy = clientY - cy;
    const len = Math.hypot(dx, dy);
    const max = radius;
    const scale = len > max && len > 0 ? max / len : 1;
    const kx = dx * scale;
    const ky = dy * scale;

    setKnob({ x: kx, y: ky });
    onChange({ x: clamp(kx / max, -1, 1), y: clamp(ky / max, -1, 1) });
  };

  const onPointerDown: React.PointerEventHandler<HTMLDivElement> = (e) => {
    draggingRef.current = true;
    pointerIdRef.current = e.pointerId;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    updateFromClientPoint(e.clientX, e.clientY);
  };

  const onPointerMove: React.PointerEventHandler<HTMLDivElement> = (e) => {
    if (!draggingRef.current) return;
    if (pointerIdRef.current !== null && e.pointerId !== pointerIdRef.current) return;
    updateFromClientPoint(e.clientX, e.clientY);
  };

  const endDrag = () => {
    draggingRef.current = false;
    pointerIdRef.current = null;
    setKnob({ x: 0, y: 0 });
    onChange({ x: 0, y: 0 });
  };

  const onPointerUp: React.PointerEventHandler<HTMLDivElement> = () => endDrag();
  const onPointerCancel: React.PointerEventHandler<HTMLDivElement> = () => endDrag();

  return (
    <div
      className="absolute left-6 bottom-6 z-40 select-none"
      style={{ touchAction: 'none' }}
    >
      <div
        ref={baseRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          width: size,
          height: size,
          borderRadius: '9999px',
          background: 'rgba(0,0,0,0.25)',
          border: '1px solid rgba(255, 107, 150, 0.35)',
          boxShadow: '0 0 24px rgba(255, 51, 84, 0.25)',
          position: 'relative',
        }}
        aria-label="Virtual joystick"
        role="application"
      >
        <div
          style={{
            width: knobSize,
            height: knobSize,
            borderRadius: '9999px',
            background: 'rgba(255, 139, 193, 0.35)',
            border: '1px solid rgba(255, 139, 193, 0.55)',
            boxShadow: '0 0 18px rgba(255, 139, 193, 0.35)',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
          }}
        />
      </div>
    </div>
  );
}

