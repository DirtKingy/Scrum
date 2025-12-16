<template>
  <div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        :class="toastClass(toast.type)"
        class="px-6 py-3 rounded-lg shadow-lg text-white min-w-[200px] text-center"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/useToastStore'
const toastStore = useToastStore()

const toastClass = (type) => {
  switch (type) {
    case 'success': return 'bg-green-500'
    case 'error': return 'bg-red-500'
    case 'warning': return 'bg-yellow-500 text-black'
    default: return 'bg-blue-500'
  }
}
</script>

<style>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
