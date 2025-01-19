'use client';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { usePathname, useRouter } from 'next/navigation';

export default function PaginationController({
    currentPage,
    totalPages,
    itemsPerPage,
}) {
    const router = useRouter();
    const pathname = usePathname();

    // Function to navigate to a specific page
    const goToPage = (page) => {
        if (page < 1 || page > totalPages) return;
        router.push(`${pathname}?page=${page}&items=${itemsPerPage}`);
    };

    // Function to generate page numbers with ellipsis
    const generatePageNumbers = () => {
        const pages = [];

        if (totalPages <= itemsPerPage) {
            // Display all pages when totalPages is 5 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Handle pages with ellipsis
            if (currentPage <= 3) {
                // Show first 3 pages, ellipsis, and last page
                pages.push(1, 2, 3, '...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show first page, ellipsis, and last 3 pages
                pages.push(
                    1,
                    '...',
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                );
            } else {
                // Show first page, ellipsis, current page ± 1, ellipsis, last page
                pages.push(
                    1,
                    '...',
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    '...',
                    totalPages
                );
            }
        }

        return pages;
    };

    const pages = generatePageNumbers();

    return (
        <Pagination className={'mt-20'}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href='#'
                        onClick={() => goToPage(currentPage - 1)}
                        className={
                            currentPage <= 1
                                ? 'pointer-events-none cursor-not-allowed'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>

                {pages.map((page, index) => (
                    <PaginationItem key={index}>
                        {page === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href='#'
                                onClick={() => goToPage(page)}
                                className={
                                    currentPage === page &&
                                    'bg-primary hover:bg-primary'
                                }
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href='#'
                        onClick={() => goToPage(currentPage + 1)}
                        className={
                            currentPage === totalPages
                                ? 'pointer-events-none cursor-not-allowed'
                                : 'cursor-pointer'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
