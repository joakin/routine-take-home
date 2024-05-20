<script setup lang="ts">
import ConsoleInput from "./components/ConsoleInput.vue";
import ConsoleSuggestions from "./components/ConsoleSuggestions.vue";

const suggestions = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
</script>

<template>
  <main>
    <div class="console">
      <ConsoleInput />
      <ConsoleSuggestions
        class="console-suggestions"
        :suggestions="suggestions"
      />
    </div>
  </main>
</template>

<style scoped>
.console {
  position: relative;
}
.console-suggestions {
  position: absolute;
  top: 74px;
  left: 0;
}
</style>
