<template>
  <article
    class="bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
    @click="$emit('edit-card', card)"
  >
    <h3 class="font-medium text-gray-100">{{ card.title }}</h3>
    <p v-if="card.description" class="text-sm text-gray-400 mt-1">
      {{ card.description }}
    </p>
  </article>
</template>

<script setup>
defineProps({ card: Object })
defineEmits(['edit-card'])
</script>
