import { watch, type Ref } from 'vue';

export interface BaseStateRef {
  sortColumn: Ref<string | null>;
  sortDirection: Ref<'asc' | 'desc' | 'none'>;
  rowsPerPage: Ref<number>;
  visibleColumnsMap: Ref<Record<string, boolean>>;
  columnOrder: Ref<string[]>;
}

export function useTablePreferences(tableId: string, stateRef: BaseStateRef) {
  const PREFS_KEY = `datatable_prefs_${tableId}`;

  const loadPreferences = () => {
    try {
      if (!tableId) return false;
      const saved = localStorage.getItem(PREFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load table preferences:', e);
    }
    return false;
  };

  const savePreferences = (state: any) => {
    try {
      if (!tableId) return;
      localStorage.setItem(PREFS_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Failed to save table preferences:', e);
    }
  };

  const savedState = loadPreferences();
  if (savedState) {
    if (savedState.sortColumn !== undefined) stateRef.sortColumn.value = savedState.sortColumn;
    if (savedState.sortDirection) stateRef.sortDirection.value = savedState.sortDirection;
    if (savedState.rowsPerPage) stateRef.rowsPerPage.value = savedState.rowsPerPage;
    if (savedState.visibleColumnsMap) {
      Object.entries(savedState.visibleColumnsMap).forEach(([k, v]) => {
        stateRef.visibleColumnsMap.value[k] = v as boolean;
      });
    }
    if (savedState.columnOrder) stateRef.columnOrder.value = savedState.columnOrder;
  }

  watch(
    () => ({
      sortColumn: stateRef.sortColumn.value,
      sortDirection: stateRef.sortDirection.value,
      rowsPerPage: stateRef.rowsPerPage.value,
      visibleColumnsMap: { ...stateRef.visibleColumnsMap.value },
      columnOrder: [...(stateRef.columnOrder.value || [])],
    }),
    (newState) => {
      savePreferences(newState);
    },
    { deep: true }
  );

  return {
    loadPreferences,
    savePreferences,
  };
}
