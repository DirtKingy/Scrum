<template>
  <main class="min-h-screen bg-gray-900 text-gray-100 font-sans p-6">
    <!-- Header -->
    <header class="mb-8 flex justify-between items-center">
      <div>
        <RouterLink
          to="/"
          class="text-purple-400 hover:text-purple-300 transition font-medium"
        >
          ← Terug naar overzicht
        </RouterLink>

        <h1 class="text-3xl font-bold mt-3 text-purple-300">
          {{ board?.name || 'Board laden...' }}
        </h1>
        <p v-if="board" class="text-gray-400 mt-1 text-sm">
          Gemaakt op {{ formatDate(board.created_at) }}
        </p>
      </div>

      <button
        @click="openNewColumnModal"
        class="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow transition"
      >
        + Nieuwe kolom
      </button>
    </header>

    <!-- Board Grid (Kanban style) -->
    <section
      v-if="board"
      class="flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-700"
    >
      <div
        v-for="column in columns"
        :key="column.id"
        class="bg-gray-800 rounded-xl shadow flex-shrink-0 w-72 p-4 flex flex-col"
      >
        <header class="flex justify-between items-center mb-3">
          <h2 class="text-lg font-semibold text-purple-300">
            {{ column.name }}
          </h2>
          <button
            @click="deleteColumn(column.id)"
            class="text-red-500 hover:text-red-400"
            title="Verwijder kolom"
          >
            ✕
          </button>
        </header>

        <!-- Tasks inside column -->
        <div class="space-y-3 flex-1 overflow-y-auto">
          <div
            v-for="task in column.tasks"
            :key="task.id"
            class="bg-gray-700 p-3 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
          >
            <p class="font-medium text-gray-100">{{ task.title }}</p>
            <p v-if="task.description" class="text-sm text-gray-400 mt-1">
              {{ task.description }}
            </p>
          </div>
        </div>

        <footer class="mt-4">
          <button
            @click="addTask(column.id)"
            class="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            + Nieuwe taak
          </button>
        </footer>
      </div>

      <!-- Add new column button -->
      <div
        @click="openNewColumnModal"
        class="w-72 flex-shrink-0 bg-gray-800/40 rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center text-gray-400 hover:text-purple-400 cursor-pointer transition"
      >
        + Kolom toevoegen
      </div>
    </section>

    <section v-else class="text-center text-gray-400 mt-12">
      <p>Board wordt geladen...</p>
    </section>

    <!-- Modal -->
    <BaseModal v-if="showModal" @close="showModal = false">
      <template #title>Nieuwe Kolom</template>
      <template #content>
        <form @submit.prevent="createColumn" class="space-y-4">
          <input
            v-model="newColumnName"
            type="text"
            placeholder="Naam van kolom"
            class="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-100 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            class="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition"
          >
            Kolom aanmaken
          </button>
        </form>
      </template>
    </BaseModal>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'
import { useBoardsStore } from '../stores/boardsStore'
import { useColumnsStore } from '../stores/columnsStore'

const route = useRoute()
const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()

const board = ref(null)
const columns = ref([])
const showModal = ref(false)
const newColumnName = ref('')

onMounted(async () => {
  const id = route.params.id
  await boardsStore.fetchBoards()
  board.value = boardsStore.boards.find(b => b.id === id)

  if (board.value) {
    await columnsStore.fetchColumns(id)
    columns.value = columnsStore.columns.map(col => ({
      ...col,
      tasks: [] // later vullen met taken
    }))
  }
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function openNewColumnModal() {
  showModal.value = true
}

async function createColumn() {
  await columnsStore.createColumn(board.value.id, newColumnName.value)
  newColumnName.value = ''
  showModal.value = false
  await columnsStore.fetchColumns(board.value.id)
  columns.value = columnsStore.columns.map(col => ({
    ...col,
    tasks: []
  }))
}

function addTask(columnId) {
  alert(`Nieuwe taak toevoegen aan kolom ${columnId} (komt nog)`)
}

function deleteColumn(columnId) {
  if (confirm('Weet je zeker dat je deze kolom wilt verwijderen?')) {
    columnsStore.deleteColumn(columnId)
    columns.value = columns.value.filter(c => c.id !== columnId)
  }
}
</script>
