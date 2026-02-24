<template>
  <aside
    class="fixed inset-0 z-50 flex justify-center items-start pt-20"
    @click.self="close"
  >
    <!-- Backdrop -->
    <section class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></section>

    <!-- Panel -->
    <section
      class="relative rounded-xl shadow-xl w-full max-w-md p-6"
      :style="{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        fontFamily: 'var(--font-sans)'
      }"
    >
      <!-- Header -->
      <header class="flex justify-between items-center mb-4">
        <h2
          class="text-xl font-semibold"
          :style="{ fontFamily: 'var(--font-display)', color: 'var(--color-accent)' }"
        >
          {{ card.title }}
        </h2>
        <button
          @click="close"
          class="text-lg font-bold hover:opacity-80 transition"
          :style="{ color: 'var(--color-accent-muted)' }"
        >
          &times;
        </button>
      </header>

      <!-- Description -->
      <p class="mb-4" :style="{ color: 'var(--color-text-muted)' }">
        {{ card.description || 'Geen beschrijving' }}
      </p>

      <!-- Footer Buttons -->
      <footer class="flex justify-end gap-2 mt-6">
        <button
          @click="editCard"
          class="px-4 py-2 rounded transition"
          :style="{
            backgroundColor: 'var(--color-accent)',
            color: 'var(--color-text)',
          }"
          @mouseover="hover = true"
          @mouseleave="hover = false"
        >
          Bewerken
        </button>
        <button
          @click="close"
          class="px-4 py-2 rounded transition"
          :style="{
            backgroundColor: 'var(--color-primary-btn)',
            color: 'var(--color-text)',
          }"
        >
          Sluiten
        </button>
      </footer>
    </section>
  </aside>
</template>

<script setup>
const props = defineProps({
  card: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

function close() {
  emit('close')
}

function editCard() {
  emit('edit', props.card)
}
</script>

<style scoped>
/* Overlay animatie */
aside {
  transition: opacity 0.2s ease;
}

/* Hover effecten kunnen via Tailwind of variabelen */
button:hover {
  opacity: 0.85;
}
</style>