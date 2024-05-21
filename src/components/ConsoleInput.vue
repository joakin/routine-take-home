<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { defineProps, defineExpose } from "vue";
import { useDebouncedRef } from "../utils/vue";

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

const text = ref("");
const textInput = ref<HTMLDivElement | null>(null);

defineExpose({
  completeWord(word: string) {
    if (textInput.value) {
      const input = textInput.value;
      const selection = window.getSelection();
      const cursorPos = selection?.getRangeAt(0).startOffset || 0;
      const originalText = input.textContent || "";
      const beforeCursor = originalText.slice(0, cursorPos);
      const afterCursor = originalText.slice(cursorPos);
      const lastSpaceIndex = beforeCursor.lastIndexOf(" ");
      const beforeWord = beforeCursor.slice(0, lastSpaceIndex + 1);

      const newText = beforeWord + word + " " + afterCursor;
      input.innerHTML = newText;
      text.value = newText;

      const range = document.createRange();
      range.setStart(input.childNodes[0], beforeWord.length + word.length + 1);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  },
});

onMounted(() => {
  if (textInput.value) {
    textInput.value.focus();
  }
});

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

const onInput = () => {
  if (textInput.value) {
    text.value = textInput.value.textContent;
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
      'no-background': text !== '' && !props.completionsOpen,
      'background-enter-key': props.completionsOpen,
      placeholder: text === '',
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
