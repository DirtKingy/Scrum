<template>
  <section
    class="bg-gray-800 rounded-xl shadow flex-shrink-0 w-72 p-4 flex flex-col"
  >
    <header class="flex justify-between items-center mb-3">
      <h2 class="text-lg font-semibold text-purple-300 truncate">
        {{ column.name }}
      </h2>
      <button
        @click="$emit('delete-column', column.id)"
        class="text-red-500 hover:text-red-400"
        title="Verwijder kolom"
      >
        ✕
      </button>
    </header>

    <!-- Scrollbaar gedeelte met kaarten -->
    <section
      class="space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 pr-1"
      style="max-height: calc(100vh - 280px)"
    >
      <BoardCard
        v-for="card in column.cards"
        :key="card.id"
        :card="card"
        @edit-card="$emit('edit-card', $event, column.id)"
      />
    </section>

    <footer class="mt-4">
      <button
        @click="$emit('add-card', column.id)"
        class="text-purple-400 hover:text-purple-300 text-sm font-medium"
      >
        + Nieuwe kaart
      </button>
    </footer>
  </section>
</template>

<script setup>
import BoardCard from './BoardCard.vue'

defineProps({ column: Object })
defineEmits(['add-card', 'delete-column', 'edit-card'])
</script>
