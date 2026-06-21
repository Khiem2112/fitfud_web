import React from 'react';
import { AddressBadge } from '../../atom/Checkout/AddressBadge';
import { useToast } from '../../../context/ToastContext';

export const SavedAddressItem = ({ address, isSelected, onSelect }) => {
  const { addToast } = useToast();

  const handleEditClick = (e) => {
    e.stopPropagation();
    addToast('Chức năng "Chỉnh sửa địa chỉ" đang được phát triển.', 'warning');
  };

  return (
    <div 
      className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-primary bg-primary/5' : 'border-border-light bg-white hover:border-primary/30'}`}
      onClick={() => onSelect(address)}
    >
      <div className="pt-1">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-border-light'}`}>
          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-text-main">{address.name}</span>
            <span className="mx-2 text-border-light">|</span>
            <span className="text-text-muted text-sm">{address.phone}</span>
            <AddressBadge isDefault={address.isDefault} />
          </div>
          <button 
            type="button" 
            onClick={handleEditClick}
            className="text-primary text-sm font-semibold hover:underline"
          >
            Chỉnh sửa
          </button>
        </div>
        
        <p className="text-sm text-text-muted mt-1 leading-relaxed">
          {address.shipping_address_text}
          <br />
          {address.wardName}, {address.districtName}, {address.cityName}
        </p>
      </div>
    </div>
  );
};
