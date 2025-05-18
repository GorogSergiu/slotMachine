import SlotMachine from './SlotMachine';

const App: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-[#FFFDD0]"
      style={{
        backgroundImage: 'url(/bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <SlotMachine />
    </div>
  );
};

export default App;
