<template>
  <article
    class="p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    @click="$emit('edit-card', card)"
    style="background-color: var(--color-surface); border: 1px solid var(--color-border);"
  >
    <h3
      class="font-medium break-words"
      style="color: var(--color-text); font-family: var(--font-display);"
    >
      {{ card.title }}
    </h3>
    <p
      v-if="card.description"
      class="text-base mt-1 break-words"
      style="color: var(--color-text-muted); font-family: var(--font-sans);"
    >
      {{ card.description }}
    </p>
  </article>
</template>

<script setup>
defineProps({ card: Object })
defineEmits(['edit-card'])
</script>
