<template>
  <aside
    class="fixed inset-0 z-50 flex justify-center items-start pt-20"
    @click.self="close"
  >
    <!-- Backdrop -->
    <section class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></section>

    <!-- Panel -->
    <section
      class="relative rounded-xl shadow-xl w-full max-w-3xl p-6 bg-surface text-text font-sans flex gap-6"
    >
      <!-- Left: Title + Description -->
      <section class="flex-1">
        <header class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold font-display text-accent">{{ card.title }}</h2>
          <button @click="close" class="text-lg font-bold text-accent-muted hover:opacity-80 transition">
            &times;
          </button>
        </header>

        <p class="text-text-muted">{{ card.description || 'Geen beschrijving' }}</p>
      </section>

      <!-- Right: Nav + Tab Content -->
      <section class="w-64 flex flex-col">
        <!-- Nav Bar -->
        <nav class="flex border-b border-gray-300 mb-4 justify-end" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :aria-selected="activeTab === tab"
            :class="[
              'px-3 py-2 -mb-px font-medium transition',
              activeTab === tab
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-muted hover:text-text'
            ]"
            role="tab"
          >
            {{ tab }}
          </button>
        </nav>

        <!-- Tab Content -->
        <section class="flex-1 flex flex-col overflow-y-auto">
          <!-- Comments Tab -->
          <section v-if="activeTab === 'Comments'" role="tabpanel" class="flex-1 flex flex-col">
            <ul class="space-y-2 flex-1 overflow-y-auto mb-2">
              <li v-for="(comment, index) in card.comments" :key="index" class="text-text-muted">
                {{ comment }}
              </li>
              <li v-if="!card.comments || card.comments.length === 0" class="text-text-muted">
                Geen comments
              </li>
            </ul>

            <!-- Add Comment Form -->
            <form @submit.prevent="addComment" class="flex gap-2">
              <textarea
                v-model="newComment"
                placeholder="Voeg een comment toe..."
                class="flex-1 px-2 py-1 rounded border border-gray-300 text-text resize-none"
                rows="2"
                required
              ></textarea>
              <button
                type="submit"
                class="px-3 py-1 rounded bg-accent text-text hover:opacity-85 transition"
              >
                Voeg toe
              </button>
            </form>
          </section>

          <!-- Activity Tab -->
          <section v-else-if="activeTab === 'Activity'" role="tabpanel">
            <p class="text-text-muted">Activiteit log...</p>
          </section>

          <!-- Attachments Tab -->
          <section v-else-if="activeTab === 'Attachments'" role="tabpanel">
            <p class="text-text-muted">Bijlagen lijst...</p>
          </section>
        </section>

        <!-- Footer Buttons -->
        <footer class="flex justify-end gap-2 mt-4">
          <button
            @click="editCard"
            class="px-4 py-2 rounded bg-accent text-text hover:opacity-85 transition"
          >
            Bewerken
          </button>
          <button
            @click="close"
            class="px-4 py-2 rounded bg-primary-btn text-text hover:opacity-85 transition"
          >
            Sluiten
          </button>
        </footer>
      </section>
    </section>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

const tabs = ['Comments', 'Activity', 'Attachments']
const activeTab = ref('Comments')

// Voor nieuw comment
const newComment = ref('')

function close() {
  emit('close')
}

function editCard() {
  emit('edit', props.card)
}

function addComment() {
  if (!props.card.comments) props.card.comments = []
  props.card.comments.push(newComment.value.trim())
  newComment.value = ''
}
</script>

<style scoped>
aside {
  transition: opacity 0.2s ease;
}
button:hover {
  opacity: 0.85;
}
textarea:focus {
  outline: 2px solid var(--color-accent);
}
</style>