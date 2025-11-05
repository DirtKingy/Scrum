<template>
  <div>
    <h1>{{ board?.name || 'Board not found' }}</h1>
    <div class="columns">
      <Column v-for="column in columns" :key="column.id" :column="column" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Column from '../components/Column.vue'
import { useBoardsStore } from '../stores/boardsStore'
import { useColumnsStore } from '../stores/columnsStore'

const props = defineProps({ id: String })
const boardsStore = useBoardsStore()
const columnsStore = useColumnsStore()

const board = ref(null)
const columns = ref([])

onMounted(async () => {
  await boardsStore.fetchBoards()
  board.value = boardsStore.boards.find(b => b.id === props.id)

  if (board.value) {
    await columnsStore.fetchColumns(props.id)
    columns.value = columnsStore.columns
  }
})
</script>
