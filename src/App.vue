<script setup lang="ts">
// Main application layout shell
</script>

<template>
  <router-view />
</template>

<style>
/* App specific global styles (dark mode base) */
:root {
  color-scheme: dark;
}
body {
  margin: 0;
  padding: 0;
  background-color: #09090b;
  color: #fafafa;
  font-family: 'Inter', system-ui, sans-serif;
}
</style>
