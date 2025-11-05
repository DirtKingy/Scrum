<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      @click.self="onCancel"
    >
      <div class="bg-[var(--color-card-bg)] text-white p-6 rounded-2xl w-full max-w-md shadow-xl">
        <h2 class="text-xl font-semibold mb-4">{{ title }}</h2>
        <p class="text-gray-300 mb-6">{{ message }}</p>

        <div class="flex justify-end gap-3">
          <button
            @click="onCancel"
            class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            Annuleren
          </button>

          <button
            @click="onConfirm"
            class="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-indigo-600 transition"
          >
            Bevestigen
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: Boolean,
  title: String,
  message: String,
})
const emit = defineEmits(['confirm', 'cancel'])

const onConfirm = () => emit('confirm')
const onCancel = () => emit('cancel')
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
