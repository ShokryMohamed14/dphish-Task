import { ref } from 'vue';

export function useVirtualScroll(rowHeight = 40, containerHeight = 400, bufferSize = 5) {
  const scrollTop = ref(0);
  const containerHeightRef = ref(containerHeight);

  const onScroll = (e: Event) => {
    scrollTop.value = (e.target as HTMLElement).scrollTop;
  };

  const getVirtualState = (totalRowsLength: number) => {
    const totalHeight = totalRowsLength * rowHeight;
    const startIndex = Math.max(0, Math.floor(scrollTop.value / rowHeight) - bufferSize);

    const visibleCount = Math.ceil(containerHeightRef.value / rowHeight) + (bufferSize * 2);
    const endIndex = Math.min(totalRowsLength, startIndex + visibleCount);

    const offsetY = startIndex * rowHeight;

    return {
      totalHeight,
      startIndex,
      endIndex,
      offsetY,
    };
  };

  const updateContainerHeight = (height: number) => {
    containerHeightRef.value = height;
  };

  return {
    scrollTop,
    onScroll,
    getVirtualState,
    updateContainerHeight
  };
}
