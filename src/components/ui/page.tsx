import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationSectionProps {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

const PaginationSection = ({
  total,
  limit,
  page,
  setPage,
}: PaginationSectionProps) => {
  const totalPages = Math.ceil(total / limit);

  // Ensure the page is at least 1
  const currentPage = Math.max(1, page);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i} className="cursor-pointer">
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      pages.push(
        <PaginationItem key={1} className="cursor-pointer">
          <PaginationLink
            isActive={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        pages.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={currentPage === i}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const startCount = total > 0 ? (currentPage - 1) * limit + 1 : 0;
  const endCount = Math.min(currentPage * limit, total);

  return total > 0 ? (
    <div className="flex items-center gap-2 sm:flex-row sm:justify-between mt-4">
      <Pagination>
        <PaginationContent>
          <div className="text-sm text-muted-foreground">
            <p>
              Showing {startCount} - {endCount} of {total} data entries
            </p>
          </div>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ) : null;
};

export default PaginationSection;
