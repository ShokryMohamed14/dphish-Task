import { ref, computed, watch, type Ref } from 'vue';

export function usePagination<T>(filteredData: Ref<T[]>) {
  const currentPage = ref<number>(1);
  const rowsPerPage = ref<number>(10);
  const rowsPerPageOptions = [10, 25, 50, 100];

  watch(filteredData, () => {
    currentPage.value = 1;
  });

  const totalRows = computed(() => filteredData.value.length);
  const totalPages = computed(() => Math.ceil(totalRows.value / rowsPerPage.value) || 1);

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return filteredData.value.slice(start, end);
  });

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => goToPage(currentPage.value + 1);
  const prevPage = () => goToPage(currentPage.value - 1);

  return {
    currentPage,
    rowsPerPage,
    rowsPerPageOptions,
    totalPages,
    totalRows,
    paginatedData,
    goToPage,
    nextPage,
    prevPage,
  };
}
