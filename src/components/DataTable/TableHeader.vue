<template>
  <thead class="dt-header">
    <tr>
      <th 
        v-for="col in columns" 
        :key="col.key"
        :class="['dt-th', { 'dt-sortable': col.sortable }]"
        draggable="true"
        @dragstart="$emit('dragstart', col.key)"
        @dragover.prevent="$emit('dragover', col.key)"
        @drop="$emit('drop', col.key)"
        @dragenter.prevent
        @click="col.sortable ? $emit('sort', col.key) : null"
      >
        <div class="dt-th-content">
          <span>{{ col.label }}</span>
          <span v-if="col.sortable" class="dt-sort-icon">
            <IconSortIdle v-if="sortColumn !== col.key || sortDirection === 'none'" class="dt-sort-idle" />
            <IconSortAsc v-else-if="sortDirection === 'asc'" />
            <IconSortDesc v-else />
          </span>
        </div>
      </th>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import type { Column } from '../../types/table';
import IconSortIdle from '../icons/IconSortIdle.vue';
import IconSortAsc from '../icons/IconSortAsc.vue';
import IconSortDesc from '../icons/IconSortDesc.vue';

interface Props {
  columns: Column[];
  sortColumn?: string | null;
  sortDirection?: 'asc' | 'desc' | 'none';
}

withDefaults(defineProps<Props>(), {
  sortColumn: null,
  sortDirection: 'none'
});

defineEmits<{
  (e: 'sort', key: string): void;
  (e: 'dragstart', key: string): void;
  (e: 'dragover', key: string): void;
  (e: 'drop', key: string): void;
}>();
</script>
