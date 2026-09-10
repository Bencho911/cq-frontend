import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (time: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => {
  const num = i === 0 ? 12 : i;
  return num.toString().padStart(2, '0');
});

const MINUTES = Array.from({ length: 12 }, (_, i) => {
  return (i * 5).toString().padStart(2, '0');
});

const ScrollColumn = ({ items, selected, onChange }: { items: string[], selected: string, onChange: (val: string) => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemHeight = 54;

  useEffect(() => {
    if (scrollRef.current) {
      const index = items.indexOf(selected);
      if (index !== -1) {
        scrollRef.current.scrollTop = index * itemHeight;
      }
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollPos = target.scrollTop;
    const index = Math.round(scrollPos / itemHeight);
    if (items[index] && items[index] !== selected) {
      onChange(items[index]);
    }
  };

  return (
    <div 
      ref={scrollRef}
      className="h-[162px] w-[60px] overflow-y-scroll snap-y snap-mandatory no-scrollbar relative z-10"
      onScroll={handleScroll}
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Top padding to center first item */}
      <div style={{ height: itemHeight }} />
      
      {items.map((item, idx) => {
        const isSelected = item === selected;
        return (
          <div 
            key={idx} 
            className="h-[54px] w-full flex items-center justify-center snap-center"
          >
            <span className={`font-semibold transition-colors duration-200 ${isSelected ? 'text-[36px] text-[#2b1b12]' : 'text-[30px] text-[#2b1b12] opacity-0'}`}>
              {item}
            </span>
          </div>
        );
      })}
      
      {/* Bottom padding to center last item */}
      <div style={{ height: itemHeight }} />
    </div>
  );
};

const TimePickerModal = ({ isOpen, onClose, onConfirm }: TimePickerModalProps) => {
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(`${hour}:${minute} ${period}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-surface rounded-[10px] shadow-lg w-full max-w-[335px] p-6 flex flex-col relative"
        >
          
          <div className="flex items-center justify-center gap-6 mt-4 relative h-[162px]">
            {/* Scrollable Hours */}
            <ScrollColumn items={HOURS} selected={hour} onChange={setHour} />

            {/* Separator Dots */}
            <div className="flex flex-col gap-2 items-center justify-center h-full pb-4">
              <div className="w-3 h-3 bg-[#2b1b12] rounded-full" />
              <div className="w-3 h-3 bg-[#2b1b12] rounded-full" />
            </div>

            {/* Scrollable Minutes */}
            <ScrollColumn items={MINUTES} selected={minute} onChange={setMinute} />

            {/* Masks for fading top/bottom items */}
            <div className="absolute top-0 left-0 right-[80px] h-[54px] bg-[#fbf6f0]/80 rounded-t-lg pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 right-[80px] h-[54px] bg-[#fbf6f0]/80 rounded-b-lg pointer-events-none z-20" />
            
            <div className="absolute top-[54px] left-0 right-[80px] h-[54px] bg-transparent pointer-events-none z-0 border-y border-transparent" />
            
            {/* Fixed background for selected item to match design if needed, but masks over unselected is enough */}
            <div className="absolute top-[54px] left-[10px] w-[50px] h-[54px] bg-surface z-0 pointer-events-none" />
            <div className="absolute top-[54px] right-[95px] w-[50px] h-[54px] bg-surface z-0 pointer-events-none" />

            {/* AM/PM Toggle */}
            <div className="flex flex-col border border-[#c67b3d] rounded-[10px] w-[64px] h-[106px] overflow-hidden bg-surface z-30 ml-2">
              <button
                onClick={() => setPeriod('AM')}
                className={`flex-1 flex items-center justify-center text-[24px] font-semibold transition-colors ${
                  period === 'AM' ? 'bg-[#c67b3d] text-white' : 'bg-surface text-[#2b1b12]'
                }`}
              >
                AM
              </button>
              <div className="h-[1px] bg-[#c67b3d]" />
              <button
                onClick={() => setPeriod('PM')}
                className={`flex-1 flex items-center justify-center text-[24px] font-semibold transition-colors ${
                  period === 'PM' ? 'bg-[#c67b3d] text-white' : 'bg-surface text-[#2b1b12]'
                }`}
              >
                PM
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-6 mt-10">
            <button 
              onClick={onClose}
              className="text-[#c67b3d] font-medium text-[16px] px-2"
            >
              Cancelar
            </button>
            <button 
              onClick={handleConfirm}
              className="bg-[#c67b3d] text-white rounded-2xl px-6 py-2.5 font-medium text-[16px] min-w-[130px]"
            >
              Continuar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TimePickerModal;
