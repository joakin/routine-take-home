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
  --x-spacing: 24px;
  width: 100%;
  padding: 16px var(--x-spacing);
  font-size: 26px;
  line-height: 39px;
  border-radius: 5px;
  border: none;
  outline: none;
  background-image: url("../assets/logo.svg");
  background-repeat: no-repeat;
  background-position: calc(100% - var(--x-spacing)) center;
}

input.no-background {
  background-image: none;
}

input::placeholder {
  color: var(--color-text-placeholder);
}
</style>
