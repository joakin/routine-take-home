<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { defineProps, defineExpose } from "vue";
import { useDebouncedRef } from "../utils/vue";
import * as helpers from "./ConsoleInput/helpers";

const props = defineProps<{
  completionsOpen: boolean;
}>();

const emit = defineEmits<{
  enter: [];
  autocomplete: [word: string];
  autocompleteClose: [];
  previousCompletion: [];
  nextCompletion: [];
  firstCompletion: [];
  lastCompletion: [];
}>();

const textInput = ref<HTMLDivElement | null>(null);
const isEmpty = ref(true);

defineExpose({
  completeWord(word: string) {
    if (textInput.value) {
      helpers.completeChipContent(textInput.value, word);
    }
  },
});

onMounted(() => {
  if (textInput.value) {
    textInput.value.focus();
  }
});

/*
watch(text, (newText) => {
  const selection = window.getSelection();
  const cursorPos = selection?.getRangeAt(0).startOffset;
  for (const match of newText.matchAll(/(I pick you\s+)(\w*)(\s+|$)/g)) {
    if (match) {
      const cursorPosition = cursorPos || 0;
      const wordStart = (match.index || 0) + match[1].length;
      const wordEnd = wordStart + match[2].length;
      if (cursorPosition >= wordStart && cursorPosition <= wordEnd) {
        emit("autocomplete", match[2]);
        return;
      }
    }
  }
  emit("autocompleteClose");
});
*/

const onInput = (event: InputEvent) => {
  if (textInput.value) {
    helpers.handleInputChange(textInput.value, event);
    isEmpty.value = textInput.value.textContent?.length === 0;
  }
};

const onKeyDown = (event: KeyboardEvent) => {
  if (props.completionsOpen) {
    if (event.key === "ArrowUp" || (event.key === "p" && event.ctrlKey)) {
      emit("previousCompletion");
      event.preventDefault();
    } else if (
      event.key === "ArrowDown" ||
      (event.key === "n" && event.ctrlKey)
    ) {
      emit("nextCompletion");
      event.preventDefault();
    } else if (event.key === "Tab" && event.shiftKey) {
      emit("previousCompletion");
      event.preventDefault();
    } else if (event.key === "Tab") {
      emit("nextCompletion");
      event.preventDefault();
    } else if (event.key === "Enter") {
      emit("enter");
      event.preventDefault();
    } else if (event.key === "Home" || (event.key === "a" && event.ctrlKey)) {
      emit("firstCompletion");
      event.preventDefault();
    } else if (event.key === "End" || (event.key === "e" && event.ctrlKey)) {
      emit("lastCompletion");
      event.preventDefault();
    }
  }
};
</script>

<template>
  <div
    class="console-input"
    ref="textInput"
    contenteditable="true"
    :class="{
      'no-background': !isEmpty && !props.completionsOpen,
      'background-enter-key': props.completionsOpen,
      placeholder: isEmpty,
    }"
    @input="onInput"
    @keydown="onKeyDown"
  ></div>
</template>

<style scoped>
.console-input {
  width: 100%;
  padding: var(--space) var(--space-l);

  font-size: var(--font-size-xl);
  line-height: 39px;
  color: var(--color-text);

  border-radius: 5px;
  border: none;
  outline: none;

  background-color: var(--background-color);
  background-image: url("../assets/logo.svg");
  background-repeat: no-repeat;
  background-position: calc(100% - var(--space-l)) center;
}

.console-input span {
  display: inline-block;
}

.no-background {
  background-image: none;
}

.background-enter-key {
  background-image: url("../assets/enter.svg");
}

.placeholder::before {
  color: var(--color-text-placeholder);
  content: "What will you pick?";
}
</style>

<style>
.console-input-keyword {
  color: blue;
}
.console-input-chip {
  color: brown;
  background-color: papayawhip;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
