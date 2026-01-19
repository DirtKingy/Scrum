<template>
  <section class="flex gap-4 overflow-x-auto pb-4">
    <!-- Columns -->
    <BoardColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      :board-id="boardId"
      @add-card="boardsStore.openNewCardModal(col.id)"
      @delete-column="boardsStore.deleteColumn(boardId, col.id)"
      @edit-card="boardsStore.openEditCardModal($event, col.id)"
      @card-moved="boardsStore.moveCard(boardId, $event.cardId, $event.fromColumnId, $event.toColumnId, $event.newIndex)"
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

defineProps({
  columns: Array,
  boardId: String
})

const emit = defineEmits(['new-column'])
const boardsStore = useBoardsStore()
</script>
