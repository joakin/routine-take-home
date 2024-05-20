<script lang="ts" setup>
import { ref, watch, onMounted } from "vue";
import { defineProps } from "vue";

const props = defineProps<{ onAutocomplete: (word: string) => void }>();

const text = ref("");
const textInput = ref<HTMLInputElement | null>(null);

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

watch(text, (newValue) => {
  const match = newValue.match(/(I pick you\s+)(\w+)(\s+|$)/);
  if (match) {
    const cursorPosition = textInput.value?.selectionStart || 0;
    const wordStart = match.index + match[1].length;
    const wordEnd = wordStart + match[2].length;
    if (cursorPosition >= wordStart && cursorPosition <= wordEnd) {
      props.onAutocomplete(match[2]);
    }
  }
});
</script>

<template>
  <input
    ref="textInput"
    type="text"
    placeholder="What will you pick?"
    :class="{ 'no-background': text.value !== '' }"
    @input="onInput"
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
