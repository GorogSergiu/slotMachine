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
  { name: 'tricou', winPercentage: 15, stock: 20 },
  { name: 'sapca', winPercentage: 20, stock: 10 },
  { name: 'insigna', winPercentage: 10, stock: 0 },
  { name: 'geanta', winPercentage: 5, stock: 5 },
  { name: 'hanorac', winPercentage: 10, stock: 8 },
  { name: 'breloc', winPercentage: 10, stock: 15 },
  { name: 'stickere', winPercentage: 5, stock: 50 },
  { name: 'pahar', winPercentage: 5, stock: 12 },
  { name: 'portofel', winPercentage: 10, stock: 7 },
  { name: 'rucsac', winPercentage: 10, stock: 3 },
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

  const itemHeight = 80;
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
    setShowConfetti(true);

    // Hide confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const spinningList = Array(20).fill(prizes).flat();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !spinning) {
        event.preventDefault();
        handleSpin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  });

  return (
    <div className="flex flex-col justify-center items-center">
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

      <div className="w-[500px] mx-auto mt-10 md:mt-16">
        <div className="overflow-hidden h-[240px] relative border-4 border-orange-600 rounded-lg bg-white">
          <div className="absolute top-1/2 left-0 w-full h-[80px] -translate-y-1/2 border-y-2 border-dashed border-orange-400 pointer-events-none z-10" />

          <motion.div animate={controls} ref={containerRef}>
            {spinningList.map((prize, index) => (
              <div
                key={index}
                className={`h-[80px] flex items-center justify-center text-[32px] font-bold ${
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
          className="mt-6 w-full text-[20px] pt-7 pb-7 btn btn-neutral"
        >
          {spinning ? (
            'Se învârte...'
          ) : (
            <>
              Apasă <RocketLaunchIcon className="h-6 w-6 inline" />
            </>
          )}
        </button>

        {currentPrize && !spinning && (
          <div className="mt-6 text-center text-[42px] font-semibold text-orange-600">
            🎉 Ai câștigat: <strong>{currentPrize.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
