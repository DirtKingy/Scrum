<template>
  <section
    class="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    @click.self="$emit('close')"
  >
    <article
      class="rounded-2xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100"
      style="background-color: var(--color-surface); color: var(--color-text); font-family: var(--font-sans);"
    >
      <!-- Header -->
      <header class="mb-6">
        <h2
          class="text-xl font-semibold"
          :style="{
            color: danger ? 'var(--color-danger)' : 'var(--color-accent)',
            fontFamily: 'var(--font-display)'
          }"
        >
          {{ title }}
        </h2>
      </header>

      <!-- Content slot -->
      <section class="mb-6">
        <slot />
      </section>

      <!-- Footer -->
      <footer class="flex justify-end gap-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg transition"
          style="
            background-color: var(--color-primary-btn);
            color: var(--color-text);
            font-family: var(--font-sans);
          "
        >
          {{ cancelText }}
        </button>

        <button
          @click="$emit('confirm')"
          class="px-4 py-2 rounded-lg text-white font-semibold transition"
          :style="danger
            ? 'background-color: var(--color-danger-dark);'
            : 'background-color: var(--color-accent);'"
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
