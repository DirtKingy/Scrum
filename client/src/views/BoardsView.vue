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

    <!-- Boards Grid -->
    <section class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="board in boardsStore.boards"
        :key="board.id"
        class="bg-gray-800 rounded-xl shadow hover:shadow-xl transition p-6 flex flex-col justify-between"
      >
      <RouterLink
        :to="`/board/${board.id}`"
        class="text-xl font-semibold mb-4 text-purple-300 hover:text-purple-400 transition"
      >
        {{ board.name }}
      </RouterLink>

        <footer class="mt-auto flex justify-between items-center text-gray-400">
          <small class="text-sm">
            Gemaakt: {{ formatDate(board.created_at) }}
          </small>
          <div class="flex gap-2">
            <button
              @click="openEditModal(board)"
              class="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
            >
              Bewerken
            </button>
            <button
              @click="openDeleteModal(board)"
              class="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Verwijderen
            </button>
          </div>
        </footer>
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
import BaseModal from '../components/BaseModal.vue'

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
