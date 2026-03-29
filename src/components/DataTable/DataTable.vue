<template>
  <div class="dt-container" :id="tableId">
    <!-- Top toolbar -->
    <div class="dt-toolbar">
      <TableSearch v-model="searchQuery" />
      <ColumnVisibilityMenu 
        :columns="columns" 
        :visibleColumnsMap="visibleColumnsMap" 
        @toggle="toggleColumnVisibility" 
      />
    </div>

    <!-- Table container -->
    <div class="dt-table-wrapper" ref="tableWrapper" @scroll="onScroll">
      <table class="dt-table">
        <colgroup>
          <col v-for="col in orderedVisibleColumns" :key="col.key" :style="{ width: col.width || 'auto' }" />
        </colgroup>
        
        <TableHeader 
          :columns="orderedVisibleColumns"
          :sortColumn="sortColumn"
          :sortDirection="sortDirection"
          @sort="toggleSort($event, true)"
          @dragstart="onDragStart"
          @dragover="onDragOver"
          @drop="onDrop"
        />

        <TableSkeleton v-if="loading" :rows="rowsPerPage" :columnsCount="orderedVisibleColumns.length" />
        
        <tbody class="dt-body" v-else-if="!enableVirtualScroll">
          <tr v-for="row in paginatedData" :key="row[rowKey]" class="dt-row">
            <td v-for="col in orderedVisibleColumns" :key="col.key" class="dt-cell">
              <!-- Re-expose the slot to the parent -->
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="!paginatedData.length" class="dt-empty-row">
            <td :colspan="orderedVisibleColumns.length" class="dt-empty-cell">
              No results found.
            </td>
          </tr>
        </tbody>
        
        <!-- Virtual scroll body placeholder -->
        <tbody class="dt-body dt-virtual-body" v-else>
          <!-- Buffer top -->
          <tr v-if="virtualState.offsetY > 0" :style="{ height: `${virtualState.offsetY}px` }" class="dt-virtual-spacer">
             <td :colspan="orderedVisibleColumns.length"></td>
          </tr>
          
          <tr v-for="row in virtualVisibleData" :key="row[rowKey]" class="dt-row">
            <td v-for="col in orderedVisibleColumns" :key="col.key" class="dt-cell">
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          
          <tr v-if="!virtualVisibleData.length" class="dt-empty-row">
            <td :colspan="orderedVisibleColumns.length" class="dt-empty-cell">
              No results found.
            </td>
          </tr>
          
          <!-- Buffer bottom -->
          <tr v-if="virtualState.totalHeight - virtualState.offsetY - (virtualVisibleData.length * rowHeight) > 0" 
              :style="{ height: `${virtualState.totalHeight - virtualState.offsetY - (virtualVisibleData.length * rowHeight)}px` }" 
              class="dt-virtual-spacer">
             <td :colspan="orderedVisibleColumns.length"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination footer -->
    <TablePagination 
      v-if="!enableVirtualScroll"
      :currentPage="currentPage" 
      :totalPages="totalPages" 
      :totalRows="totalRows" 
      :rowsPerPage="rowsPerPage" 
      :rowsPerPageOptions="rowsPerPageOptions"
      @update:rowsPerPage="rowsPerPage = $event"
      @next="nextPage"
      @prev="prevPage"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef, onMounted } from 'vue';
import type { Column } from '../../types/table';

import TableSearch from './TableSearch.vue';
import ColumnVisibilityMenu from './ColumnVisibilityMenu.vue';
import TableHeader from './TableHeader.vue';
import TableSkeleton from './TableSkeleton.vue';
import TablePagination from './TablePagination.vue';

import { useSort } from '../../composables/useSort';
import { useSearch } from '../../composables/useSearch';
import { usePagination } from '../../composables/usePagination';
import { useColumnVisibility } from '../../composables/useColumnVisibility';
import { useTablePreferences } from '../../composables/useTablePreferences';
import { useVirtualScroll } from '../../composables/useVirtualScroll';
import { useColumnOrder } from '../../composables/useColumnOrder';

interface Props {
  tableId: string;
  columns: Column[];
  data: any[];
  loading?: boolean;
  rowKey?: string;
  enableVirtualScroll?: boolean;
  rowHeight?: number;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  rowKey: 'id',
  enableVirtualScroll: false,
  rowHeight: 53
});

defineSlots<{
  [key: `cell-${string}`]: (props: { row: any; value: any }) => any;
}>();

const sourceData = toRef(props, 'data');
const { visibleColumnsMap, toggleColumnVisibility, visibleColumns } = useColumnVisibility(props.columns);
const { searchQuery, filteredData } = useSearch(sourceData, visibleColumnsMap);
const { sortColumn, sortDirection, toggleSort, sortedData } = useSort(filteredData);

const {
  currentPage,
  rowsPerPage,
  rowsPerPageOptions,
  totalPages,
  totalRows,
  paginatedData,
  nextPage,
  prevPage
} = usePagination(sortedData);

const { columnOrder, moveColumn } = useColumnOrder(props.columns);

const orderedVisibleColumns = computed(() => {
  return visibleColumns.value.slice().sort((a, b) => {
    return columnOrder.value.indexOf(a.key) - columnOrder.value.indexOf(b.key);
  });
});

const draggedColumnKey = ref<string | null>(null);

const onDragStart = (key: string) => { draggedColumnKey.value = key; };
const onDragOver = (_key: string) => { };
const onDrop = (key: string) => {
  if (draggedColumnKey.value && draggedColumnKey.value !== key) {
    moveColumn(draggedColumnKey.value, key);
  }
  draggedColumnKey.value = null;
};

// @ts-ignore
useTablePreferences(props.tableId, {
  sortColumn,
  sortDirection,
  rowsPerPage,
  visibleColumnsMap,
  columnOrder
});

const tableWrapper = ref<HTMLElement | null>(null);
const { onScroll: virtualOnScroll, getVirtualState, updateContainerHeight } = useVirtualScroll(props.rowHeight, 400);

const onScroll = (e: Event) => {
  if (props.enableVirtualScroll) {
    virtualOnScroll(e);
  }
};

const virtualState = computed(() => {
  return getVirtualState(sortedData.value.length);
});

const virtualVisibleData = computed(() => {
  if (!props.enableVirtualScroll) return [];
  return sortedData.value.slice(virtualState.value.startIndex, virtualState.value.endIndex);
});

onMounted(() => {
  if (props.enableVirtualScroll && tableWrapper.value) {
    updateContainerHeight(tableWrapper.value.clientHeight);
    window.addEventListener('resize', () => {
      if (tableWrapper.value) updateContainerHeight(tableWrapper.value.clientHeight);
    });
  }
});
</script>
