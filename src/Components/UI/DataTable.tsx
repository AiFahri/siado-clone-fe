import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { LoadingTable } from "./LoadingSpinner";
import { EmptyState } from "./ErrorMessage";

interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  emptyAction?: ReactNode;
  className?: string;
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T, index: number) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sortable?: boolean;
  defaultSort?: {
    key: string;
    direction: "asc" | "desc";
  };
}

interface SortState {
  key: string;
  direction: "asc" | "desc";
}

const SortIcon = ({ direction }: { direction?: "asc" | "desc" }) => (
  <svg
    className="w-4 h-4 ml-1 inline"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    {direction === "asc" ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    ) : direction === "desc" ? (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    ) : (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 9l4-4 4 4m0 6l-4 4-4-4"
      />
    )}
  </svg>
);

const DataTable = <T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyMessage = "Tidak ada data",
  emptyIcon,
  emptyAction,
  className = "",
  rowKey = "id",
  onRowClick,
  pagination,
  sortable = false,
  defaultSort,
}: DataTableProps<T>) => {
  const [sortState, setSortState] = useState<SortState | null>(
    defaultSort
      ? { key: defaultSort.key, direction: defaultSort.direction }
      : null
  );

  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record);
    }
    return (record[rowKey] as string | number) || index;
  };

  const sortedData = useMemo(() => {
    if (!sortable || !sortState) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortState.key as keyof T];
      const bValue = b[sortState.key as keyof T];

      if (aValue === bValue) return 0;

      let comparison = 0;
      if (aValue === null || aValue === undefined) {
        comparison = 1;
      } else if (bValue === null || bValue === undefined) {
        comparison = -1;
      } else if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === "desc" ? -comparison : comparison;
    });
  }, [data, sortState, sortable]);

  const handleSort = (columnKey: keyof T | string) => {
    if (!sortable) return;

    const keyString = String(columnKey);
    setSortState((prev) => {
      if (prev?.key === keyString) {
        if (prev.direction === "asc") {
          return { key: keyString, direction: "desc" };
        } else {
          return null;
        }
      } else {
        return { key: keyString, direction: "asc" };
      }
    });
  };

  // Render cell value
  const renderCell = (column: Column<T>, record: T, index: number) => {
    if (column.render) {
      return column.render(record[column.key as keyof T], record, index);
    }

    const value = record[column.key as keyof T];
    if (value === null || value === undefined) return "-";
    return String(value);
  };

  if (loading) {
    return <LoadingTable rows={5} columns={columns.length} />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow">
        <EmptyState
          title={emptyMessage}
          icon={emptyIcon}
          action={emptyAction}
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key) || index}
                  className={`
                    px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider
                    ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                        ? "text-right"
                        : "text-left"
                    }
                    ${
                      sortable && column.sortable !== false
                        ? "cursor-pointer hover:bg-gray-100"
                        : ""
                    }
                    ${column.className || ""}
                  `}
                  style={{ width: column.width }}
                  onClick={() =>
                    sortable &&
                    column.sortable !== false &&
                    handleSort(String(column.key))
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortable && column.sortable !== false && (
                      <SortIcon
                        direction={
                          sortState?.key === String(column.key)
                            ? sortState.direction
                            : undefined
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={`
                  ${onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  transition-colors duration-150
                `}
                onClick={() => onRowClick?.(record, index)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={String(column.key) || colIndex}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-900
                      ${
                        column.align === "center"
                          ? "text-center"
                          : column.align === "right"
                          ? "text-right"
                          : "text-left"
                      }
                      ${column.className || ""}
                    `}
                  >
                    {renderCell(column, record, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() =>
                pagination.onChange(pagination.current - 1, pagination.pageSize)
              }
              disabled={pagination.current <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                pagination.onChange(pagination.current + 1, pagination.pageSize)
              }
              disabled={
                pagination.current * pagination.pageSize >= pagination.total
              }
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.current - 1) * pagination.pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.current * pagination.pageSize,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() =>
                    pagination.onChange(
                      pagination.current - 1,
                      pagination.pageSize
                    )
                  }
                  disabled={pagination.current <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() =>
                    pagination.onChange(
                      pagination.current + 1,
                      pagination.pageSize
                    )
                  }
                  disabled={
                    pagination.current * pagination.pageSize >= pagination.total
                  }
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
