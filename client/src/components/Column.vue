<template>
  <div class="bg-gray-800 rounded-lg shadow p-4 flex flex-col min-w-[250px]">
    <header class="flex justify-between items-center mb-4">
      <h3 class="font-semibold text-purple-300">{{ column.name }}</h3>
      <div class="flex gap-1">
        <button @click="editColumn"
                class="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-600 text-white text-sm">✏️</button>
        <button @click="deleteColumn"
                class="px-2 py-1 bg-red-500 rounded hover:bg-red-600 text-white text-sm">🗑️</button>
      </div>
    </header>

    <!-- Cards List -->
    <div class="flex flex-col gap-2">
      <Card v-for="card in column.cards || []" :key="card.id" :card="card" />
    </div>

    <!-- Add Card -->
    <form @submit.prevent="addCard" class="mt-4 flex gap-2">
      <input v-model="newCardTitle"
             placeholder="Nieuwe taak..."
             class="flex-1 px-2 py-1 rounded bg-gray-700 text-gray-100 text-sm focus:ring-2 focus:ring-purple-400 focus:outline-none" />
      <button type="submit"
              class="px-3 py-1 bg-purple-500 rounded hover:bg-purple-600 text-white text-sm">+</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Card from './Card.vue'
import { useColumnsStore } from '../stores/columnsStore'
import { useCardsStore } from '../stores/cardsStore'

const props = defineProps({
  column: Object
})

const columnsStore = useColumnsStore()
const cardsStore = useCardsStore()
const newCardTitle = ref('')

function editColumn() {
  const newName = prompt('Update column name:', props.column.name)
  if (newName) columnsStore.updateColumn(props.column.id, newName)
}

function deleteColumn() {
  if (confirm('Weet je zeker dat je deze kolom wilt verwijderen?')) {
    columnsStore.deleteColumn(props.column.id)
  }
}

async function addCard() {
  if (!newCardTitle.value) return
  await cardsStore.createCard(props.column.board_id, props.column.id, newCardTitle.value)
  newCardTitle.value = ''
}
</script>
