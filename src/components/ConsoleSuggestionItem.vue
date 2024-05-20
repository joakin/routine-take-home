<script setup lang="ts">
const props = defineProps<{
  focused: boolean;
}>();

const emit = defineEmits<{
  select: [];
  focus: [];
}>();
</script>

<template>
  <button
    class="console-suggestion-item"
    v-bind:class="{ focused: focused }"
    @click="emit('select')"
    @focus="emit('focus')"
  >
    <slot />
  </button>
</template>

<style scoped>
.console-suggestion-item {
  display: block;
  width: 100%;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;

  font-weight: var(--font-weight-md);
  font-size: var(--font-size-s);

  padding: var(--space-xxxs) var(--space-s);

  border-radius: 1px;

  transition: background-color 0.3s ease;
}

.focused,
.console-suggestion-item:focus {
  background-color: var(--background-color-selected);
}

.console-suggestion-item:hover {
  background-color: var(--background-color-hovered);
}
.console-suggestion-item:focus {
  outline: none;
}
</style>
