<template>
  <main class="min-h-screen font-sans p-6"
        :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }">

    <!-- Board Header -->
    <BoardHeader
      :board="board"
      @new-column="showColumnModal = true"
      class="mb-8"
    />

    <Toast />

    <!-- Empty state -->
    <template v-if="board && boardColumns.length === 0">
      <section
        class="flex flex-col items-center justify-center text-center py-24 px-6 rounded-xl border border-dashed"
        style="border-color: var(--color-border); background: var(--color-surface-alt);"
      >
        <h3 class="text-xl font-semibold mb-2">
          Nog geen kolommen
        </h3>
        <p class="mb-6 max-w-md text-[var(--color-text-muted)]">
          Dit bord is nog leeg. Maak je eerste kolom aan om kaarten te organiseren.
        </p>
        <button
          @click="showColumnModal = true"
          class="px-5 py-2 rounded-lg font-medium transition"
          style="background: var(--color-accent); color: #0f172a;"
        >
          + Nieuwe kolom
        </button>
      </section>
    </template>

    <!-- Columns met draggable -->
    <draggable
      :list="boardColumns"
      item-key="id"
      direction="horizontal"
      class="flex gap-4"
      @change="onColumnDragEnd"
    >
      <template #item="{ element }">
        <BoardColumn
          :column="element"
          @add-card="openNewCardModal"
          @select-card="openCardOverlay"
          @card-drag-intent="onCardDrag"
        />
      </template>
    </draggable>

    <!-- Card Overlay -->
    <CardDetailOverlay
      v-if="activeCard"
      :card="activeCard"
      :labels="allLabels"
      @add-label="addLabel"
      @remove-label="removeLabel"
      @create-label="createLabel"
      @add-comment="addComment"
      @upload-attachment="uploadAttachment"
      @delete-attachment="deleteAttachment"
      @close="closeCardOverlay"
      @edit="openEditFromOverlay"
    />
    
    <!-- Modals -->
    <BaseModal v-if="showColumnModal" title="Nieuwe Kolom" @close="showColumnModal = false" @confirm="createColumn">
      <input
        v-model="newColumnName"
        placeholder="Naam van kolom"
        class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
        required
      />
    </BaseModal>

    <BaseModal v-if="showCardModal" title="Nieuwe Kaart" @close="showCardModal = false" @confirm="createCard">
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
        class="w-full mt-4 px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"
        style="background-color: var(--color-surface); border-color: var(--color-border); color: var(--color-text); font-family: var(--font-sans);"
      ></textarea>
    </BaseModal>

    <BaseModal v-if="showEditModal" title="Kaart bewerken" @close="showEditModal = false" @confirm="saveEditedCard">
      <input v-model="selectedCard.title" type="text" placeholder="Titel van kaart" class="w-full px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition" required />
      <textarea v-model="selectedCard.description" placeholder="Beschrijving (optioneel)" class="w-full mt-4 px-4 py-3 rounded-lg shadow border focus:outline-none focus:ring-2 transition resize-none"></textarea>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'

import BoardHeader from '../components/boards/BoardHeader.vue'
import BoardColumn from '../components/boards/BoardColumn.vue'
import CardDetailOverlay from '@/components/boards/CardDetailOverlay.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import Toast from '@/components/Toast/Toast.vue'

import { useBoardsStore } from '@/stores/boardsStore'

const route = useRoute()
const boardId = route.params.id
const store = useBoardsStore()

// Computed
// const board = computed(() => store.getBoardById(boardId).value)
// const boardColumns = computed(() => {
//   return store.getBoardById(boardId).value?.columns ?? []
// })
// const cards = computed(() => {
//   const col = store.getColumnsByBoard(props.column.board_id)
//     .value.find(c => c.id === props.column.id)

//   return col?.cards ?? []
// })
const activeCard = computed(() => store.activeCard)
const board = computed(() =>
  store.getBoardById(boardId).value ?? null
)

const boardColumns = computed(() =>
  board.value?.columns ?? []
)

// Modals
const showColumnModal = ref(false)
const showCardModal = ref(false)
const showEditModal = ref(false)
const selectedCard = ref({ title: '', description: '', column_id: null })
const newColumnName = ref('')
const allLabels = ref([])

// Load board data
async function loadBoardData() {
  await store.fetchBoards()
  await store.fetchColumns(boardId)

  await store.fetchAllLabels(boardId)

  allLabels.value = store.allLabels
  console.log(allLabels.value)

  for (const col of store.getColumnsByBoard(boardId).value) {
    await store.fetchCards(boardId, col.id)
  }
}
onMounted(loadBoardData)

// Column actions
async function createColumn() {
  if (!newColumnName.value) return
  await store.createColumn(boardId, newColumnName.value)
  newColumnName.value = ''
  showColumnModal.value = false
}

// Card actions
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

// Card overlay
function openCardOverlay(card) { store.openCardDetail(card) }
function closeCardOverlay() { store.closeCardDetail() }
function openEditFromOverlay(card) {
  selectedCard.value = { ...card }
  store.closeCardDetail()
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

function onCardDrag(payload) {
  if (!payload?.cardId) return

  store.moveCard({
    boardId,
    cardId: payload.cardId,
    fromColumnId: payload.fromColumnId,
    toColumnId: payload.toColumnId,
    newIndex: payload.newIndex
  })
}

async function uploadAttachment(file) {
  if (!activeCard.value) return

  const uploaded = await store.uploadAttachment(activeCard.value.id, file)

  if (!activeCard.value.attachments) {
    activeCard.value.attachments = []
  }

  activeCard.value.attachments = [
    ...activeCard.value.attachments,
    uploaded
  ]
}

async function deleteAttachment(file) {
  await store.deleteAttachment(file.id)

  activeCard.value.attachments =
    activeCard.value.attachments.filter(a => a.id !== file.id)
}

async function addComment(text) {
  if (!activeCard.value) return

  const cardId = activeCard.value.id
  await store.addComment(cardId, text)

  if (!activeCard.value.comments) {
    activeCard.value.comments = []
  }
}

async function addLabel(label) {
  if (!activeCard.value) return

  await store.addLabelToCard(activeCard.value.id, label.id)
  await store.fetchCards(boardId, activeCard.value.column_id)
}

async function removeLabel(label) {
  if (!activeCard.value) return

  await store.removeLabelFromCard(activeCard.value.id, label.id)
  await store.fetchCards(boardId, activeCard.value.column_id)
}

async function createLabel(label) {
  const created = await store.createLabel(boardId, label.name, label.color)

  allLabels.value.push(created)
}

// ------------------- DRAG COLUMNS -------------------
function onColumnDragEnd() {
  if (!board.value) return
  store.moveColumn(boardId, board.value.columns)
}
</script>

<style>
.column-enter-from,
.column-leave-to { opacity: 0; transform: translateY(-10px); }
.column-enter-active,
.column-leave-active { transition: all 0.25s ease; }
</style>