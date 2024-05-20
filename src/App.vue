<script setup lang="ts">
import ConsoleInput from "./components/ConsoleInput.vue";
import ConsoleSuggestions from "./components/ConsoleSuggestions.vue";

const test_suggestions = [
  "Suggestion 1",
  "Suggestion 2",
  "Suggestion 3",
  "Suggestion 4",
  "Suggestion 5",
  "Suggestion 6",
  "Suggestion 7",
  "Suggestion 8",
  "Suggestion 9",
  "Suggestion 10",
];
// const suggestions = { kind: "NotAsked" } as const;
// const suggestions = { kind: "Success", response: [] } as const;
// const suggestions = { kind: "Success", response: test_suggestions } as const;
// const suggestions = { kind: "Fetching", response: [] } as const;
const suggestions = { kind: "Fetching", response: test_suggestions } as const;
// const suggestions = { kind: "Error", err: new Error("Couldn't fetch suggestions") } as const;
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
