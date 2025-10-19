import { useEffect, useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "./button";


interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  isLoading?: boolean;
  error?: Error | null;
  totalItems?: number;
  searchPlaceholder?: string;
  searchKeys?: (keyof TData)[];
  onSearch?: (searchTerm: string) => void;
  onPageChange?: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  currentPage?: number;
  itemsPerPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  showItemsPerPage?: boolean;
  maxHeight?: string;
  debounceTime?: number;
  emptyMessage?: string;
  emptySearchMessage?: string;
  customToolbar?: React.ReactNode;
  onRowClick?: (row: TData) => void;
  onResetFilters?: () => void;
}

export function DataTable<TData, TValue>({
  data,
  columns,
  isLoading = false,
  error = null,
  totalItems = 0,
  searchPlaceholder = "Buscar...",
  searchKeys = [],
  onSearch,
  onPageChange,
  onItemsPerPageChange,
  currentPage = 1,
  itemsPerPage = 15,
  showSearch = true,
  showPagination = true,
  showItemsPerPage = true,
  maxHeight = "600px",
  emptyMessage = "Nenhum item encontrado.",
  emptySearchMessage = "Nenhum item encontrado com os critérios de busca.",
  debounceTime = 800,
  customToolbar,
  onRowClick,
  onResetFilters,
}: DataTableProps<TData, TValue>) {
  const [searchTerm, setSearchTerm] = useState("");

  const [inputValue, setInputValue] = useState("");

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Search debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (inputValue.trim() !== searchTerm) {
        setSearchTerm(inputValue);
        onSearch?.(inputValue.trim());
      }
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [inputValue]);

  // redireciona para a última página válida
  useEffect(() => {
    const maxPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    if (currentPage > maxPages) {
      onPageChange?.(maxPages);
    }
  }, [totalItems, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    onItemsPerPageChange?.(Number(value));
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  const handleRowClick = (row: TData) => {
    onRowClick?.(row);
  };

  const renderPaginationItems = () => {
    const pages = [];
    const maxMiddlePages = 3; // no máximo 3 páginas entre as elipses

    // Sempre inclui página 1
    pages.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Ellipsis após página 1
    if (startPage > 2) {
      pages.push(<PaginationEllipsis key="start-ellipsis" />);
    }

    // Páginas do meio (no máximo 3)
    for (let i = startPage; i <= endPage && i <= totalPages - 1; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Ellipsis antes da última página
    if (endPage < totalPages - 1) {
      pages.push(<PaginationEllipsis key="end-ellipsis" />);
    }

    return pages;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {(showSearch || customToolbar) && (
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="relative  w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          )}

          {customToolbar && <div className="sm:ml-auto">{customToolbar}</div>}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-destructive mb-4">
          Erro ao carregar dados: {error.message}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <div
          className="relative overflow-y-auto"
          style={{ maxHeight, position: "relative" }}
        >
          <Table className="min-w-full table-fixed">
            <TableHeader className="sticky top-0 bg-background z-20 border-b border-muted">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="sticky top-0 border-0 bg-white shadow-border shadow-[inset_0_-1px_0]"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.getSize(),
                        minWidth: header.column.columnDef.minSize,
                        maxWidth: header.column.columnDef.maxSize,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Skeleton loading rows
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={colIndex}
                        style={{
                          width: column.size,
                          minWidth: column.minSize,
                          maxWidth: column.maxSize,
                        }}
                      >
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-8 text-muted-foreground"
                  >
                    {searchTerm ? emptySearchMessage : emptyMessage}
                    {onResetFilters && (
                      <div className="flex justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={onResetFilters}
                        >
                          Resetar filtros
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.original)}
                    className={
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize,
                          maxWidth: cell.column.columnDef.maxSize,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="flex flex-col sm:flex-row sm:flex-row-reverse items-center justify-between gap-4">
          {showPagination && totalPages > 1 && (
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {renderPaginationItems()}
                  {totalPages > 1 && (
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        isActive={currentPage === totalPages}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          <div className="flex items-center gap-10">
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}{" "}
              itens
            </div>
            {showItemsPerPage && (
              <div className="flex items-center gap-2 hidden sm:flex">
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Itens por página:
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
