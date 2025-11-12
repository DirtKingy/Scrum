<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    <BoardHeader :board="board" @new-column="openNewColumnModal" />

    <BoardColumns
      v-if="board"
      :columns="columns"
      @add-card="openNewCardModal"
      @delete-column="deleteColumn"
      @edit-card="editCard"
      @new-column="openNewColumnModal"
    />

    <!-- Column modal -->
    <BaseModal v-if="showColumnModal" @close="showColumnModal = false" @confirm="createColumn" title="Nieuwe Kolom">
      <section>
        <form @submit.prevent="createColumn" class="space-y-4">
          <input
            v-model="newColumnName"
            type="text"
            placeholder="Naam van kolom"
            class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
        </form>
      </section>
    </BaseModal>

    <!-- Card modal -->
    <BaseModal v-if="showCardModal" @close="showCardModal = false" @confirm="createCard" title="Nieuwe Kaart">
      <section class="space-y-4">
        <input
          v-model="newCardTitle"
          type="text"
          placeholder="Titel van kaart"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          required
        />
        <textarea
          v-model="newCardDescription"
          placeholder="Beschrijving (optioneel)"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
        ></textarea>
      </section>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../components/base/BaseModal.vue'
import BoardHeader from '../components/boards/BoardHeader.vue'
import BoardColumns from '../components/boards/BoardColumns.vue'
import { useBoardsStore } from '../stores/boardsStore'
import { useColumnsStore } from '../stores/columnsStore'
import { useCardsStore } from '../stores/cardsStore'

const route = useRoute()
const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()
const cardsStore = useCardsStore()

const board = ref(null)
const columns = ref([])

// Column modal
const showColumnModal = ref(false)
const newColumnName = ref('')

// Card modal
const showCardModal = ref(false)
const newCardTitle = ref('')
const newCardDescription = ref('')
const cardColumnId = ref(null)

onMounted(async () => {
  const id = route.params.id
  await boardsStore.fetchBoards()
  board.value = boardsStore.boards.find(b => b.id === id)

  if (board.value) {
    await columnsStore.fetchColumns(id)

    // Voor elke kolom ook de kaarten ophalen
    const colsWithCards = []
    for (const col of columnsStore.columns) {
      await cardsStore.fetchCards(col.id)
      colsWithCards.push({
        ...col,
        cards: cardsStore.cards.filter(c => c.column_id === col.id)
      })
    }
    columns.value = colsWithCards
  }
})

function openNewColumnModal() {
  showColumnModal.value = true
}

async function createColumn() {
  if (!newColumnName.value) return
  await columnsStore.createColumn(board.value.id, newColumnName.value)
  newColumnName.value = ''
  showColumnModal.value = false
  await columnsStore.fetchColumns(board.value.id)
  columns.value = columnsStore.columns.map(col => ({ ...col, cards: [] }))
}

function openNewCardModal(columnId) {
  cardColumnId.value = columnId
  newCardTitle.value = ''
  newCardDescription.value = ''
  showCardModal.value = true
}

async function createCard() {
  if (!newCardTitle.value) return

  const newCard = await cardsStore.createCard(
    cardColumnId.value,
    newCardTitle.value,
    newCardDescription.value
  )

  // Sluit de modal
  showCardModal.value = false
  newCardTitle.value = ''
  newCardDescription.value = ''

  // Voeg nieuwe kaart direct toe aan de juiste kolom
  const col = columns.value.find(c => c.id === cardColumnId.value)
  if (col) col.cards.push(newCard)
}

function addCard(columnId) {
  openNewCardModal(columnId)
}

function editCard(card, columnId) {
  alert(`Kaart bewerken: ${card.title} (komt nog)`)
}

function deleteColumn(columnId) {
  if (confirm('Weet je zeker dat je deze kolom wilt verwijderen?')) {
    columnsStore.deleteColumn(columnId)
    columns.value = columns.value.filter(c => c.id !== columnId)
  }
}
</script>
