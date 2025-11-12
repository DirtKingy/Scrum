<template>
  <section class="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-700">
    <BoardColumn
      v-for="column in columns"
      :key="column.id"
      :column="column"
      @add-card="$emit('add-card', $event)"
      @delete-column="$emit('delete-column', $event)"
      @edit-card="$emit('edit-card', $event, $eventColumn)"
    />
    <article
      @click="$emit('new-column')"
      class="w-72 flex-shrink-0 bg-gray-800/40 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-400 cursor-pointer transition"
    >
      + Kolom toevoegen
    </article>
  </section>
</template>

<script setup>
import BoardColumn from './BoardColumn.vue'
defineProps({ columns: Array })
const emit = defineEmits(['add-card', 'delete-column', 'edit-card', 'new-column'])
</script>
