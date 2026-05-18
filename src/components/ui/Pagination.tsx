import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1.5">
        {getPages().map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            disabled={loading}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-[13px] font-bold transition-all ${
              currentPage === page
                ? 'bg-black text-white'
                : 'bg-white border border-gray-100 text-gray-500 hover:border-gray-300'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
