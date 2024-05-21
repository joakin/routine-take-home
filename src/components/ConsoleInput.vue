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

function onInput(event: Event) {
  if (textInput.value) {
    const { requestCompletions } = helpers.handleInputChange(
      textInput.value,
      event as InputEvent,
    );
    isEmpty.value = textInput.value.textContent?.length === 0;

    if (requestCompletions) {
      emit("autocomplete", requestCompletions);
    } else {
      emit("autocompleteClose");
    }
  }
}

function onKeyDown(event: KeyboardEvent) {
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
}

// From https://w3c.github.io/input-events/#interface-InputEvent-Attributes
const blockedInputTypes = [
  // "insertText",
  // "insertReplacementText",
  "insertLineBreak",
  "insertParagraph",
  "insertOrderedList",
  "insertUnorderedList",
  "insertHorizontalRule",
  // "insertFromYank",
  // "insertFromDrop",
  // "insertFromPaste",
  "insertFromPasteAsQuotation",
  // "insertTranspose",
  // "insertCompositionText",
  "insertLink",
  // "deleteWordBackward",
  // "deleteWordForward",
  // "deleteSoftLineBackward",
  // "deleteSoftLineForward",
  // "deleteEntireSoftLine",
  // "deleteHardLineBackward",
  // "deleteHardLineForward",
  // "deleteByDrag",
  // "deleteByCut",
  // "deleteContent",
  // "deleteContentBackward",
  // "deleteContentForward",
  // "historyUndo",
  // "historyRedo",
  "formatBold",
  "formatItalic",
  "formatUnderline",
  "formatStrikeThrough",
  "formatSuperscript",
  "formatSubscript",
  "formatJustifyFull",
  "formatJustifyCenter",
  "formatJustifyRight",
  "formatJustifyLeft",
  "formatIndent",
  "formatOutdent",
  "formatRemove",
  "formatSetBlockTextDirection",
  "formatSetInlineTextDirection",
  "formatBackColor",
  "formatFontColor",
  "formatFontName",
];

function onBeforeInput(event: Event) {
  if (blockedInputTypes.includes((event as InputEvent).inputType)) {
    event.preventDefault();
  }
}
</script>

<template>
  <div
    class="console-input"
    ref="textInput"
    contenteditable="true"
    spellcheck="false"
    :class="{
      'no-background': !isEmpty && !props.completionsOpen,
      'background-enter-key': props.completionsOpen,
      placeholder: isEmpty,
    }"
    @input="onInput"
    @keydown="onKeyDown"
    @beforeinput="onBeforeInput"
  ></div>
</template>

<style scoped>
.console-input {
  width: 100%;
  padding: var(--space) var(--space-l);

  font-size: var(--font-size-xl);
  line-height: var(--line-height);
  color: var(--color-text);

  border-radius: var(--border-radius);
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
  color: var(--color-text-keyword);
}

.console-input-chip {
  padding: var(--space-xxxxxs) var(--space-xxs);

  font-size: var(--font-size-l);
  font-weight: var(--font-weight-md);
  line-height: var(--line-height);

  background-color: var(--background-color-chip);
  border-radius: var(--border-radius-s);
}
</style>
