<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    <!-- Header -->
    <BoardHeader :board="board" @new-column="showColumnModal = true" />

    <!-- Columns -->
    <div class="flex space-x-4">
      <BoardColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @add-card="openNewCardModal"
        @edit-card="openEditCardModal"
        @delete-column="deleteColumn"
        @card-moved="onCardMoved"
      />
    </div>

    <!-- Column modal -->
    <BaseModal
      v-if="showColumnModal"
      title="Nieuwe Kolom"
      @close="showColumnModal = false"
      @confirm="createColumn"
    >
      <form @submit.prevent="createColumn" class="space-y-4">
        <input
          v-model="newColumnName"
          type="text"
          placeholder="Naam van kolom"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100"
          required
        />
      </form>
    </BaseModal>

    <!-- Card modal -->
    <BaseModal
      v-if="showCardModal"
      title="Nieuwe Kaart"
      @close="showCardModal = false"
      @confirm="createCard"
    >
      <section class="space-y-4">
        <input
          v-model="selectedCard.title"
          type="text"
          placeholder="Titel van kaart"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100"
          required
        />
        <textarea
          v-model="selectedCard.description"
          placeholder="Beschrijving (optioneel)"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 resize-none"
        ></textarea>
      </section>
    </BaseModal>

    <!-- Edit card modal -->
    <BaseModal
      v-if="showEditModal"
      title="Kaart bewerken"
      @close="showEditModal = false"
      @confirm="saveEditedCard"
    >
      <section class="space-y-4">
        <input
          v-model="selectedCard.title"
          type="text"
          placeholder="Titel van kaart"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100"
          required
        />
        <textarea
          v-model="selectedCard.description"
          placeholder="Beschrijving (optioneel)"
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 resize-none"
        ></textarea>
      </section>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../components/base/BaseModal.vue'
import BoardHeader from '../components/boards/BoardHeader.vue'
import BoardColumn from '../components/boards/BoardColumn.vue'
import { useBoardsStore } from '../stores/boardsStore'
import { useColumnsStore } from '../stores/columnsStore'
import { useCardsStore } from '../stores/cardsStore'

// --- Stores ---
const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()
const cardsStore = useCardsStore()

// --- Route ---
const route = useRoute()
const boardId = route.params.id

// --- Refs for modals ---
const showColumnModal = ref(false)
const showCardModal = ref(false)
const showEditModal = ref(false)
const selectedCard = ref({ title: '', description: '' })
const newColumnName = ref('')

// --- Computed: columns with cards ---
const board = computed(() =>
  boardsStore.boards.find(b => b.id === boardId)
)

const columns = computed(() =>
  columnsStore.columns.map(col => ({
    ...col,
    cards: cardsStore.cardsByColumn[col.id] || []
  }))
)

// --- Load initial data ---
async function loadBoardData() {
  await boardsStore.fetchBoards()
  await columnsStore.fetchColumns(boardId)
  for (const col of columnsStore.columns) {
    await cardsStore.fetchCards(col.id)
  }
}

onMounted(loadBoardData)

// --- Column actions ---
async function createColumn() {
  if (!newColumnName.value) return
  await columnsStore.createColumn(boardId, newColumnName.value)
  newColumnName.value = ''
  showColumnModal.value = false
}

function deleteColumn(columnId) {
  if (!confirm('Kolom verwijderen?')) return
  columnsStore.deleteColumn(columnId)
}

// --- Card actions ---
function openNewCardModal(columnId) {
  selectedCard.value = { title: '', description: '', column_id: columnId }
  showCardModal.value = true
}

async function createCard() {
  if (!selectedCard.value.title) return
  await cardsStore.createCard(
    selectedCard.value.column_id,
    selectedCard.value.title,
    selectedCard.value.description
  )
  showCardModal.value = false
}

function openEditCardModal(card, columnId) {
  selectedCard.value = { ...card, column_id: columnId }
  showEditModal.value = true
}

async function saveEditedCard() {
  if (!selectedCard.value.id) return
  await cardsStore.updateCard(selectedCard.value.id, {
    title: selectedCard.value.title,
    description: selectedCard.value.description
  })
  showEditModal.value = false
}

// --- Drag & Drop ---
async function onCardMoved({ cardId, fromColumnId, toColumnId, oldIndex, newIndex }) {
  await cardsStore.moveCard(cardId, fromColumnId, toColumnId, oldIndex, newIndex)
}
</script>
