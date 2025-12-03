<template>
  <main class="min-h-screen bg-gray-900 font-sans p-6 text-gray-100">
    <!-- Header -->
    <header class="mb-8 text-center">
      <h1 class="text-4xl font-bold text-purple-400 mb-2">Scrum Boards</h1>
      <p class="text-gray-400">Beheer je projecten en taken overzichtelijk</p>
    </header>

    <!-- Error message -->
    <p
      v-if="boardsStore.errorMessage"
      class="mb-6 p-4 bg-red-700/30 text-red-400 rounded shadow-sm text-center"
    >
      {{ boardsStore.errorMessage }}
    </p>

    <!-- Create Board Form -->
    <form
      @submit.prevent="addBoard"
      class="mb-8 max-w-md mx-auto flex gap-3 items-center"
    >
      <input
        v-model="newBoardName"
        placeholder="Nieuw board aanmaken..."
        class="flex-1 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm"
        required
      />
      <button
        type="submit"
        class="px-5 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:bg-purple-600 transition"
      >
        + Toevoegen
      </button>
    </form>

    <section class="space-y-3">
      <article
        v-for="board in boardsStore.boards"
        :key="board.id"
        class="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition cursor-pointer group"
        style="border-color: var(--color-border)"
        @click="$router.push(`/board/${board.id}`)"
      >
        <!-- Left side: title & metadata -->
        <div class="flex flex-col">
          <h2
            class="text-lg font-semibold group-hover:underline underline-offset-4"
            style="color: var(--color-accent)"
          >
            {{ board.name }}
          </h2>

          <small style="color: var(--color-text-muted)">
            Gemaakt: {{ formatDate(board.created_at) }}
          </small>
        </div>

        <!-- Middle: Preview info (like Asana recent items) -->
        <div class="hidden md:flex items-center gap-6 text-sm" style="color: var(--color-text-muted)">
          <!-- Example: number of tasks -->
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" style="background-color: var(--color-accent-muted)"></span>
            {{ board.tasks?.length ?? 0 }} taken
          </div>

          <!-- Example: last update -->
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-gray-400"></span>
            Laatste activiteit: {{ board.updated_at ? formatDate(board.updated_at) : '—' }}
          </div>
        </div>

        <!-- Right side: actions -->
        <div class="flex items-center gap-2">
          
          <button
            @click.stop="openEditModal(board)"
            class="px-3 py-1.5 rounded-md text-sm border transition"
            style="
              border-color: var(--color-border);
              background-color: var(--color-surface);
              color: var(--color-text);
            "
          >
            Bewerken
          </button>

          <button
            @click.stop="openDeleteModal(board)"
            class="px-3 py-1.5 rounded-md text-sm transition text-white"
            style="background-color: var(--color-danger-dark)"
          >
            Verwijderen
          </button>

        </div>
      </article>
    </section>

    <!-- Modal: Edit Board -->
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
        class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:ring-2 focus:ring-purple-400 outline-none"
      />
    </BaseModal>

    <!-- Modal: Delete Board -->
    <BaseModal
      v-if="showDeleteModal"
      title="Board verwijderen"
      confirm-text="Verwijderen"
      cancel-text="Annuleren"
      :danger="true"
      @close="closeModal"
      @confirm="confirmDelete"
    >
      <p class="text-gray-300">
        Weet je zeker dat je het board
        <span class="text-red-400 font-semibold">"{{ selectedBoard?.name }}"</span>
        wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
      </p>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBoardsStore } from '../stores/boardsStore'
import BaseModal from '../components/base/BaseModal.vue'

const boardsStore = useBoardsStore()
const newBoardName = ref('')

// modal state
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const editBoardName = ref('')
const selectedBoard = ref(null)

onMounted(() => {
  boardsStore.fetchBoards()
})

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
  await boardsStore.updateBoard(selectedBoard.value.id, editBoardName.value)
  closeModal()
}

async function confirmDelete() {
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
</script>
