<template>
  <section class="flex gap-4 overflow-x-auto pb-4">
    <!-- Columns -->
    <BoardColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      :board-id="boardId"

      :on-add-card="handleAddCard"
      :on-edit-card="handleEditCard"
    />

    <!-- Add new column button -->
    <button
      @click="emit('new-column')"
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
import { useBoardsStore } from '@/stores/boardsStore'

const props = defineProps({
  columns: Array,
  boardId: String
})

const emit = defineEmits(['new-column'])
const boardsStore = useBoardsStore()

function handleAddCard(columnId) {
  boardsStore.openNewCardModal(columnId)
}

function handleEditCard(card, columnId) {
  boardsStore.openEditCardModal(card, columnId)
}
</script>
