import React from 'react';

/**
 * SearchBox Molecule
 * @param {{ search: string, setSearch: function }} props
 */
export default function SearchBox({ search, setSearch }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold uppercase tracking-wider text-text-main">Từ khóa</label>
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tên món hoặc nguyên liệu..."
          className="w-full rounded-xl border border-border-light bg-bg-main px-4 py-2.5 text-xs focus:border-primary focus:outline-none transition"
        />
      </div>
    </div>
  );
}
