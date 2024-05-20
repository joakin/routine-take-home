<script setup>
import { defineProps } from "vue";

const props = defineProps({
  selected: Boolean,
});
</script>

<template>
  <div
    class="console-suggestion-item"
    v-bind:class="{ selected: props.selected }"
  >
    <slot />
  </div>
</template>

<style scoped>
.console-suggestion-item {
  font-weight: var(--font-weight-md);
  font-size: var(--font-size-s);

  padding: var(--space-xxxs) var(--space-s);

  border-radius: 1px;
}

.selected {
  background-color: var(--background-color-selected);
}
</style>
