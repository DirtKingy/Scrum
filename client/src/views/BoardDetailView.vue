<template>
  <main
    class="min-h-screen font-sans p-6"
    style="background-color: var(--color-bg); color: var(--color-text);"
  >
    <!-- Board Header -->
    <BoardHeader
      :board="board"
      @new-column="openNewColumnModal"
      class="mb-8"
    />

    <!-- Columns container -->
    <div class="flex space-x-4">
      <BoardColumn
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @add-card="openNewCardModal"
        @edit-card="editCard"
        @delete-column="deleteColumn"
        @card-moved="onCardMoved"
        class="bg-[var(--color-surface)] rounded-lg p-4 shadow hover:shadow-lg transition"
      />
    </div>

    <!-- Column modal -->
    <BaseModal
      v-if="showColumnModal"
      @close="showColumnModal = false"
      @confirm="createColumn"
      title="Nieuwe Kolom"
    >
      <form @submit.prevent="createColumn" class="space-y-4">
        <input
          v-model="newColumnName"
          type="text"
          placeholder="Naam van kolom"
          class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
            focus:ring-color: var(--color-accent-muted);
            font-family: var(--font-sans);
          "
          required
        />
      </form>
    </BaseModal>

    <!-- Card modal -->
    <BaseModal
      v-if="showCardModal"
      @close="showCardModal = false"
      @confirm="createCard"
      title="Nieuwe Kaart"
    >
      <section class="space-y-4">
        <input
          v-model="newCardTitle"
          type="text"
          placeholder="Titel van kaart"
          class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
            focus:ring-color: var(--color-accent-muted);
            font-family: var(--font-sans);
          "
          required
        />
        <textarea
          v-model="newCardDescription"
          placeholder="Beschrijving (optioneel)"
          class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
            focus:ring-color: var(--color-accent-muted);
            font-family: var(--font-sans);
          "
        ></textarea>
      </section>
    </BaseModal>

    <!-- Edit Card modal -->
    <BaseModal
      v-if="showEditModal"
      title="Kaart bewerken"
      confirm-text="Opslaan"
      cancel-text="Annuleren"
      @close="closeModal"
      @confirm="confirmEdit"
    >
      <section class="space-y-4">
        <input
          v-model="selectedCard.title"
          type="text"
          placeholder="Titel van kaart"
          class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
            focus:ring-color: var(--color-accent-muted);
            font-family: var(--font-sans);
          "
          required
        />
        <textarea
          v-model="selectedCard.description"
          placeholder="Beschrijving (optioneel)"
          class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"
          style="
            background-color: var(--color-surface);
            border-color: var(--color-border);
            color: var(--color-text);
            focus:ring-color: var(--color-accent-muted);
            font-family: var(--font-sans);
          "
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
import BoardColumn from '../components/boards/BoardColumn.vue'
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

// Edit Card modal
const showEditModal = ref(false)
const selectedCard = ref({})

async function loadBoardData() {
  const id = route.params.id

  await boardsStore.fetchBoards()
  board.value = boardsStore.boards.find(b => b.id === id)

  if (!board.value) return

  // Haal kolommen op
  await columnsStore.fetchColumns(id)

  for (const col of columnsStore.columns) {
    await cardsStore.fetchCards(col.id)
  }
  
  // Kolommen + kaarten samenvoegen
  const merged = (columnsStore.columns || []).map(col => ({
    ...col,
    cards: cardsStore.cardsByColumn[col.id] || []
  }))

  columns.value = merged
}

onMounted(async () => {
  await loadBoardData()
})

// -------- Column actions --------
function openNewColumnModal() {
  showColumnModal.value = true
}

async function createColumn() {
  if (!newColumnName.value) return

  await columnsStore.createColumn(board.value.id, newColumnName.value)
  newColumnName.value = ''
  showColumnModal.value = false

  await loadBoardData()
}

// -------- Card actions --------
function openNewCardModal(columnId) {
  cardColumnId.value = columnId
  newCardTitle.value = ''
  newCardDescription.value = ''
  showCardModal.value = true
}

async function createCard() {
  if (!newCardTitle.value) return

  const created = await cardsStore.createCard(
    cardColumnId.value,
    newCardTitle.value,
    newCardDescription.value
  )

  showCardModal.value = false
  newCardTitle.value = ''
  newCardDescription.value = ''

  const col = columns.value.find(c => c.id === cardColumnId.value)
  if (col) col.cards.push(created)
}

function editCard(card) {
  selectedCard.value = card
  showEditModal.value = true
}

function deleteColumn(columnId) {
  if (!confirm('Kolom verwijderen?')) return
  columnsStore.deleteColumn(columnId)
  columns.value = columns.value.filter(c => c.id !== columnId)
}

// -------- Drag & Drop --------
function onCardMoved({ cardId, fromColumnId, toColumnId, oldIndex, newIndex }) {
  const fromCol = columns.value.find(c => c.id === fromColumnId)
  const toCol = columns.value.find(c => c.id === toColumnId)
  if (!fromCol || !toCol) return

  const [movedCard] = fromCol.cards.splice(oldIndex, 1)
  toCol.cards.splice(newIndex, 0, movedCard)
}
</script>
