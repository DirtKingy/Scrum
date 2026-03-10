<template>
  <main
    class="flex min-h-screen font-sans"
    :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }"
  >

    <!-- Sidebar -->
    <Sidebar
      :boards="boards"
      :recentBoards="recentBoards"
      @menu="openMenu"
    />

    <!-- Click outside -->
    <section
      v-if="menuBoard"
      class="fixed inset-0 z-40"
      @click="closeMenu"
    />

    <!-- Menu -->
    <section
      v-if="menuBoard"
      class="fixed z-50 bg-[var(--color-surface)] shadow-lg rounded-lg border w-40"
      :style="{ top: menuY + 'px', left: menuX + 'px' }"
    >
      <button
        @click="handleEdit"
        class="block w-full text-left px-4 py-2 hover:bg-[var(--color-accent-muted)]"
      >
        Bewerken
      </button>

      <button
        @click="handleDelete"
        class="block w-full text-left px-4 py-2 text-[var(--color-danger)] hover:bg-[var(--color-danger-muted)]"
      >
        Verwijderen
      </button>
    </section>

    <!-- Content -->
    <section class="flex-1 p-8">

      <!-- Header -->
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-semibold mb-2">Scrum Boards</h1>
        <p class="text-[var(--color-text-muted)] text-lg">
          Beheer je projecten en taken overzichtelijk
        </p>
      </header>

      <Toast />

      <!-- Create Board Form -->
      <form
        @submit.prevent="addBoard"
        class="mb-10 max-w-lg mx-auto flex flex-col gap-3"
      >
        <input
          v-model="newBoardName"
          placeholder="Nieuw board..."
          class="px-4 py-3 rounded-lg shadow border focus:ring-2 transition outline-none"
          :style="inputStyle"
          required
        />

        <button
          type="submit"
          class="px-6 py-3 font-medium rounded-lg transition shadow"
          :style="buttonStyle"
        >
          + Toevoegen
        </button>

        <label class="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <input type="checkbox" v-model="useTemplate">
          Standaard kolommen aanmaken (Backlog, Todo, In Progress, Review, Done)
        </label>
      </form>

    </section>

    <!-- Modals -->
    <BaseModal
      v-if="showEditModal"
      title="Board bewerken"
      confirm-text="Opslaan"
      cancel-text="Annuleren"
      @close="closeModal"
      @confirm="confirmEdit"
    >
      <input
        v-model="editBoardName"
        class="w-full px-3 py-3 rounded-lg border shadow outline-none focus:ring-2"
        :style="inputStyle"
      />
    </BaseModal>

    <BaseModal
      v-if="showDeleteModal"
      title="Board verwijderen"
      confirm-text="Verwijderen"
      cancel-text="Annuleren"
      :danger="true"
      @close="closeModal"
      @confirm="confirmDelete"
    >
      <p class="text-[var(--color-text-muted)]">
        Weet je zeker dat je het board
        <span class="font-semibold" style="color: var(--color-danger)">
          "{{ selectedBoard?.name }}"
        </span>
        wilt verwijderen?
      </p>
    </BaseModal>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useBoardsStore } from '@/stores/boardsStore'
import Sidebar from '@/components/boards/Sidebar.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import Toast from '@/components/Toast/Toast.vue'

const boardsStore = useBoardsStore()
const newBoardName = ref('')
const useTemplate = ref(false)

// Modal state
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editBoardName = ref('')
const selectedBoard = ref(null)

// Boards & recent
const boards = computed(() => boardsStore.sortedBoards)
const recentBoards = computed(() =>
  [...boards.value]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
)

// Menu state
const menuBoard = ref(null)
const menuX = ref(0)
const menuY = ref(0)

function openMenu({ board, event }) {
  menuBoard.value = board
  menuX.value = event.clientX
  menuY.value = event.clientY
}

function closeMenu() {
  menuBoard.value = null
}

function handleEdit() {
  openEditModal(menuBoard.value)
  closeMenu()
}

function handleDelete() {
  openDeleteModal(menuBoard.value)
  closeMenu()
}

// Fetch boards on mount
onMounted(() => {
  boardsStore.fetchBoards()
})

// --- Actions ---
async function addBoard() {
  if (!newBoardName.value) return
  await boardsStore.createBoard(newBoardName.value, useTemplate.value)
  newBoardName.value = ''
  useTemplate.value = false
}

function openEditModal(board) {
  selectedBoard.value = board
  editBoardName.value = board.name
  showEditModal.value = true
}

function openDeleteModal(board) {
  selectedBoard.value = board
  showDeleteModal.value = true
}

function closeModal() {
  showEditModal.value = false
  showDeleteModal.value = false
  selectedBoard.value = null
}

async function confirmEdit() {
  if (!selectedBoard.value) return
  await boardsStore.updateBoard(selectedBoard.value.id, editBoardName.value)
  closeModal()
}

async function confirmDelete() {
  if (!selectedBoard.value) return
  await boardsStore.deleteBoard(selectedBoard.value.id)
  closeModal()
}

// Styles
const inputStyle = {
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text)'
}

const buttonStyle = {
  backgroundColor: 'var(--color-primary-btn)',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text)'
}
</script>