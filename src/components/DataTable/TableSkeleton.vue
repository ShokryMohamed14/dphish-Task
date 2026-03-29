<template>
  <tbody class="dt-skeleton-body">
    <tr v-for="i in rows" :key="i" class="dt-skeleton-row">
      <td v-for="col in columnsCount" :key="col" class="dt-skeleton-cell">
        <div class="dt-skeleton-box" :style="{ width: randomWidth() }"></div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
interface Props {
  rows?: number;
  columnsCount?: number;
}

withDefaults(defineProps<Props>(), {
  rows: 5,
  columnsCount: 3
});

const randomWidth = () => {
  return Math.floor(Math.random() * 40 + 40) + '%';
};
</script>
