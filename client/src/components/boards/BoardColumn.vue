<template>
  <section
    class="rounded-xl shadow p-4 flex flex-col w-72"
    style="background-color: var(--color-surface);"
  >
    <!-- Header -->
    <header class="flex justify-between items-center mb-3">
      <h2
        class="text-lg font-semibold"
        style="color: var(--color-accent); font-family: var(--font-display);"
      >
        {{ column.name }}
      </h2>
      <button
        @click="$emit('delete-column', column.id)"
        class="hover:opacity-80 transition"
        style="color: var(--color-danger);"
      >
        ✕
      </button>
    </header>

    <draggable
      v-model="column.cards"
      group="cards"
      item-key="id"
      @end="onDragEnd"
      class="space-y-3 flex-1 overflow-y-auto pr-1"
      :data-column-id="column.id"
    >
      <template #item="{ element }">
        <BoardCard
          :card="element"
          @edit-card="$emit('edit-card', element, column.id)"
        />
      </template>
    </draggable>

    <footer class="mt-4">
      <button
        @click="$emit('add-card', column.id)"
        class="text-sm font-medium hover:opacity-80 transition"
        style="color: var(--color-accent-muted); font-family: var(--font-sans);"
      >
        + Nieuwe kaart
      </button>
    </footer>
  </section>
</template>

<script setup>
import draggable from 'vuedraggable'
import BoardCard from './BoardCard.vue'

const props = defineProps({ column: Object })
const emit = defineEmits(['add-card', 'delete-column', 'edit-card', 'card-moved'])

function onDragEnd(evt) {
  const { item, from, to, oldIndex, newIndex } = evt
  const cardId = item.__draggable_context.element.id
  const fromColumnId = from.dataset.columnId
  const toColumnId = to.dataset.columnId
  emit('card-moved', { cardId, fromColumnId, toColumnId, oldIndex, newIndex })
}
</script>
