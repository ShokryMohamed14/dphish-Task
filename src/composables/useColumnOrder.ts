import { ref, watch, unref, type Ref } from 'vue';
import type { Column } from '../types/table';

export function useColumnOrder(initialColumns: Ref<Column[]> | Column[]) {
  const columnOrder = ref<string[]>([]);
  
  watch(() => unref(initialColumns), (cols) => {
    if (columnOrder.value.length === 0 || columnOrder.value.length !== cols.length) {
      columnOrder.value = cols.map(c => c.key);
    }
  }, { immediate: true });

  const moveColumn = (dragKey: string, dropKey: string) => {
    const list = [...columnOrder.value];
    const dragIndex = list.indexOf(dragKey);
    const dropIndex = list.indexOf(dropKey);

    if (dragIndex === -1 || dropIndex === -1 || dragIndex === dropIndex) return;

    const [draggedItem] = list.splice(dragIndex, 1);
    list.splice(dropIndex, 0, draggedItem);
    
    columnOrder.value = list;
  };

  return {
    columnOrder,
    moveColumn,
  };
}
