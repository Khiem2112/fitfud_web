import React from 'react';

/**
 * FilterSection Molecule for Checkboxes
 * @param {{ title: string, items: {id: string, name: string}[], selectedItems: string[], onToggle: function, labelPrefix?: string }} props
 */
export default function FilterSection({ title, items, selectedItems, onToggle, labelPrefix = '' }) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-text-main">{title}</label>
      <div className="space-y-1">
        {items.map((item) => (
          <label key={item.id} className="flex items-center gap-2 text-[11px] font-medium text-text-muted cursor-pointer">
            <input
              type="checkbox"
              checked={selectedItems.includes(item.name)}
              onChange={() => onToggle(item.name)}
              className="h-3.5 w-3.5 rounded border-border-light text-primary focus:ring-primary"
            />
            <span className={selectedItems.includes(item.name) ? 'text-text-main font-bold' : ''}>
              {labelPrefix} {item.name}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
