<template>
  <section
    class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    @click.self="$emit('close')"
  >
    <article
      class="bg-gray-800 text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100"
    >
      <header class="mb-6">
        <h2
          class="text-xl font-semibold"
          :class="danger ? 'text-red-400' : 'text-purple-300'"
        >
          {{ title }}
        </h2>
      </header>

      <section class="mb-6">
        <slot />
      </section>

      <footer class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          {{ cancelText }}
        </button>

        <button
          @click="$emit('confirm')"
          :class="danger
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-purple-600 hover:bg-purple-700'"
          class="px-4 py-2 rounded-lg text-white font-semibold transition"
        >
          {{ confirmText }}
        </button>
      </footer>
    </article>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  confirmText: { type: String, default: 'Bevestigen' },
  cancelText: { type: String, default: 'Annuleren' },
  danger: { type: Boolean, default: false }
})
</script>
