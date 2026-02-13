import { useEffect, useState } from 'react';

const HEARTS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
  size: 12 + Math.random() * 16,
}));

const LoveLetter = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: 'rgba(10, 0, 3, 0.92)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 2s ease-in',
      }}
    >
      {/* Floating hearts */}
      {HEARTS.map(h => (
        <span
          key={h.id}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${h.left}%`,
            bottom: '-5%',
            fontSize: `${h.size}px`,
            color: '#FF3354',
            opacity: 0.5,
            animation: `floatUp ${h.duration}s ${h.delay}s ease-in infinite`,
          }}
        >
          ♥
        </span>
      ))}

      {/* Letter */}
      <div
        className="relative max-w-2xl mx-4 p-8 md:p-12 rounded-2xl overflow-y-auto max-h-[90vh]"
        style={{
          background: 'linear-gradient(145deg, #1a0005 0%, #0a0000 50%, #150008 100%)',
          border: '2px solid #C00000',
          boxShadow: '0 0 60px rgba(192, 0, 0, 0.3), inset 0 0 30px rgba(255, 51, 84, 0.05)',
          transform: visible ? 'scale(1)' : 'scale(0.8)',
          transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Decorative corners */}
        <div className="absolute top-3 left-3 text-xl" style={{ color: '#FF3354' }}>♥</div>
        <div className="absolute top-3 right-3 text-xl" style={{ color: '#FF3354' }}>♥</div>
        <div className="absolute bottom-3 left-3 text-xl" style={{ color: '#FF3354' }}>♥</div>
        <div className="absolute bottom-3 right-3 text-xl" style={{ color: '#FF3354' }}>♥</div>

        <h2
          className="text-center mb-2"
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '16px',
            color: '#FF3354',
            textShadow: '0 0 20px rgba(255, 51, 84, 0.5)',
          }}
        >
          Untuk Raina Tersayang 💕 
        </h2>

        <div className="w-24 h-0.5 mx-auto mb-8" style={{ background: 'linear-gradient(90deg, transparent, #FF6B96, transparent)' }} />

        <div className="space-y-5" style={{
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: '15px',
          lineHeight: '1.9',
          color: '#FFD5E0',
        }}>
          <p>Raina yang tercinta ♥</p>

          <p>
            Jika aku bisa memutar waktu, aku akan tetap memilih jalan yang sama, 
            jalan yang membawaku kepadamu. Karena di antara jutaan kemungkinan
            yang ada di dunia ini, bertemu denganmu adalah keajaiban paling
            indah yang pernah terjadi dalam hidupku.
          </p>

          <p>
            Kamu bukan hanya seseorang yang aku cintai. Kamu adalah rumah yang
            selalu aku rindukan, tempat di mana hatiku menemukan kedamaian yang
            sesungguhnya. Setiap tawa yang kamu berikan, setiap kata yang kamu
            ucapkan, setiap momen yang kita lalui bersama, semuanya tersimpan
            rapi di sudut terindah dalam memoriku.
          </p>

          <p>
            Aku ingat pertama kali melihatmu. Dunia serasa berhenti berputar.
            Dan sejak hari itu, setiap hari bersamamu terasa seperti hadiah
            yang tak ternilai harganya. Kamu mengajariku arti cinta yang
            sesungguhnya, bukan hanya tentang perasaan, tapi tentang pilihan
            untuk tetap bertahan, tetap berjuang, dan tetap mencintai.
          </p>

          <p>
            Terima kasih sudah menjadi alasanku tersenyum di pagi hari.
            Terima kasih sudah menjadi pelangi setelah hujanku.
            Terima kasih sudah memilih untuk tetap di sisiku,
            bahkan di saat aku tak sempurna.
          </p>

          <p>
            Kamu adalah bukti bahwa cinta sejati itu nyata. Dan aku berjanji,
            dengan seluruh hatiku untuk terus menjaga, mencintai, dan
            membahagiakan kamu. Bukan hanya hari ini, tapi selamanya.
          </p>

          <p>
            Aku tidak tahu apa yang akan terjadi di masa depan. Tapi satu hal
            yang aku tahu pasti, aku ingin menjalani semuanya bersamamu.
            Setiap tawa, setiap tangis, setiap petualangan baru, aku ingin
            kamu ada di sampingku.
          </p>

          <p style={{ color: '#FF8BC1', fontStyle: 'italic' }}>
            Selamat Hari Valentine, sayangku. Kamu adalah hadiah terindah
            yang pernah aku terima dari semesta.
          </p>

          <p className="text-right mt-8" style={{ color: '#FF6B96' }}>
            Dengan seluruh cintaku,<br />
            <span style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '13px',
              color: '#FF3354',
            }}>
              Luthfi ♥
            </span>
          </p>
        </div>

        <div className="mt-8 text-center" style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '9px',
          color: '#FF6B96',
          opacity: 0.6,
        }}>
          ~ Our Love: Looking Back. Made with ♥ for Raina♥ ~
        </div>
      </div>
    </div>
  );
};

export default LoveLetter;
