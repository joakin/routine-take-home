<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { defineProps, defineExpose } from "vue";
import { useDebouncedRef } from "../utils/vue";

const emit = defineEmits<{
  enter: [];
  autocomplete: [word: string];
  autocompleteClose: [];
}>();

const text = useDebouncedRef("");
const textInput = ref<HTMLInputElement | null>(null);

defineExpose({
  completeWord(word: string) {
    if (textInput.value) {
      const input = textInput.value;
      const cursorPos = input.selectionStart || 0;
      const originalText = input.value || "";
      const beforeCursor = originalText.slice(0, cursorPos);
      const afterCursor = originalText.slice(cursorPos);
      const lastSpaceIndex = beforeCursor.lastIndexOf(" ");
      const beforeWord = beforeCursor.slice(0, lastSpaceIndex + 1);

      const newText = beforeWord + word + " " + afterCursor;
      input.value = newText;
      text.value = newText;
      input.setSelectionRange(
        beforeWord.length + word.length + 1,
        beforeWord.length + word.length + 1,
      );
    }
  },
});

const onInput = () => {
  if (textInput.value) {
    text.value = textInput.value.value;
  }
};

onMounted(() => {
  if (textInput.value) {
    textInput.value.focus();
  }
});

watch(text, (newText) => {
  const cursorPos = textInput.value?.selectionStart;
  for (const match of newText.matchAll(/(I pick you\s+)(\w*)(\s+|$)/g)) {
    if (match) {
      const cursorPosition = cursorPos || 0;
      const wordStart = (match.index || 0) + match[1].length;
      const wordEnd = wordStart + match[2].length;
      console.log(wordStart, wordEnd, cursorPosition);
      if (cursorPosition >= wordStart && cursorPosition <= wordEnd) {
        emit("autocomplete", match[2]);
        return;
      }
    }
  }
  emit("autocompleteClose");
});
</script>

<template>
  <input
    ref="textInput"
    type="text"
    placeholder="What will you pick?"
    :class="{ 'no-background': text !== '' }"
    @input="onInput"
    @keydown.enter="emit('enter')"
  />
</template>

<style scoped>
input {
  width: 100%;
  padding: var(--space) var(--space-l);

  font-size: var(--font-size-xl);
  line-height: 39px;

  border-radius: 5px;

  border: none;
  outline: none;

  background-image: url("../assets/logo.svg");
  background-repeat: no-repeat;
  background-position: calc(100% - var(--space-l)) center;
}

input.no-background {
  background-image: none;
}

input::placeholder {
  color: var(--color-text-placeholder);
}
</style>
