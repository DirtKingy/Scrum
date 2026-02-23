<template>
  <aside class="w-64 bg-[var(--color-surface)] shadow-md flex flex-col h-screen p-6">

    <h2 class="text-2xl font-semibold mb-6">Boards</h2>

    <!-- Recent -->
    <section v-if="recentBoards.length" class="mb-6">
      <h3 class="text-lg font-medium mb-3">Recent</h3>

      <ul class="flex flex-col gap-2">
        <li
          v-for="board in recentBoards"
          :key="board.id"
          class="flex justify-between items-center px-3 py-2 rounded hover:bg-[var(--color-accent-muted)]"
        >
          <RouterLink :to="`/board/${board.id}`" class="flex-1 truncate">
            {{ board.name }}
          </RouterLink>

          <button
            @click.stop="$emit('menu', { board, event: $event })"
          >
            ⋮
          </button>
        </li>
      </ul>
    </section>

    <!-- Alle Borden -->
    <section class="flex-1 overflow-auto">
      <h3 class="text-lg font-medium mb-3">Alle Borden</h3>

      <ul class="flex flex-col gap-2">
        <li
          v-for="board in boards"
          :key="board.id"
          class="flex justify-between items-center px-3 py-2 rounded hover:bg-[var(--color-accent-muted)]"
        >
          <RouterLink :to="`/board/${board.id}`" class="flex-1 truncate">
            {{ board.name }}
          </RouterLink>

          <button
            @click.stop="$emit('menu', { board, event: $event })"
          >
            ⋮
          </button>
        </li>
      </ul>
    </section>

  </aside>
</template>

<script setup>
defineProps({
  boards: Array,
  recentBoards: Array
})

defineEmits(['menu'])
</script>