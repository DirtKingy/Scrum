<template>
<article
  @click="editCard"
  class="p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
  :class="{
    // 'opacity-60 scale-95': isDragging,
    'transition-all duration-150': true
  }"
>
  <h3>{{ card.title }}</h3>
  <p v-if="card.description">{{ card.description }}</p>
</article>
</template>

<style>
  .v-move {
    transition: transform 0.2s ease;
  }
</style>

<script setup>
// Emits
const emit = defineEmits(['edit-card'])

// Props
const props = defineProps({
  card: Object,
  columnId: String,
  boardId: String,
  isDragging: { type: Boolean, default: false }
})


// Methods
function editCard() {
  emit('edit-card', props.card, props.columnId)
}

// Styles
const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
}

const titleStyle = {
  color: 'var(--color-text)',
  fontFamily: 'var(--font-display)',
  wordBreak: 'break-word',
}

const descStyle = {
  color: 'var(--color-text-muted)',
  fontFamily: 'var(--font-sans)',
  marginTop: '0.25rem',
  wordBreak: 'break-word',
}
</script>
