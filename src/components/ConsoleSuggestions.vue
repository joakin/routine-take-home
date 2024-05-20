<script setup lang="ts">
import ConsoleSuggestionItem from "./ConsoleSuggestionItem.vue";

export type Suggestions =
  | { kind: "NotAsked" }
  | {
      kind: "Fetching";
      // The previous response if any
      response: string[];
    }
  | {
      kind: "Success";
      response: string[];
    }
  | {
      kind: "Error";
      err: Error;
    };

defineProps<{ suggestions: Suggestions }>();
</script>

<template>
  <div
    class="console-suggestions"
    v-bind:class="{ 'is-loading': suggestions.kind === 'Fetching' }"
  >
    <div class="console-suggestions-inner">
      <template v-if="suggestions.kind === 'NotAsked'">
        <p class="placeholder">Type a name to get some suggestions.</p>
      </template>
      <template v-else-if="suggestions.kind === 'Error'">
        <p class="placeholder">{{ suggestions.err.message }}</p>
      </template>
      <template
        v-else-if="
          suggestions.kind === 'Fetching' || suggestions.kind === 'Success'
        "
      >
        <template v-if="suggestions.response.length === 0">
          <p class="placeholder">
            <template v-if="suggestions.kind === 'Fetching'">
              Searching...
            </template>
            <template v-else> No suggestions available. </template>
          </p>
        </template>
        <template v-else>
          <ConsoleSuggestionItem
            v-for="suggestion in suggestions.response"
            :key="suggestion"
            :selected="suggestion === 'Suggestion 1'"
          >
            {{ suggestion }}
          </ConsoleSuggestionItem>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.console-suggestions {
  width: 100%;
  padding: var(--space);

  --border-radius: 3px;
  border-radius: var(--border-radius);
  background-color: var(--background-color);
  color: var(--color-text);
  position: relative;

  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.2);
}

.console-suggestions.is-loading {
  --gradient-color-stop1: var(--color-grey-3);
  --gradient-color-stop2: var(--color-grey-7);
  animation: gradientMove 2s linear infinite;
}
.console-suggestions.is-loading::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  border-radius: var(--border-radius) var(--border-radius) 0 0;
  background: linear-gradient(
    to right,
    var(--gradient-color-stop1),
    var(--gradient-color-stop2),
    var(--gradient-color-stop1)
  );
  background-size: 200% 100%;
  animation: gradientAnimate 1s linear infinite;
}

@keyframes gradientAnimate {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: -200% 0%;
  }
}

.console-suggestions-inner {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding-right: var(--space);
}
.console-suggestions-inner::-webkit-scrollbar {
  width: 4px;
}

.console-suggestions-inner::-webkit-scrollbar-thumb {
  background-color: var(--background-color-scrollbar);
  border-radius: 2px;
}
.console-suggestions-inner::-webkit-scrollbar-thumb:hover {
  background-color: var(--background-color-scrollbar-hover);
}

.placeholder {
  font-weight: var(--font-weight-md);
  font-size: var(--font-size-s);
  color: var(--color-text-placeholder);
}
</style>
