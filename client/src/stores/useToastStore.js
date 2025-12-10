import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]) // lijst van actieve toasts

  function showToast({ message, type = 'info', duration = 1000 * 10 }) {
    const id = Date.now() + Math.random()
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, duration)
  }

  return { toasts, showToast }
})
