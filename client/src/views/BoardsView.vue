<template>
  <main
    class="min-h-screen font-sans p-8"
    :style="{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }"
  >
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
      class="mb-10 max-w-lg mx-auto flex gap-4 items-center"
    >
      <input
        v-model="newBoardName"
        placeholder="Nieuw board..."
        class="flex-1 px-4 py-3 rounded-lg shadow border focus:ring-2 transition outline-none"
        :style="inputStyle"
        required
      />
      <button type="submit" class="px-6 py-3 font-medium rounded-lg transition shadow" :style="buttonStyle">
        + Toevoegen
      </button>
    </form>

    <!-- Boards Grid -->
    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <article
        v-for="board in boards"
        :key="board.id"
        class="p-6 rounded-xl shadow-lg transition hover:shadow-xl flex flex-col border-l-4"
        :style="cardStyle"
      >
        <RouterLink
          :to="`/board/${board.id}`"
          class="text-xl font-semibold mb-4 transition hover:underline underline-offset-4"
          :style="{ color: 'var(--color-accent)' }"
        >
          {{ board.name }}
        </RouterLink>

        <footer class="mt-auto flex justify-between items-center text-base">
          <small :style="{ color: 'var(--color-text-muted)' }">
            Gemaakt: {{ formatDate(board.created_at) }}
          </small>

          <section class="flex gap-3">
            <button
              @click="openEditModal(board)"
              class="px-3 py-1.5 rounded-md transition text-base font-medium border"
              :style="buttonStyle"
            >
              Bewerken
            </button>

            <button
              @click="openDeleteModal(board)"
              class="px-3 py-1.5 rounded-md transition text-base font-medium"
              :style="dangerButtonStyle"
            >
              Verwijderen
            </button>
          </section>
        </footer>
      </article>
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
      <input v-model="editBoardName" class="w-full px-3 py-3 rounded-lg border shadow outline-none focus:ring-2" :style="inputStyle" />
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
import BaseModal from '@/components/base/BaseModal.vue'
import Toast from '@/components/Toast/Toast.vue'

const boardsStore = useBoardsStore()
const newBoardName = ref('')

// Modal state
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editBoardName = ref('')
const selectedBoard = ref(null)

// --- Computed ---
// Haal boards via getter (SSOT pattern)
const boards = computed(() => boardsStore.boards)

onMounted(() => {
  boardsStore.fetchBoards()
})

// --- Actions ---
async function addBoard() {
  if (!newBoardName.value) return
  await boardsStore.createBoard(newBoardName.value)
  newBoardName.value = ''
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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// --- Styles ---
const inputStyle = {
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text)',
  fontFamily: 'var(--font-sans)',
  focus: { ringColor: 'var(--color-accent-muted)' }
}

const buttonStyle = {
  backgroundColor: 'var(--color-primary-btn)',
  borderColor: 'var(--color-border)',
  color: 'var(--color-text)'
}

const dangerButtonStyle = {
  backgroundColor: 'var(--color-danger-dark)',
  color: 'white'
}

const cardStyle = {
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-accent-muted)'
}
</script>
