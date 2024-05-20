<script lang="ts" setup>
import { ref } from "vue";

const text = ref("");

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  text.value = target.value;
};
</script>

<template>
  <input
    type="text"
    placeholder="What will you pick?"
    :class="{ 'no-background': text !== '' }"
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
