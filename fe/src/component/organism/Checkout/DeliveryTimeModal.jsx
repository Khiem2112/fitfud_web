import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../../../context/ToastContext';

// Helper to format date as YYYY-MM-DD for native input
const formatDateForInput = (date) => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

// Helper to format date as DD/MM/YYYY : HH:mm
const formatDateTimeDisplay = (date, timeString) => {
  const d = new Date(date);
  const month = '' + (d.getMonth() + 1);
  const day = '' + d.getDate();
  const year = d.getFullYear();
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year} : ${timeString}`;
};

const generateTimeSlots = () => {
  const slots = [];
  for (let h = 7; h <= 22; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h !== 22) {
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();

export const DeliveryTimeModal = ({ isOpen, onClose, onSelectTime }) => {
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setSelectedDateStr(formatDateForInput(new Date()));
    }
  }, [isOpen]);

  const minDateStr = useMemo(() => formatDateForInput(new Date()), []);

  const getSlotStatus = (timeStr) => {
    if (!selectedDateStr) return 'past';
    
    const now = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const slotDate = new Date(selectedDateStr);
    slotDate.setHours(hours, minutes, 0, 0);

    const diffMs = slotDate.getTime() - now.getTime();

    if (diffMs < 0) return 'past'; // Red
    if (diffMs < 30 * 60 * 1000) return 'near'; // Yellow
    return 'valid'; // Green
  };

  const handleSelectSlot = (timeStr) => {
    const status = getSlotStatus(timeStr);
    
    if (status === 'past') return;
    
    if (status === 'near') {
      addToast('Không thể chọn thời gian giao hàng quá sát hiện tại. Vui lòng chọn thời gian khác.', 'error');
      return;
    }

    const formattedTime = formatDateTimeDisplay(selectedDateStr, timeStr);
    onSelectTime(formattedTime);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl w-full max-w-[600px] flex flex-col shadow-premium-lg animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h2 className="text-xl font-bold text-text-main">Chọn thời gian giao hàng</h2>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:bg-bg-main hover:text-text-main transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-6">
          {/* Date Picker */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-main">Ngày giao hàng</label>
              <button
                type="button"
                onClick={() => setSelectedDateStr(minDateStr)}
                disabled={selectedDateStr === minDateStr}
                className="text-xs font-bold text-primary hover:underline bg-primary/10 px-3 py-1.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:no-underline"
              >
                Giao trong hôm nay
              </button>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-muted group-focus-within:text-primary transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <input 
                type="date" 
                min={minDateStr}
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border-light focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-bold text-text-main text-[15px] bg-white shadow-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </div>
          </div>

          {/* Time Slots Grid */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-text-main">Khung giờ giao hàng</label>
              <div className="flex items-center gap-3 text-xs font-medium text-text-muted">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-green-100 border border-green-500"></span> Hợp lệ</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-500"></span> Quá sát</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-50 border border-red-200"></span> Đã qua</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {TIME_SLOTS.map((time) => {
                const status = getSlotStatus(time);
                
                let btnClass = "py-2 px-1 text-sm font-bold rounded-lg border-2 transition-all flex items-center justify-center ";
                
                if (status === 'past') {
                  btnClass += "bg-red-50 border-red-100 text-red-300 cursor-not-allowed";
                } else if (status === 'near') {
                  btnClass += "bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100 cursor-pointer opacity-70";
                } else {
                  btnClass += "bg-green-50 border-green-400 text-green-700 hover:bg-green-100 cursor-pointer shadow-sm";
                }

                return (
                  <button
                    key={time}
                    type="button"
                    disabled={status === 'past'}
                    onClick={() => handleSelectSlot(time)}
                    className={btnClass}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
