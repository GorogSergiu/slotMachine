import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { RocketLaunchIcon } from '@heroicons/react/24/solid';
import Confetti from 'react-confetti';
import { fetchPrizes, decrementPrizeStock } from './slotApi';

type Prize = {
  name: string;
  winPercentage: number;
  stock: number;
};

export default function SlotMachine() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [currentPrize, setCurrentPrize] = useState<Prize | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const itemHeight = 120;
  const visibleIndex = 1;

  useEffect(() => {
    const getPrizes = async () => {
      try {
        const fetchedPrizes = await fetchPrizes();
        setPrizes(fetchedPrizes);
      } catch (error) {
        console.error('Error fetching prizes:', error);
      }
    };
    getPrizes();
  }, []);

  const handleSpin = useCallback(async () => {
    if (spinning || prizes.length === 0) return;
    setSpinning(true);
    setShowConfetti(false);

    function getWeightedPrize(): Prize | null {
      const available = prizes.filter((p) => p.stock > 0);
      if (available.length === 0) return null;
      const total = available.reduce((acc, prize) => acc + prize.winPercentage, 0);
      const rand = Math.random() * total;
      let cumulative = 0;
      for (const prize of available) {
        cumulative += prize.winPercentage;
        if (rand <= cumulative) return prize;
      }
      return available[available.length - 1];
    }

    const winner = getWeightedPrize();
    if (!winner) {
      setSpinning(false);
      return;
    }
    setCurrentPrize(winner);

    // Decrement stock in backend
    try {
      await decrementPrizeStock(winner.name);
      // Optionally, refresh local prizes state
      const updatedPrizes = await fetchPrizes();
      setPrizes(updatedPrizes);
    } catch (error) {
      console.error('Failed to decrement prize stock:', error);
    }

    const baseList = Array(20).fill(prizes).flat();
    const winnerIndexes = baseList
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.name === winner.name);

    const validIndexes = winnerIndexes.filter(
      ({ index }) => index > visibleIndex && index < baseList.length - visibleIndex
    );
    if (validIndexes.length === 0) {
      setSpinning(false);
      return;
    }
    const { index: targetIndex } = validIndexes[Math.floor(Math.random() * validIndexes.length)];
    const distance = (targetIndex - visibleIndex) * itemHeight;

    await controls.start({
      y: -distance,
      transition: {
        duration: 1.2,
        ease: 'easeInOut',
      },
    });

    setSpinning(false);
    setModalOpen(true);
    setShowConfetti(true);

    setTimeout(() => setShowConfetti(false), 8000);
  }, [spinning, prizes, controls]);

  const spinningList = Array(20).fill(prizes).flat();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Enter') {
        console.log('Enter pressed');
        event.preventDefault();
        if (modalOpen) {
          setModalOpen(false);
          window.location.reload();
        } else if (!spinning) {
          handleSpin();
        }
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [modalOpen, spinning, handleSpin]);

  if (prizes.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-3xl font-bold">
        Loading prizes...
      </div>
    );
  }

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
          <div className="overflow-hidden h-[360px] relative border-4 border-[#FF5F1F] rounded-lg bg-white">
            <div className="absolute top-1/2 left-0 w-full h-[120px] -translate-y-1/2 border-y-2 border-dashed border-[#FFA500] pointer-events-none z-10" />

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
            className="mt-6 w-full text-[20px] pt-5 pb-5 bg-black text-white rounded-lg"
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

          {/* Custom Modal instead of daisyUI dialog */}
          {modalOpen && currentPrize && !spinning && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.2)' }}
            >
              <div className="bg-white rounded-lg shadow-lg p-12 flex flex-col items-center w-[900px]">
                <h3 className="font-bold text-[84px] mb-4 text-[#FF5F1F]">Felicitări! 🎉</h3>
                <p className="py-4 text-[60px]">
                  Ai câștigat: <strong>{currentPrize.name}</strong>!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
