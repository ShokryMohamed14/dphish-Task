<template>
  <div class="dt-column-menu" v-if="columns.length > 0">
    <button class="dt-btn dt-menu-btn" @click="isOpen = !isOpen">
      <IconMenu />
      Columns
    </button>

    <div v-if="isOpen" class="dt-menu-dropdown">
      <div class="dt-menu-header">Show/Hide Columns</div>
      <div class="dt-menu-list">
        <label v-for="col in columns" :key="col.key" class="dt-menu-item">
          <input 
            type="checkbox" 
            :checked="visibleColumnsMap[col.key]" 
            @change="$emit('toggle', col.key)"
          />
          <span>{{ col.label }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Column } from '../../types/table';
import IconMenu from '../icons/IconMenu.vue';

interface Props {
  columns: Column[];
  visibleColumnsMap: Record<string, boolean>;
}

defineProps<Props>();
defineEmits<{
  (e: 'toggle', key: string): void
}>();

const isOpen = ref(false);
</script>
