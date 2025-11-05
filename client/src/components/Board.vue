<template>
  <div class="board">
    <h2>{{ board.name }}</h2>
    <div class="columns">
      <Column v-for="column in columns" :key="column.id" :column="column" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Column from './Column.vue'
import { useColumnsStore } from '../stores/columnsStore'

const props = defineProps({ board: Object })
const columnsStore = useColumnsStore()
const columns = ref([])

onMounted(async () => {
  await columnsStore.fetchColumns(props.board.id)
  columns.value = columnsStore.columns
})
</script>
