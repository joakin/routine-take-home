<script setup lang="ts">
import { ref } from "vue";
import ConsoleInput from "./components/ConsoleInput.vue";
import ConsoleSuggestions from "./components/ConsoleSuggestions.vue";
import type { Suggestions } from "./api/suggestions";
import * as suggestionsApi from "./api/suggestions";

const suggestions = ref<Suggestions | null>(null);
const focusedSuggestion = ref<string>("");

async function onAutocomplete(word: string) {
  suggestions.value = suggestionsApi.getLoadingSuggestions(suggestions.value);
  suggestions.value = await suggestionsApi.getSuggestions(word);
  focusedSuggestion.value =
    suggestions.value &&
    (suggestions.value.kind === "Success" ||
      suggestions.value.kind === "Loading") &&
    suggestions.value.response &&
    suggestions.value.response.length > 0
      ? suggestions.value.response[0]
      : "";
}

function onAutocompleteClose() {
  suggestions.value = null;
}

function onFocusedSuggestion(suggestion: string) {
  focusedSuggestion.value = suggestion;
}

function onSelectedSuggestion(suggestion: string) {
  onAutocompleteClose();
  console.log("selected", suggestion);
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
          :focusedSuggestion="focusedSuggestion"
          @select="onSelectedSuggestion"
          @focus="onFocusedSuggestion"
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
