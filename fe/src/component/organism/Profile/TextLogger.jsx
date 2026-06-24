import React, { useState } from 'react';

export default function TextLogger({ onLogMeal }) {
  const [text, setText] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setProcessing(true);
    
    // Mock NLP parsing
    setTimeout(async () => {
      try {
        await onLogMeal({
          dish_name: "Bữa ăn tự chọn",
          calories: 350,
          protein: 25,
          source: 'ManualText'
        });
        setText('');
      } catch (err) {
        // Handle error
      } finally {
        setProcessing(false);
      }
    }, 800);
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-bg-card relative">
      <div className="text-sm font-bold text-text-muted uppercase mb-4 px-2">Nhập văn bản</div>
      
      <div className="flex-1 flex flex-col">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="VD: 200g ức gà, 100g cơm trắng..."
          className="flex-1 w-full rounded-lg border border-border-light bg-bg-main p-4 text-sm focus:outline-none focus:border-primary resize-none"
        ></textarea>
        
        <button
          onClick={handleSave}
          disabled={processing || !text.trim()}
          className="w-full py-2.5 mt-4 rounded-lg bg-primary-dark text-white text-sm font-bold shadow-sm hover:bg-primary transition disabled:opacity-50"
        >
          {processing ? 'Đang tính...' : 'Tính & Lưu'}
        </button>
      </div>
    </div>
  );
}
