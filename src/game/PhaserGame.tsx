import { useEffect, useRef, useState, useCallback } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './config';
import { audioSystem } from './systems/AudioSystem';
import LoveLetter from '@/components/LoveLetter';

const PhaserGame = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showChoice, setShowChoice] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      ...gameConfig,
      parent: containerRef.current,
    };
    const game = new Phaser.Game(config);
    gameRef.current = game;

    game.events.on('show-choice', () => setShowChoice(true));
    game.events.on('show-letter', () => {
      setShowChoice(false);
      setShowLetter(true);
    });

    return () => {
      game.events.off('show-choice');
      game.events.off('show-letter');
      game.events.off('choice-made');
      audioSystem.destroy();
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const handleChoice = useCallback(() => {
    setShowChoice(false);
    gameRef.current?.events.emit('choice-made');
  }, []);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0000 0%, #1a0005 100%)' }}>
      <div ref={containerRef} className="relative" />
      {showChoice && <ChoiceOverlay onChoose={handleChoice} />}
      {showLetter && <LoveLetter />}
    </div>
  );
};

interface ChoiceOverlayProps {
  onChoose: () => void;
}

const ChoiceOverlay = ({ onChoose }: ChoiceOverlayProps) => {
  const [dodgePos, setDodgePos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);

  const handleDodge = () => {
    const angle = Math.random() * Math.PI * 2;
    const dist = 100 + Math.random() * 150;
    setDodgePos({
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
    });
    setDodgeCount(prev => prev + 1);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(10, 0, 5, 0.75)' }}>
      <p className="mb-8 text-lg animate-pulse"
        style={{ color: '#FF8BC1', fontFamily: '"Press Start 2P", monospace', fontSize: '12px' }}>
        {dodgeCount > 3 ? 'Kamu yakin tidak mau? 😏' : 'Pilih jawabanmu...'}
      </p>

      <button
        onClick={onChoose}
        className="px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-110 mb-6"
        style={{
          background: 'linear-gradient(135deg, #C00000, #FF3354)',
          color: '#fff',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '11px',
          border: '2px solid #FF6B96',
          boxShadow: '0 0 30px rgba(255, 51, 84, 0.5)',
        }}
      >
        Stay with me forever ♥
      </button>

      <button
        onMouseEnter={handleDodge}
        onTouchStart={handleDodge}
        className="px-6 py-3 rounded-lg transition-all duration-300"
        style={{
          transform: `translate(${dodgePos.x}px, ${dodgePos.y}px)`,
          background: 'rgba(255, 107, 150, 0.2)',
          color: '#FF8BC1',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '9px',
          border: '1px solid rgba(255, 107, 150, 0.4)',
        }}
      >
        Hmm, lemmeting... 🤔🤭
      </button>
    </div>
  );
};

export default PhaserGame;
