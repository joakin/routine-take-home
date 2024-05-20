<script setup lang="ts">
import ConsoleSuggestionItem from "./ConsoleSuggestionItem.vue";

defineProps<{ suggestions: string[] }>();
</script>

<template>
  <div class="console-suggestions">
    <ConsoleSuggestionItem
      v-for="suggestion in suggestions"
      :key="suggestion"
      :selected="suggestion === 'Suggestion 1'"
    >
      {{ suggestion }}
    </ConsoleSuggestionItem>
  </div>
</template>

<style scoped>
.console-suggestions {
  width: 100%;
  max-height: 200px;
  padding: var(--space) var(--space-l) var(--space) var(--space);
  overflow-y: auto;

  border-radius: 3px;
  background-color: var(--background-color);
  color: var(--color-text);

  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
  margin-top: -2px;
}

.console-suggestions::-webkit-scrollbar {
  width: 4px;
}

.console-suggestions::-webkit-scrollbar-thumb {
  background-color: var(--background-color-scrollbar);
  border-radius: 2px;
}
.console-suggestions::-webkit-scrollbar-thumb:hover {
  background-color: var(--background-color-scrollbar-hover);
}
</style>
