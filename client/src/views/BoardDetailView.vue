<template>
  <main
    class="min-h-screen font-sans p-6"
    :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }"
  >
    <!-- Board Header -->
    <BoardHeader
      :board="board"
      @new-column="showColumnModal = true"
      class="mb-8"
    />

    <Toast />

    <section class="flex space-x-4" v-if="board">
      <BoardColumn
        v-for="col in boardColumns"
        :key="col.id"
        :column="col"
        :board-id="board.id"

        :on-add-card="openNewCardModal"
        :on-edit-card="openEditCardModal"
      />
    </section>

    <!-- Column Modal -->
    <BaseModal
      v-if="showColumnModal"
      title="Nieuwe Kolom"
      @close="showColumnModal = false"
      @confirm="createColumn"
    >
      <input
        v-model="newColumnName"
        placeholder="Naam van kolom"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
        required
      />
    </BaseModal>

    <!-- Card Modal -->
    <BaseModal
      v-if="showCardModal"
      title="Nieuwe Kaart"
      @close="showCardModal = false"
      @confirm="createCard"
    >
      <input
        v-model="selectedCard.title"
        type="text"
        placeholder="Titel van kaart"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
        required
      />
      <textarea
        v-model="selectedCard.description"
        placeholder="Beschrijving (optioneel)"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
      ></textarea>
    </BaseModal>

    <!-- Edit Card Modal -->
    <BaseModal
      v-if="showEditModal"
      title="Kaart bewerken"
      @close="showEditModal = false"
      @confirm="saveEditedCard"
    >
      <input
        v-model="selectedCard.title"
        type="text"
        placeholder="Titel van kaart"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
        required
      />
      <textarea
        v-model="selectedCard.description"
        placeholder="Beschrijving (optioneel)"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
      ></textarea>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '../components/base/BaseModal.vue'
import BoardHeader from '../components/boards/BoardHeader.vue'
import BoardColumn from '../components/boards/BoardColumn.vue'
import Toast from '@/components/Toast/Toast.vue'
import { useBoardsStore } from '@/stores/boardsStore'

const route = useRoute()
const boardId = route.params.id
const store = useBoardsStore()

// Modals
const showColumnModal = ref(false)
const showCardModal = ref(false)
const showEditModal = ref(false)
const selectedCard = ref({ title: '', description: '', column_id: null })
const newColumnName = ref('')

// Computed
const board = computed(() => store.getBoardById(boardId).value)
const boardColumns = computed(() =>
  store.getColumnsByBoard(boardId).value.map(col => ({
    ...col,
    cards: store.getCardsByColumn(col.id).value
  }))
)

// Load data
async function loadBoardData() {
  await store.fetchBoards()
  await store.fetchColumns(boardId)
  const columns = store.getColumnsByBoard(boardId).value
  for (const col of columns) {
    await store.fetchCards(boardId, col.id)
  }
}

onMounted(loadBoardData)

// --- Column actions ---
async function createColumn() {
  if (!newColumnName.value) return
  await store.createColumn(boardId, newColumnName.value)
  newColumnName.value = ''
  showColumnModal.value = false
}

async function deleteColumn(columnId) {
  if (!confirm('Kolom verwijderen?')) return
  await store.deleteColumn(boardId, columnId)
}

// --- Card actions ---
function openNewCardModal(columnId) {
  selectedCard.value = { title: '', description: '', column_id: columnId }
  showCardModal.value = true
}

async function createCard() {
  if (!selectedCard.value.title) return
  await store.createCard(boardId, selectedCard.value.column_id, {
    title: selectedCard.value.title,
    description: selectedCard.value.description
  })
  showCardModal.value = false
}

function openEditCardModal(card, columnId) {
  selectedCard.value = { ...card, column_id: columnId }
  showEditModal.value = true
}

async function saveEditedCard() {
  if (!selectedCard.value.id) return
  await store.updateCard(
    boardId,
    selectedCard.value.column_id,
    selectedCard.value.id,
    {
      title: selectedCard.value.title,
      description: selectedCard.value.description
    }
  )
  showEditModal.value = false
}

// --- Drag & Drop ---
// async function onCardMoved({ cardId, fromColumnId, toColumnId, oldIndex, newIndex }) {
//   await store.moveCard(boardId, cardId, fromColumnId, toColumnId, newIndex)
// }
</script>
