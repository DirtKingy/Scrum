<template>
  <header class="mb-8 flex justify-between items-center">
    <!-- Left section: back link + board info -->
    <section>
      <RouterLink
        to="/"
        class="transition font-medium"
        style="color: var(--color-accent-muted); font-family: var(--font-sans);"
      >
        ← Terug naar overzicht
      </RouterLink>

      <h1
        class="text-3xl font-bold mt-3"
        style="color: var(--color-accent); font-family: var(--font-display);"
      >
        {{ board?.name || 'Board laden...' }}
      </h1>
      <p
        v-if="board"
        class="mt-1 text-sm"
        style="color: var(--color-text-muted); font-family: var(--font-sans);"
      >
        Gemaakt op {{ formatDate(board.created_at) }}
      </p>
    </section>

    <!-- Right section: add new column button -->
    <section>
      <button
        @click="$emit('new-column')"
        class="px-4 py-2 rounded-lg shadow font-semibold transition hover:opacity-80"
        style="
          background-color: var(--color-primary-btn);
          color: var(--color-text);
          font-family: var(--font-sans);
        "
      >
        + Nieuwe kolom
      </button>
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
