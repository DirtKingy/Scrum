<template>
  <div>
    <h1>All Boards</h1>

    <!-- Error -->
    <div v-if="boardsStore.errorMessage" class="error">
      {{ boardsStore.errorMessage }}
    </div>

    <!-- Create new board -->
    <input v-model="newBoardName" placeholder="Board name" />
    <button @click="addBoard">Create Board</button>

    <!-- Board list -->
    <ul>
      <li v-for="board in boardsStore.boards" :key="board.id">
        {{ board.name }}
        <button @click="editBoard(board)">Edit</button>
        <button @click="deleteBoard(board.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useBoardsStore } from '../stores/boardsStore'

const boardsStore = useBoardsStore()
const newBoardName = ref('')

// Fetch boards on mount
onMounted(() => {
  boardsStore.fetchBoards()
})

// Create
function addBoard() {
  if (!newBoardName.value) return
  boardsStore.createBoard(newBoardName.value)
  newBoardName.value = ''
}

// Update
function editBoard(board) {
  const newName = prompt('Update board name:', board.name)
  if (newName) boardsStore.updateBoard(board.id, newName)
}

// Delete
function deleteBoard(id) {
  if (confirm('Weet je zeker dat je dit board wilt verwijderen?')) {
    boardsStore.deleteBoard(id)
  }
}
</script>

<style scoped>
.error { color: red; }
</style>
