import { ref, computed, watch, type Ref } from 'vue';
import { debounce } from 'lodash-es';

export function useSearch<T>(initialData: Ref<T[]>, visibleColumnsMap: Ref<Record<string, boolean>>) {
  const searchQuery = ref('');
  const debouncedQuery = ref('');

  const updateDebouncedQuery = debounce((val: string) => {
    debouncedQuery.value = val;
  }, 300);

  watch(searchQuery, (newVal) => {
    updateDebouncedQuery(newVal);
  });

  const filteredData = computed(() => {
    const query = debouncedQuery.value.trim().toLowerCase();
    if (!query) return initialData.value;

    return initialData.value.filter((row) => {
      const visibleKeys = Object.keys(visibleColumnsMap.value).filter(
        (key) => visibleColumnsMap.value[key]
      );

      return visibleKeys.some((key) => {
        const value = (row as any)[key];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(query);
      });
    });
  });

  return {
    searchQuery,
    filteredData,
  };
}
