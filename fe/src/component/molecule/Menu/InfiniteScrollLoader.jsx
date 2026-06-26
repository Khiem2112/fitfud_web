import React, { useEffect, useRef } from 'react';

/**
 * InfiniteScrollLoader Component
 * Quản lý trạng thái và UI khi tải thêm trang mới bằng IntersectionObserver
 * @param {{ fetchNextPage: function, hasNextPage: boolean, isFetchingNextPage: boolean }} props
 */
export default function InfiniteScrollLoader({ fetchNextPage, hasNextPage, isFetchingNextPage }) {
  const loadMoreRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Nếu không còn trang tiếp theo và không đang tải thì không cần render gì
  if (!hasNextPage && !isFetchingNextPage) {
    return null;
  }

  return (
    <div ref={loadMoreRef} className="w-full py-8">
      {isFetchingNextPage && (
        <div className="flex flex-col items-center justify-center gap-2">
          <i className="bi bi-arrow-repeat animate-spin text-xl text-primary" aria-hidden="true"></i>
          <span className="text-xs font-bold text-text-muted tracking-wide uppercase">Đang tải thêm món ăn...</span>
        </div>
      )}
    </div>
  );
}
