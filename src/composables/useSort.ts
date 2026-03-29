import { ref, computed, type Ref } from 'vue';

export function useSort<T>(initialData: Ref<T[]>) {
  const sortColumn = ref<string | null>(null);
  const sortDirection = ref<'none' | 'asc' | 'desc'>('none');

  const toggleSort = (columnKey: string, isSortable?: boolean) => {
    if (!isSortable) return;

    if (sortColumn.value === columnKey) {
      if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc';
      } else if (sortDirection.value === 'desc') {
        sortColumn.value = null;
        sortDirection.value = 'none';
      }
    } else {
      sortColumn.value = columnKey;
      sortDirection.value = 'asc';
    }
  };

  const sortedData = computed(() => {
    if (sortDirection.value === 'none' || !sortColumn.value) {
      return initialData.value;
    }

    return [...initialData.value].sort((a, b) => {
      const valA = (a as any)[sortColumn.value!];
      const valB = (b as any)[sortColumn.value!];

      if (valA === valB) return 0;
      
      const comparison = valA > valB ? 1 : -1;
      return sortDirection.value === 'asc' ? comparison : -comparison;
    });
  });

  return {
    sortColumn,
    sortDirection,
    toggleSort,
    sortedData,
  };
}
