<template>
  <div>
    <h1>All Boards</h1>
    <div v-if="boardsStore.errorMessage">{{ boardsStore.errorMessage }}</div>
    <Board v-for="board in boardsStore.boards" :key="board.id" :board="board" />
  </div>
</template>

<script setup>
import { useBoardsStore } from '../stores/boardsStore'
import Board from '../components/Board.vue'

const boardsStore = useBoardsStore()
boardsStore.fetchBoards()
</script>
