<template>
  <aside class="w-64 bg-[var(--color-surface-alt)] border-r border-[var(--color-border)] flex flex-col h-screen p-6">

    <h2 class="text-2xl font-semibold mb-6">Boards</h2>

    <!-- Recent -->
    <section v-if="recentBoards.length" class="mb-8">
      <h3 class="text-sm font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">
        Recent
      </h3>

      <ul class="flex flex-col gap-3">
        <li
          v-for="board in recentBoards"
          :key="board.id"
          class="group flex justify-between items-center px-3 py-2 rounded-lg
                 bg-[var(--color-surface)]
                 border border-[var(--color-border)]
                 hover:bg-[var(--color-accent)]
                 transition-colors"
        >
          <RouterLink
            :to="`/board/${board.id}`"
            class="flex-1 truncate group-hover:text-black"
          >
            {{ board.name }}
          </RouterLink>

          <button
            class="opacity-60 hover:opacity-100 group-hover:text-black"
            @click.stop="$emit('menu', { board, event: $event })"
          >
            ⋮
          </button>
        </li>
      </ul>
    </section>

    <!-- Alle Borden -->
    <section class="flex-1 overflow-auto">
      <h3 class="text-sm font-medium text-[var(--color-text-muted)] mb-3 uppercase tracking-wide">
        Alle Borden
      </h3>

      <ul class="flex flex-col gap-3">
        <li
          v-for="board in boards"
          :key="board.id"
          class="group flex justify-between items-center px-3 py-2 rounded-lg
                 bg-[var(--color-surface)]
                 border border-[var(--color-border)]
                 hover:bg-[var(--color-accent)]
                 transition-colors"
        >
          <RouterLink
            :to="`/board/${board.id}`"
            class="flex-1 truncate group-hover:text-black"
          >
            {{ board.name }}
          </RouterLink>

          <button
            class="opacity-60 hover:opacity-100 group-hover:text-black"
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