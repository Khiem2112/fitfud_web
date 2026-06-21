import React from 'react';
import DishCard from '../../molecule/Menu/DishCard';

/**
 * DishGrid Organism
 * @param {{ isLoading: boolean, isError: boolean, menuData: any, page: number, setPage: function, onOpenQuickView: function, onClearAllFilters: function }} props
 */
export default function DishGrid({ isLoading, isError, menuData, page, setPage, onOpenQuickView, onClearAllFilters }) {
  return (
    <section className="lg:col-span-3 space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-main tracking-tight">Thực đơn lành mạnh</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Tìm thấy {menuData?.totalItems || 0} món ăn sức khỏe được tuyển chọn
          </p>
        </div>
      </div>

      {/* LOADING STATE */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-2xl border border-border-light bg-bg-card p-4 space-y-4">
              <div className="bg-border-light rounded-xl h-44 w-full"></div>
              <div className="h-4 bg-border-light rounded w-3/4"></div>
              <div className="h-3 bg-border-light rounded w-1/2"></div>
              <div className="h-8 bg-border-light rounded w-full pt-4"></div>
            </div>
          ))}
        </div>
      )}

      {/* ERROR STATE */}
      {isError && (
        <div className="rounded-2xl border border-danger/30 bg-danger-light p-12 text-center text-danger">
          <span className="text-3xl block mb-2">⚠️</span>
          <p className="font-bold text-sm">Có lỗi xảy ra khi tải dữ liệu thực đơn!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-xs font-bold text-white bg-danger rounded-lg px-4 py-2 hover:bg-red-700 transition"
          >
            Tải lại trang
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && !isError && menuData?.dishes.length === 0 && (
        <div className="rounded-2xl border border-border-light bg-bg-card p-16 text-center text-text-muted space-y-4">
          <span className="text-5xl block">🥗</span>
          <p className="font-semibold text-sm text-text-main">Không tìm thấy món ăn nào khớp với bộ lọc của bạn.</p>
          <p className="text-xs max-w-sm mx-auto leading-relaxed">
            Vui lòng thử xóa bớt các tiêu chí lọc hoặc thay đổi từ khóa tìm kiếm để khám phá thêm món ngon khác nhé.
          </p>
          <button
            onClick={onClearAllFilters}
            className="rounded-xl border border-border-light px-5 py-2.5 text-xs font-bold text-text-main bg-bg-card hover:bg-bg-main transition"
          >
            Xóa toàn bộ lọc
          </button>
        </div>
      )}

      {/* DISHES LIST GRID */}
      {!isLoading && !isError && menuData && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menuData.dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onOpenQuickView={onOpenQuickView} />
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {!isLoading && !isError && menuData && menuData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-8 border-t border-border-light">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-xl border border-border-light bg-bg-card p-2 text-xs font-bold text-text-main hover:bg-bg-main transition disabled:opacity-30 disabled:hover:bg-bg-card"
          >
            ◀
          </button>
          {[...Array(menuData.totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`rounded-xl h-8 w-8 text-xs font-bold transition ${page === i + 1
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border-light bg-bg-card text-text-main hover:bg-bg-main'
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage(Math.min(menuData.totalPages, page + 1))}
            disabled={page === menuData.totalPages}
            className="rounded-xl border border-border-light bg-bg-card p-2 text-xs font-bold text-text-main hover:bg-bg-main transition disabled:opacity-30 disabled:hover:bg-bg-card"
          >
            ▶
          </button>
        </div>
      )}
    </section>
  );
}
