
import React from 'react';

export interface ColumnDefinition<T, K extends keyof T> {
  key: K;
  header: string;
  render?: (item: T) => React.ReactNode; // Optional custom render function
  width?: string; // e.g., 'w-1/4', 'w-32'
}

interface TableProps<T, K extends keyof T> {
  data: T[];
  columns: ColumnDefinition<T, K>[];
  onRowClick?: (item: T) => void;
  emptyStateMessage?: string;
}

const Table = <T extends { id: string | number }, K extends keyof T,>({
  data,
  columns,
  onRowClick,
  emptyStateMessage = "Nenhum dado encontrado."
}: TableProps<T, K>): React.ReactNode => {
  if (!data || data.length === 0) {
    return <div className="text-center py-10 text-clinic-text-secondary">{emptyStateMessage}</div>;
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 bg-clinic-surface">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-clinic-text-secondary uppercase tracking-wider ${col.width || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item) => (
            <tr 
              key={item.id} 
              className={`${onRowClick ? 'hover:bg-clinic-background cursor-pointer' : ''} transition-colors duration-150`}
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map((col) => (
                <td key={`${item.id}-${String(col.key)}`} className="px-6 py-4 whitespace-nowrap text-sm text-clinic-text-primary">
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
