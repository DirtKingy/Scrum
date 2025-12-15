<template>
  <section class="flex gap-4 overflow-x-auto pb-4">
    <!-- Columns -->
    <BoardColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @add-card="$emit('add-card', col.id)"
      @delete-column="$emit('delete-column', col.id)"
      @edit-card="$emit('edit-card', $event)"
      @card-moved="onCardMoved"
    />

    <!-- Add new column button -->
    <button
      @click="$emit('new-column')"
      class="px-4 py-2 rounded-xl flex-shrink-0 font-medium transition hover:opacity-80"
      style="
        background-color: var(--color-surface-alt);
        color: var(--color-accent);
        font-family: var(--font-sans);
      "
    >
      + Kolom toevoegen
    </button>
  </section>
</template>

<script setup>
import BoardColumn from './BoardColumn.vue'

defineProps({ columns: Array })
const emit = defineEmits(['add-card','delete-column','edit-card','new-column','card-moved'])

function onCardMoved(event) {
  emit('card-moved', event)
}
</script>
