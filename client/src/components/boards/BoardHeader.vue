<template>
  <header class="mb-8 flex justify-between items-center">
    <section>
      <RouterLink
        to="/"
        class="text-purple-400 hover:text-purple-300 transition font-medium"
      >
        ← Terug naar overzicht
      </RouterLink>

      <h1 class="text-3xl font-bold mt-3 text-purple-300">
        {{ board?.name || 'Board laden...' }}
      </h1>
      <p v-if="board" class="text-gray-400 mt-1 text-sm">
        Gemaakt op {{ formatDate(board.created_at) }}
      </p>
    </section>

  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
defineProps({ board: Object })
const emit = defineEmits(['new-column'])

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
