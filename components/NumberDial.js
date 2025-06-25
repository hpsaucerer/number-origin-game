import { useRef, useState, useEffect } from 'react';
import puzzles from '@/data/puzzleData';

export default function NumberDial() {
  const puzzleKeys = Object.keys(puzzles).sort((a, b) => parseFloat(a) - parseFloat(b));
  const [selectedIndex, setSelectedIndex] = useState(puzzleKeys.length - 1);
  const selected = puzzleKeys[selectedIndex];
  const dialRef = useRef(null);

  // Add scroll wheel navigation
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        setSelectedIndex((i) => Math.min(puzzleKeys.length - 1, i + 1));
      } else if (e.deltaY < 0) {
        setSelectedIndex((i) => Math.max(0, i - 1));
      }
    };

    const dial = dialRef.current;
    if (dial) {
      dial.addEventListener('wheel', handleWheel, { passive: true });
    }
    return () => {
      if (dial) {
        dial.removeEventListener('wheel', handleWheel);
      }
    };
  }, [puzzleKeys.length]);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-xl font-semibold">Your Number Dial</h2>

      <div ref={dialRef} className="relative h-48 w-40 overflow-hidden">
        <ul className="absolute top-1/2 transform -translate-y-1/2 w-full text-center">
          {puzzleKeys.map((num, i) => {
            const offset = i - selectedIndex;
            const isSelected = i === selectedIndex;
            const scale = isSelected ? 'scale-125' : 'scale-95';
            const opacity = Math.max(1 - Math.abs(offset) * 0.3, 0.2);

            return (
              <li
                key={num}
                className={`py-2 transition-all duration-200 transform ${scale} ${isSelected ? 'font-bold' : ''}`}
                style={{ opacity }}
              >
                {puzzles[num].formatted || num}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="text-center bg-yellow-50 border p-4 rounded shadow max-w-md">
        <p className="text-lg font-bold">{puzzles[selected].formatted || selected}</p>
        <p className="text-sm mt-1">{puzzles[selected].answer}</p>
      </div>
    </div>
  );
}
