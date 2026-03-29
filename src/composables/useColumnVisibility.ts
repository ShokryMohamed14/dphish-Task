import { ref, computed } from 'vue';
import type { Column } from '../types/table';

export function useColumnVisibility(columnsConfig: Column[]) {
  const visibleColumnsMap = ref<Record<string, boolean>>({});

  columnsConfig.forEach(col => {
    visibleColumnsMap.value[col.key] = col.hidden !== true;
  });

  const toggleColumnVisibility = (key: string) => {
    visibleColumnsMap.value[key] = !visibleColumnsMap.value[key];
  };

  const visibleColumns = computed(() => {
    return columnsConfig.filter(col => visibleColumnsMap.value[col.key]);
  });

  return {
    visibleColumnsMap,
    toggleColumnVisibility,
    visibleColumns,
  };
}
