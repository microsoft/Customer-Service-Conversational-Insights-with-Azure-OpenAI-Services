import { Button } from "@fluentui/react-components";
import { DOTS, usePagination } from "../../utils/customHooks/usePagination";
import { useState } from "react";
import { ChevronLeft24Regular, ChevronRight24Regular } from "@fluentui/react-icons";

interface PaginagtionProps {
    totalCount: number;
    pageSize: number;
    currentPage: number;
    siblingCount?: number;
    onPageChange: (page: number) => void;
}

export function Pagination({ totalCount, pageSize, currentPage, siblingCount = 1, onPageChange }: PaginagtionProps) {

    const isDisabled = totalCount === 1;

    const isLeftArrowDisabled = currentPage === 1;
    const isRightArrowDisabled = currentPage === totalCount;

    const paginationRange = usePagination({ totalCount, pageSize, siblingCount, currentPage });

    if (!paginationRange || currentPage < 1 || currentPage > totalCount) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let items = paginationRange!.map((page, idx) => {
        if (page === DOTS) {
            return <li key={idx}>...</li>;
        } else {
            return (
                <Button
                    className={`rounded px-4 py-2 text-white ${
                        page === currentPage ? "bg-blue-700" : "bg-blue-500 hover:bg-blue-700"
                    }`}
                    appearance={page === currentPage ? "primary" : "subtle"}
                    shape="circular"
                    size="small"
                    key={idx}
                    onClick={() => typeof page === "number" && onPageChange(page)}
                >
                    {page}
                </Button>
            );
        }
    });

    return (
        <ul className="flex flex-wrap">
            <Button icon={<ChevronLeft24Regular />} className="h-8" appearance="subtle" onClick={onPrevious} disabled={isDisabled || isLeftArrowDisabled}></Button>
            {items}
            <Button icon={<ChevronRight24Regular />} className="h-8" appearance="subtle" onClick={onNext} disabled={isDisabled || isRightArrowDisabled}></Button>
        </ul>
    );
}
