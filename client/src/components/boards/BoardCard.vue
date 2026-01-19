<template>
  <article
    class="p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    @click="editCard"
    :style="cardStyle"
  >
    <h3 :style="titleStyle">{{ card.title }}</h3>
    <p v-if="card.description" :style="descStyle">
      {{ card.description }}
    </p>
  </article>
</template>

<script setup>
// Emits
const emit = defineEmits(['edit-card'])

// Props
const props = defineProps({
  card: { type: Object, required: true },
  boardId: { type: String, required: true },
  columnId: { type: String, required: true }
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
