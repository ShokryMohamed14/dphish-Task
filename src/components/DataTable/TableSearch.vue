<template>
  <div class="dt-search">
    <div class="dt-search-wrapper">
      <IconSearch class="dt-search-icon" />
      <input 
        type="text" 
        :value="modelValue" 
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" 
        placeholder="Search all columns..." 
        class="dt-search-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSearch from '../icons/IconSearch.vue';

interface Props {
  modelValue?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: ''
});

defineEmits(['update:modelValue']);
</script>
