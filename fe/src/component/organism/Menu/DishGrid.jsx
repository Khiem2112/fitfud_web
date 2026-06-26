import React from 'react';
import DishCard from '../../molecule/Menu/DishCard';

/**
 * DishGrid Organism
 * @param {{ isLoading: boolean, isError: boolean, dishes: any[], totalItems: number, onOpenQuickView: function, onClearAllFilters: function }} props
 */
export default function DishGrid({ isLoading, isError, dishes, totalItems, onOpenQuickView, onClearAllFilters }) {
  return (
    <section className="lg:col-span-4 space-y-3">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-text-main tracking-tight">Thực đơn lành mạnh</h1>
          <p className="text-xs text-text-muted mt-0.5">
            Tìm thấy {totalItems} món ăn sức khỏe được tuyển chọn
          </p>
        </div>
      </div>

      {/* LOADING STATE FOR INITIAL LOAD */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="animate-pulse rounded-xl border border-border-light bg-bg-card p-3 space-y-3">
              <div className="bg-border-light rounded-lg h-28 w-full"></div>
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
          <i className="bi bi-exclamation-triangle mb-2 block text-3xl leading-none" aria-hidden="true" />
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
      {!isLoading && !isError && dishes.length === 0 && (
        <div className="rounded-2xl border border-border-light bg-bg-card p-16 text-center text-text-muted space-y-4">
          <i className="bi bi-egg-fried block text-5xl leading-none text-primary" aria-hidden="true" />
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
      {!isLoading && !isError && dishes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
          {dishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} onOpenQuickView={onOpenQuickView} />
          ))}
        </div>
      )}
    </section>
  );
}
