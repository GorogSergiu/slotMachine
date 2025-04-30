import { useRef, useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';

type Prize = {
  name: string;
  winPercentage: number;
  stock: number;
};

const prizes: Prize[] = [
  { name: 'tricou', winPercentage: 15, stock: 200 },
  { name: 'sapca', winPercentage: 20, stock: 100 },
  { name: 'insigna', winPercentage: 10, stock: 200 },
  { name: 'geanta', winPercentage: 5, stock: 500 },
  { name: 'hanorac', winPercentage: 10, stock: 800 },
  { name: 'breloc', winPercentage: 10, stock: 1500 },
  { name: 'stickere', winPercentage: 5, stock: 2000 },
  { name: 'pahar', winPercentage: 5, stock: 1200 },
  { name: 'portofel', winPercentage: 10, stock: 700 },
  { name: 'rucsac', winPercentage: 10, stock: 300 },
];

function getWeightedPrize(): Prize {
  const available = prizes.filter((p) => p.stock > 0);
  const total = available.reduce((acc, prize) => acc + prize.winPercentage, 0);
  const rand = Math.random() * total;

  let cumulative = 0;
  for (const prize of available) {
    cumulative += prize.winPercentage;
    if (rand <= cumulative) return prize;
  }

  return available[available.length - 1];
}

export default function SlotMachine() {
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const itemHeight = 120;
  const visibleIndex = 1;

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);
    setShowConfetti(false);

    const winner = getWeightedPrize();
    setCurrentPrize(winner);

    const baseList = Array(20).fill(prizes).flat();
    const winnerIndexes = baseList
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.name === winner.name);

    const validIndexes = winnerIndexes.filter(
      ({ index }) => index > visibleIndex && index < baseList.length - visibleIndex
    );
    const { index: targetIndex } = validIndexes[Math.floor(Math.random() * validIndexes.length)];
    const distance = (targetIndex - visibleIndex) * itemHeight;

    await controls.start({
      y: -distance,
      transition: {
        duration: 1.2,
        ease: 'easeInOut',
      },
    });

    const prizeIndex = prizes.findIndex((p) => p.name === winner.name);
    if (prizes[prizeIndex].stock > 0) {
      prizes[prizeIndex].stock -= 1;
    }

    setSpinning(false);
    setModalOpen(true);
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 8000);
  };

  const spinningList = Array(20).fill(prizes).flat();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        event.preventDefault();
        if (modalOpen) {
          setModalOpen(false); // just close modal
          window.location.reload();
        } else if (!spinning) {
          handleSpin(); // spin only when modal is not open
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, spinning]);

  return (
    <div className="flex flex-row justify-center items-center">
      <div className="mb-8 text-center w-1/3">
        <h2 className="text-[34px] font-bold mb-4">Premii disponibile:</h2>
        <div className="flex flex-col gap-4 text-[24px]">
          {prizes.map((prize, index) => (
            <div key={index} className={`${prize.stock === 0 ? 'text-gray-400 line-through' : ''}`}>
              {prize.name}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-center items-center w-2/3">
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        <div>
          <img src="/logo.png" alt="logo" className="w-100" />
        </div>

        <div className="w-[800px] mx-auto">
          <div className="overflow-hidden h-[360px] relative border-4 border-orange-600 rounded-lg bg-white">
            <div className="absolute top-1/2 left-0 w-full h-[120px] -translate-y-1/2 border-y-2 border-dashed border-orange-400 pointer-events-none z-10" />

            <motion.div animate={controls} ref={containerRef}>
              {spinningList.map((prize, index) => (
                <div
                  key={index}
                  className={`h-[120px] flex items-center justify-center text-[48px] font-bold ${
                    prize.stock === 0 ? 'text-gray-400 line-through' : ''
                  }`}
                >
                  {prize.name}
                </div>
              ))}
            </motion.div>
          </div>

          <button
            onClick={handleSpin}
            disabled={spinning}
            className="mt-6 w-full text-[20px] pt-9 pb-9 btn btn-neutral"
          >
            {spinning ? (
              'Se învârte...'
            ) : (
              <>
                <p className="text-[30px]">
                  Apasă butonul roșu <RocketLaunchIcon className="h-8 w-8 inline" />
                </p>
              </>
            )}
          </button>

          {modalOpen && currentPrize && !spinning && (
            <dialog id="my_modal_4" className="modal modal-open">
              <div className="modal-box w-11/12 max-w-5xl flex-col flex justify-center items-center">
                <h3 className="font-bold text-[84px] mb-4 text-orange-600">Felicitări! 🎉</h3>
                <p className="py-4 text-[60px]">
                  Ai câștigat: <strong>{currentPrize.name}</strong>!
                </p>
              </div>
            </dialog>
          )}
        </div>
      </div>
    </div>
  );
}
