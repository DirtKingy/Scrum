<template>
  <section class="flex gap-4 overflow-x-auto pb-4">
    <draggable
      v-model="columnsModel"
      item-key="id"
      direction="horizontal"
      class="flex gap-4"
      :animation="200"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
      :force-fallback="true"
    >
      <template #item="{ element }">
        <BoardColumn
          class="w-72 flex-shrink-0"
          :column="element"
          :board-id="boardId"
          :on-add-card="handleAddCard"
          :on-edit-card="handleEditCard"
        />
      </template>
    </draggable>
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
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import BoardColumn from './BoardColumn.vue'
import { useBoardsStore } from '@/stores/boardsStore'

const props = defineProps({
  columns: { type: Array, required: true },
  boardId: { type: String, required: true }
})

const emit = defineEmits(['new-column'])

const store = useBoardsStore()

// 🔥 zelfde als cards
const localColumns = ref([])
const dragging = ref(false)

// sync props → local
watch(
  () => props.columns,
  (cols) => {
    localColumns.value = [...cols]
  },
  { immediate: true }
)

// card handlers
function handleAddCard(columnId) {
  store.openNewCardModal(columnId)
}

function handleEditCard(card, columnId) {
  store.openEditCardModal(card, columnId)
}

// 🔥 zelfde patroon als card drag
function onDragEnd(evt) {
  dragging.value = false

  store.getColumnsByBoard(boardId).value
  store.updateColumnOrder(props.boardId, reordered)
}
</script>

<style>
.drag-ghost {
  opacity: 0.4;
}

.drag-chosen {
  transform: scale(1.03);
  transition: transform 0.15s ease;
}
</style>