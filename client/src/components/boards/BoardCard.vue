<template>
  <article
    @click="openCard"
    class="
      bg-[var(--color-surface-hover)]
      border border-[var(--color-border)]
      rounded-lg
      p-3
      shadow-sm
      hover:shadow-lg
      hover:-translate-y-0.5
      hover:border-[var(--color-accent-muted)]
      transition-all duration-200 ease-out
      cursor-pointer
    "
  >
    <!-- Label kleuren -->
    <span
      v-if="card.labels && card.labels.length"
      class="flex gap-1 mb-2"
    >
      <span
        v-for="(label, index) in card.labels"
        :key="index"
        class="h-1.5 flex-1 rounded"
        :style="{ backgroundColor: label.color }"
      ></span>
    </span>

    <!-- Titel -->
    <h3 class="text-text font-medium break-words">
      {{ card.title }}
    </h3>
  </article>
</template>

<script setup>
const props = defineProps({
  card: Object
})

const emit = defineEmits(['select-card'])

function openCard() {
  emit('select-card', props.card)
}
</script>