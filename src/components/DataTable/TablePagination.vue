<template>
  <div class="dt-pagination">
    <div class="dt-page-info">
      Showing <strong>{{ startIndex + 1 }}</strong> to <strong>{{ Math.min(endIndex, totalRows) }}</strong> of <strong>{{ totalRows }}</strong> results
    </div>

    <div class="dt-page-controls">
      <div class="dt-rows-per-page">
        <label>Rows per page:</label>
        <select :value="rowsPerPage" @change="$emit('update:rowsPerPage', Number(($event.target as HTMLSelectElement).value))">
          <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">{{ opt }}</option>
        </select>
      </div>

      <div class="dt-page-buttons">
        <button class="dt-btn dt-btn-icon" :disabled="currentPage === 1" @click="$emit('prev')">
          <IconChevronLeft />
        </button>
        <span class="dt-current-page">Page {{ currentPage }} of {{ totalPages }}</span>
        <button class="dt-btn dt-btn-icon" :disabled="currentPage === totalPages" @click="$emit('next')">
          <IconChevronRight />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import IconChevronLeft from '../icons/IconChevronLeft.vue';
import IconChevronRight from '../icons/IconChevronRight.vue';

interface Props {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  rowsPerPage: number;
  rowsPerPageOptions: number[];
}

const props = defineProps<Props>();

defineEmits<{
  (e: 'update:rowsPerPage', value: number): void;
  (e: 'next'): void;
  (e: 'prev'): void;
  (e: 'goToPage', page: number): void;
}>();

const startIndex = computed(() => (props.currentPage - 1) * props.rowsPerPage);
const endIndex = computed(() => startIndex.value + props.rowsPerPage);
</script>
