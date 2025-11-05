<template>
  <div>
    <h3>{{ column.name }}</h3>
    <div class="cards">
      <Card v-for="card in cards" :key="card.id" :card="card" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from './Card.vue'
import { useCardsStore } from '../stores/cardsStore'

const props = defineProps({ column: Object })
const cardsStore = useCardsStore()
const cards = ref([])

onMounted(async () => {
  await cardsStore.fetchCards(props.column.id)
  cards.value = cardsStore.cards
})
</script>
