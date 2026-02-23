<template>
  <section
    class="rounded-xl shadow p-4 flex flex-col w-72"
    style="background-color: var(--color-surface);"
  >
    <!-- Column header -->
    <header class="flex justify-between items-center mb-3">
      <h2
        v-if="!editing"
        @click="startEdit"
        class="text-lg font-semibold cursor-pointer"
        style="color: var(--color-accent); font-family: var(--font-display);"
      >
        {{ column.name }}
      </h2>

      <input
        v-else
        v-model="name"
        @blur="saveEdit"
        @keyup.enter="saveEdit"
        class="text-lg font-semibold px-1 rounded"
        style="
          color: var(--color-accent);
          font-family: var(--font-display);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
        "
      />

      <button
        @click="deleteColumn"
        class="hover:opacity-80 transition"
        style="color: var(--color-danger);"
      >
        ✕
      </button>
    </header>

    <!-- Cards drag & drop -->
    <draggable
      v-model="column.cards"
      group="cards"
      item-key="id"
      @start="dragging = true"
      @end="onDragEnd"
      class="space-y-3 flex-1 overflow-y-auto pr-1"
      :data-column-id="column.id"
    >
      <template #item="{ element }">
        <BoardCard
          :card="element"
          :board-id="props.boardId"
          :column-id="column.id"
          @edit-card="props.onEditCard"
          :is-dragging="dragging"
        />
      </template>
    </draggable>

    <footer class="mt-4">
      <button
        @click="props.onAddCard(column.id)"
        class="text-base font-medium hover:opacity-80 transition"
        style="color: var(--color-accent-muted); font-family: var(--font-sans);"
      >
        + Nieuwe kaart
      </button>
    </footer>
  </section>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import BoardCard from './BoardCard.vue'
import { useBoardsStore } from '@/stores/boardsStore'

const props = defineProps({
  column: { type: Object, required: true },
  boardId: { type: String, required: true },

  // callbacks van de view
  onEditCard: { type: Function, required: true },
  onAddCard: { type: Function, required: true }
})

const emit = defineEmits(['card-moved'])

const store = useBoardsStore()

// Editing header
const editing = ref(false)
const name = ref(props.column.name)
const dragging = ref(false)

watch(
  () => props.column.name,
  newName => {
    if (!editing.value) name.value = newName
  }
)

function startEdit() {
  name.value = props.column.name
  editing.value = true
}

async function saveEdit() {
  const trimmed = name.value.trim()
  if (!trimmed || trimmed === props.column.name) {
    editing.value = false
    return
  }

  // ✅ BoardStore is leidend
  await store.updateColumn(props.boardId, props.column.id, trimmed)
  editing.value = false
}

async function deleteColumn() {
  if (!confirm('Kolom verwijderen?')) return
  await store.deleteColumn(props.boardId, props.column.id)
}

function onDragEnd(evt) {
  dragging.value = false
  const { item, from, to, oldIndex, newIndex } = evt
  const cardId = item.__draggable_context.element.id
  const fromColumnId = from.dataset.columnId
  const toColumnId = to.dataset.columnId
  store.moveCard(props.boardId, cardId, fromColumnId, toColumnId, newIndex)
}
</script>
