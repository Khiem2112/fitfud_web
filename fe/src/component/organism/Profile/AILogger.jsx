import React, { useState } from 'react';
import { analyzeMealImage } from '../../../service/profileService';

export default function AILogger({ onLogMeal }) {
  const [aiImage, setAiImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setAiImage(file);
      setScannedResult(null);
      setScanning(true);
      try {
        const res = await analyzeMealImage(file);
        setScannedResult(res);
      } catch (err) {
        alert('AI không thể nhận diện được hình ảnh này.');
      } finally {
        setScanning(false);
      }
    }
  };

  const handleSave = async () => {
    if (!scannedResult) return;
    try {
      await onLogMeal({
        ...scannedResult,
        source: 'AIImage'
      });
      setAiImage(null);
      setScannedResult(null);
    } catch (err) {
      // Handle error in parent
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl bg-bg-card relative">
      <div className="text-sm font-bold text-text-muted uppercase mb-4 px-2">Chụp ảnh AI</div>
      
      {!scannedResult && !scanning && (
        <div className="flex-1 border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:bg-bg-main transition relative">
          <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          <span className="text-4xl text-primary">📸</span>
          <span className="text-sm font-bold text-text-main text-center">Chụp/Tải ảnh</span>
          <span className="text-xs text-text-muted text-center">AI nhận diện tự động</span>
        </div>
      )}

      {scanning && (
        <div className="flex-1 border-2 border-dashed border-border-light rounded-lg flex flex-col items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-light border-t-primary mb-2"></div>
          <span className="text-[9px] text-text-muted">Đang phân tích...</span>
        </div>
      )}

      {scannedResult && (
        <div className="flex-1 border border-primary-light rounded-lg flex flex-col justify-center p-6 bg-bg-main space-y-4">
          <div className="text-center">
            <span className="text-base font-bold text-primary block truncate mb-1">{scannedResult.dish_name}</span>
            <span className="text-sm text-text-muted">{scannedResult.calories} kcal • {scannedResult.protein}g Pro</span>
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => { setScannedResult(null); setAiImage(null); }} className="flex-1 py-2 text-sm font-bold rounded-lg border border-border-light text-text-muted hover:bg-border-light transition">Hủy</button>
            <button onClick={handleSave} className="flex-1 py-2 text-sm font-bold rounded-lg bg-primary text-white hover:bg-primary-dark transition">Lưu</button>
          </div>
        </div>
      )}
    </div>
  );
}
