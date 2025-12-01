<template>
  <section class="flex gap-4 overflow-x-auto pb-4">
    <BoardColumn
      v-for="col in columns"
      :key="col.id"
      :column="col"
      @add-card="$emit('add-card', col.id)"
      @delete-column="$emit('delete-column', col.id)"
      @edit-card="$emit('edit-card', $event)"
      @card-moved="onCardMoved"
    />
    <button
      @click="$emit('new-column')"
      class="bg-gray-800 text-purple-300 px-4 py-2 rounded-xl w-72 flex-shrink-0"
    >+ Kolom toevoegen</button>
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
