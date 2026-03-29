export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  hidden?: boolean;
  width?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  score: number;
  [key: string]: any; // Allow indexing
}

export interface TableState {
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | 'none';
  rowsPerPage: number;
  visibleColumnsMap: Record<string, boolean>;
  columnOrder: string[];
}
