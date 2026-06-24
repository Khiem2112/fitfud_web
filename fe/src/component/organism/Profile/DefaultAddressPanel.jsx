import React, { useState, useEffect } from 'react';
import { useToast } from '../../../context/ToastContext';

export default function DefaultAddressPanel({ addresses, onChangeAddress }) {
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [confirmAddressId, setConfirmAddressId] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const handleSelectAddress = (id) => {
    if (id !== selectedAddressId) {
      setConfirmAddressId(id);
    }
  };

  const confirmChangeAddress = () => {
    if (confirmAddressId) {
      setSelectedAddressId(confirmAddressId);
      setConfirmAddressId(null);
      addToast('Đổi địa chỉ mặc định thành công!', 'success');
    }
  };

  const cancelChangeAddress = () => {
    setConfirmAddressId(null);
  };

  return (
    <div className="bg-bg-card border border-border-light rounded-3xl p-6 shadow-premium space-y-4 relative">
      <h3 className="text-sm font-bold text-text-main flex items-center gap-2 mb-2">
        <span>📍</span> Địa chỉ giao hàng
      </h3>

      {addresses && addresses.length > 0 ? (
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
          {addresses.map((address) => (
            <div
              key={address.id}
              onClick={() => handleSelectAddress(address.id)}
              className={`border rounded-xl p-4 cursor-pointer transition ${selectedAddressId === address.id
                  ? 'border-primary-dark bg-[#F8FAFC]'
                  : 'border-border-light hover:border-primary-light bg-white'
                }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="font-extrabold text-xs text-text-main">{address.receiver_name || 'Nhà riêng'}</p>
                {selectedAddressId === address.id && (
                  <span className="rounded bg-primary-dark text-[8px] font-extrabold text-white px-2 py-0.5 tracking-widest">
                    ĐANG CHỌN
                  </span>
                )}
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                {address.full_address}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-4 border border-dashed border-border-light rounded-xl bg-bg-main">
          <p className="text-xs text-text-muted mb-2">Chưa có địa chỉ nào</p>
        </div>
      )}

      <button
        onClick={onChangeAddress}
        className="w-full rounded-xl border border-primary-dark py-2.5 text-xs font-bold text-primary-dark hover:bg-bg-main transition mt-2"
      >
        <span>➕</span> Thêm địa chỉ mới
      </button>

      {/* Confirmation Popup */}
      {confirmAddressId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-xl relative animate-fadeIn scale-in">
            <h3 className="text-lg font-bold text-text-main mb-3 text-center">Xác nhận thay đổi</h3>
            <p className="text-sm text-text-muted text-center mb-6">
              Bạn có chắc chắn muốn đặt địa chỉ này làm địa chỉ mặc định không?
            </p>
            <div className="flex gap-4">
              <button
                onClick={cancelChangeAddress}
                className="flex-1 py-3 border border-border-light rounded-xl font-bold text-text-muted hover:bg-bg-main transition"
              >
                Hủy
              </button>
              <button
                onClick={confirmChangeAddress}
                className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-button hover:shadow-button-hover transition"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
