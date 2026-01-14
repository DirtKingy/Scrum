<template>
  <section
    class="rounded-xl shadow p-4 flex flex-col w-72"
    style="background-color: var(--color-surface);"
  >
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
        @click="columnsStore.deleteColumn(column.id)"
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
        <article>
          <BoardCard
            :card="element"
            @edit-card="$emit('edit-card', element, column.id)"
          />
        </article>
      </template>
    </draggable>

    <footer class="mt-4">
      <button
        @click="$emit('add-card', column.id)"
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
import { useColumnsStore } from '@/stores/columnsStore'
import draggable from 'vuedraggable'
import BoardCard from './BoardCard.vue'

const props = defineProps({ column: Object })
const emit = defineEmits(['add-card', 'edit-card', 'card-moved'])

const columnsStore = useColumnsStore()

const editing = ref(false)
const name = ref(props.column.name)

/**
 * Houd lokale input synchroon met store-updates
 * (voorkomt !editing glitches)
 */
watch(
  () => props.column.name,
  newName => {
    if (!editing.value) {
      name.value = newName
    }
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

  // 🔒 Store blijft leidend
  await columnsStore.updateColumn(props.column.id, trimmed)

  // pas NA succesvolle store-update
  editing.value = false
}

function onDragEnd(evt) {
  const { item, from, to, oldIndex, newIndex } = evt
  const cardId = item.__draggable_context.element.id
  const fromColumnId = from.dataset.columnId
  const toColumnId = to.dataset.columnId
  emit('card-moved', { cardId, fromColumnId, toColumnId, oldIndex, newIndex })
}
</script>
