<template>
  <section class="rounded-xl shadow p-4 flex flex-col w-72"
    style="background-color: var(--color-surface);">

    <header class="flex justify-between items-center mb-3">
      <h2 v-if="!editing" @click="startEdit"
          class="text-lg font-semibold cursor-pointer"
          style="color: var(--color-accent); font-family: var(--font-display);">
        {{ column.name }}
      </h2>

      <input v-else v-model="name" @blur="saveEdit" @keyup.enter="saveEdit"
        class="text-lg font-semibold px-1 rounded"
        style="background-color: var(--color-surface); border: 1px solid var(--color-border);" />

      <button @click="$emit('delete-column', column.id)">
        🗑
      </button>
    </header>

    <!-- UI = ONLY VISUAL LIST -->
    <draggable
      :list="cardsView"
      group="cards"
      item-key="id"
      @change="onDrag"
      class="space-y-3 flex-1 overflow-y-auto pr-1"
      ghost-class="drag-ghost"
      chosen-class="drag-chosen"
    >
      <template #item="{ element }">
        <BoardCard
          :card="element"
          @select-card="$emit('select-card', $event)"
        />
      </template>
    </draggable>

    <footer class="mt-4">
      <button @click="$emit('add-card', column.id)">
        + Nieuwe kaart
      </button>
    </footer>

  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import BoardCard from './BoardCard.vue'

const props = defineProps({
  column: Object
})

const emit = defineEmits([
  'select-card',
  'add-card',
  'card-drag-intent',
  'delete-column',
  'update-column'
])

const editing = ref(false)
const name = ref(props.column.name)

const cardsView = computed(() => [...props.column.cards])

function onDrag(evt) {
  const card =
    evt.added?.element ||
    evt.moved?.element

  if (!card) return

  emit('card-drag-intent', {
    cardId: card.id,
    fromColumnId: evt.removed?.element?.column_id ?? card.column_id,
    toColumnId: props.column.id,
    newIndex: evt.added?.newIndex ?? evt.moved?.newIndex ?? 0
  })
}
</script>