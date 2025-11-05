<template>
  <div class="card">
    <h4>{{ card.title }}</h4>
    <p>{{ card.description }}</p>
  </div>
</template>

<script setup>
const props = defineProps({ card: Object })
</script>
