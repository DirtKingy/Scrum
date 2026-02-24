<template>
  <article
    @click="openCard"
    class="p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
  >
    <h3>{{ card.title }}</h3>
  </article>
</template>

<script setup>
const props = defineProps({
  card: Object
})

const emit = defineEmits(['select-card'])

function openCard() {
  emit('select-card', props.card)
}
</script>