import React, { useState, useEffect } from 'react';
import { SavedAddressItem } from '../../molecule/Checkout/SavedAddressItem';
import { EmptyAddressState } from '../../molecule/Checkout/EmptyAddressState';
import { getSavedAddresses } from '../../../service/checkoutService';
import { useToast } from '../../../context/ToastContext';
import { useApp } from '../../../context/AppContext';

export const SavedAddressModal = ({ isOpen, onClose, onSelectAddress }) => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const { addToast } = useToast();
  const { user } = useApp();

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    } else {
      setSelectedId(null);
    }
  }, [isOpen]);

  const loadAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedAddresses(user?.id || 'guest');
      // Sort default address to top
      const sorted = [...data].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
      setAddresses(sorted);
      
      // Auto select default if exists
      const defaultAddr = sorted.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedId(defaultAddr.id);
      }
    } catch (error) {
      addToast('Lỗi khi tải danh sách địa chỉ.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    addToast('Chức năng "Thêm địa chỉ mới" đang được phát triển.', 'warning');
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    const selectedObj = addresses.find(a => a.id === selectedId);
    if (selectedObj) {
      onSelectAddress(selectedObj);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative bg-white rounded-2xl w-full max-w-[600px] flex flex-col shadow-premium-lg animate-fade-in-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border-light">
          <h2 className="text-xl font-bold text-text-main">Sổ địa chỉ của bạn</h2>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:bg-bg-main hover:text-text-main transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[50vh] min-h-[200px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-primary">
              <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : addresses.length === 0 ? (
            <EmptyAddressState />
          ) : (
            <div className="flex flex-col gap-3">
              {addresses.map(addr => (
                <SavedAddressItem 
                  key={addr.id}
                  address={addr}
                  isSelected={selectedId === addr.id}
                  onSelect={(a) => setSelectedId(a.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {addresses.length > 0 && (
          <div className="p-5 border-t border-border-light flex items-center justify-between bg-bg-main rounded-b-2xl">
            <button 
              type="button" 
              onClick={handleAddNew}
              className="flex items-center gap-2 text-primary font-bold hover:underline"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Thêm địa chỉ mới
            </button>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 font-bold text-text-muted hover:text-text-main transition-colors"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={handleConfirm}
                disabled={!selectedId}
                className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sử dụng địa chỉ này
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
