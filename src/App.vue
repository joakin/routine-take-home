<script setup lang="ts">
import { ref } from "vue";
import ConsoleInput from "./components/ConsoleInput.vue";
import ConsoleSuggestions from "./components/ConsoleSuggestions.vue";
import type { Suggestions } from "./components/ConsoleSuggestions.vue";

const suggestions = ref<Suggestions | null>(null);

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
// const suggestions = { kind: "Fetching", response: test_suggestions } as const;
// const suggestions = { kind: "Error", err: new Error("Couldn't fetch suggestions") } as const;

async function onAutocomplete(word: string) {
  suggestions.value = { kind: "Fetching", response: [] };
  await new Promise((resolve) => setTimeout(resolve, 2000));
  suggestions.value = { kind: "Success", response: test_suggestions };
}

function onAutocompleteClose() {
  suggestions.value = null;
}
</script>

<template>
  <main>
    <div class="console">
      <ConsoleInput
        :onAutocomplete="onAutocomplete"
        :onAutocompleteClose="onAutocompleteClose"
      />
      <transition name="fade-up" v-if="suggestions">
        <ConsoleSuggestions
          class="console-suggestions"
          :suggestions="suggestions"
        />
      </transition>
    </div>
  </main>
</template>

<style>
.fade-up-enter-active,
.fade-up-leave-active {
  transition:
    transform 0.5s,
    opacity 0.5s;
}

.fade-up-enter,
.fade-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>

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
