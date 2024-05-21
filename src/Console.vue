<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { Ref } from "vue";
import ConsoleInput from "./components/ConsoleInput.vue";
import ConsoleSuggestions from "./components/ConsoleSuggestions.vue";
import type { Suggestions } from "./api/suggestions";
import * as suggestionsApi from "./api/suggestions";

const suggestions = ref<Suggestions | null>(null);
const focusedSuggestion = ref<string>("");
const consoleInput = ref<InstanceType<typeof ConsoleInput> | null>(null);

async function onAutocomplete(word: string) {
  suggestions.value = suggestionsApi.getLoadingSuggestions(suggestions.value);
  suggestions.value = await suggestionsApi.getSuggestions(word);

  // Reset focused suggestion, and next tick re-focus it. Avoids scroll bug when
  // the same suggestion has changed position in the suggestions list.
  focusedSuggestion.value = "";
  await nextTick();
  const response = suggestionsResponse(suggestions);
  focusedSuggestion.value = response ? response[0] : "";
}

function suggestionsResponse(
  suggestions: Ref<Suggestions | null>,
): string[] | null {
  return suggestions.value &&
    (suggestions.value.kind === "Success" ||
      suggestions.value.kind === "Loading") &&
    suggestions.value.response &&
    suggestions.value.response.length > 0
    ? suggestions.value.response
    : null;
}

function onAutocompleteClose() {
  suggestions.value = null;
}

function onFocusedSuggestion(suggestion: string) {
  focusedSuggestion.value = suggestion;
}

function onSelectedSuggestion(suggestion: string) {
  onAutocompleteClose();
  if (consoleInput.value && suggestion.length > 0) {
    consoleInput.value.completeWord(suggestion);
  }
}

function onFocusPreviousSuggestion() {
  const response = suggestionsResponse(suggestions);
  if (response) {
    const index = response.indexOf(focusedSuggestion.value);
    if (index > 0) {
      onFocusedSuggestion(response[index - 1]);
    }
  }
}

function onFocusNextSuggestion() {
  const response = suggestionsResponse(suggestions);
  if (response) {
    const index = response.indexOf(focusedSuggestion.value);
    if (index < response.length - 1) {
      onFocusedSuggestion(response[index + 1]);
    }
  }
}

function onFocusFirstSuggestion() {
  const response = suggestionsResponse(suggestions);
  if (response) {
    onFocusedSuggestion(response[0]);
  }
}

function onFocusLastSuggestion() {
  const response = suggestionsResponse(suggestions);
  if (response) {
    onFocusedSuggestion(response[response.length - 1]);
  }
}
</script>

<template>
  <main>
    <div class="console">
      <ConsoleInput
        ref="consoleInput"
        :completionsOpen="Boolean(suggestions)"
        @autocomplete="onAutocomplete"
        @autocompleteClose="onAutocompleteClose"
        @enter="onSelectedSuggestion(focusedSuggestion)"
        @previousCompletion="onFocusPreviousSuggestion"
        @nextCompletion="onFocusNextSuggestion"
        @firstCompletion="onFocusFirstSuggestion"
        @lastCompletion="onFocusLastSuggestion"
      />
      <Transition name="fade-up">
        <ConsoleSuggestions
          v-if="suggestions"
          class="console-suggestions"
          :suggestions="suggestions"
          :focusedSuggestion="focusedSuggestion"
          @select="onSelectedSuggestion"
          @focus="onFocusedSuggestion"
        />
      </Transition>
    </div>
  </main>
</template>

<style>
.fade-up-enter-active {
  transition:
    transform 0.15s ease-in,
    opacity 0.2s ease-in;
}

.fade-up-leave-active {
  transition:
    transform 0.2s ease-out,
    opacity 0.1s ease-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  transform-origin: top center;
  transform: perspective(500px) translateY(-20px) rotateX(20deg);
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
