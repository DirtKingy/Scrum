<template>
  <aside
    class="fixed inset-0 z-50 flex justify-center items-start pt-10 sm:pt-20"
    @click.self="close"
  >
    <!-- Backdrop -->
    <section class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></section>

    <!-- Panel -->
    <section
      class="relative rounded-xl shadow-xl w-full max-w-4xl p-4 sm:p-6 
             bg-surface text-text font-sans 
             flex flex-col md:flex-row gap-6 
             h-[90vh] md:h-[600px]"
    >
      <!-- Left -->
      <section class="flex-1 flex flex-col min-h-0">
        <header class="mb-4 flex-shrink-0">
          <h2 class="text-xl font-semibold font-display text-accent break-words leading-snug">
            {{ card.title }}
          </h2>
        </header>

        <!-- Labels -->
        <section class="mb-4">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Labels
          </p>

          <section class="flex flex-wrap gap-2">
            <span
              v-for="(label, index) in card.labels"
              :key="index"
              class="px-2 py-1 rounded text-xs font-semibold"
              :style="{
                backgroundColor: label.labels?.color || label.color || 'var(--color-accent)',
                color: '#0f172a'
              }"
            >
              {{ label.labels?.name || label.name || label.text }}
            </span>

            <span v-if="!card.labels?.length" class="text-text-muted text-sm">
              Geen labels
            </span>
          </section>
        </section>

        <!-- Description -->
        <section class="overflow-y-auto">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Beschrijving
          </p>
          <p class="text-text-muted">
            {{ card.description || 'Geen beschrijving' }}
          </p>
        </section>
      </section>

      <!-- Right -->
      <section class="w-full md:w-78 flex flex-col h-full min-h-0 flex-shrink-0">

        <!-- Labels -->
        <section class="mb-4">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Voeg label toe
          </p>

          <section class="flex gap-2">
            <input
              v-model="newLabel"
              placeholder="Label naam..."
              class="flex-1 px-2 py-1 rounded border border-gray-400 bg-surface text-text text-sm"
            />

            <input
              v-model="newLabelColor"
              type="color"
              class="w-10 h-8 p-0 border-none cursor-pointer"
            />

            <button
              @click="addLabel"
              class="px-3 py-1 rounded bg-accent text-[#0f172a] font-semibold"
            >
              +
            </button>
          </section>
        </section>

        <!-- Tabs -->
        <nav class="flex border-b border-gray-300 mb-4">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 py-2 font-medium',
              activeTab === tab ? 'text-accent border-b-2 border-accent' : 'text-text-muted'
            ]"
          >
            {{ tab }}
          </button>
        </nav>

        <!-- Content -->
        <section class="flex-1 flex flex-col min-h-0">

          <!-- Comments -->
          <section v-if="activeTab === 'Comments'" class="flex-1 flex flex-col">
            <ul class="flex-1 overflow-y-auto mb-3">
              <li v-for="comment in card.comments" :key="comment.id">
                {{ comment.comment }}
              </li>
              <li v-if="!card.comments?.length">Geen comments</li>
            </ul>

            <form @submit.prevent="addComment" class="flex flex-col gap-2">
              <textarea
                v-model="newComment"
                class="w-full px-3 py-2 border rounded bg-surface"
                rows="3"
              />
              <button class="self-end px-3 py-2 bg-accent text-[#0f172a] rounded">
                Voeg toe
              </button>
            </form>
          </section>

          <!-- Activity -->
          <section v-else-if="activeTab === 'Activity'">
            <p class="text-text-muted">Activiteit log...</p>
          </section>

          <!-- Attachments -->
          <section v-else-if="activeTab === 'Attachments'" class="flex-1 flex flex-col">
            <p class="text-xs uppercase text-text-muted mb-2">Attachments</p>

            <!-- upload -->
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileUpload"
            />

            <section class="mb-3 flex items-center gap-2">
              <button
                @click="triggerFileInput"
                class="px-3 py-2 rounded bg-accent text-[#0f172a] font-semibold hover:opacity-90 transition"
              >
                + Bestand uploaden
              </button>
            </section>

            <ul class="flex-1 overflow-y-auto">
              <li
                v-for="file in card.attachments"
                :key="file.id"
                class="flex justify-between items-center text-text-muted"
              >
                <section class="flex items-center gap-2">
                  <img
                    v-if="file.url"
                    :src="file.url"
                    class="w-10 h-10 object-cover rounded"
                  />
                  {{ file.name }}
                </section>

                <button @click="removeAttachment(file)">
                  ✕
                </button>
              </li>

              <li v-if="!card.attachments?.length">
                Geen bijlagen
              </li>
            </ul>
          </section>

        </section>

        <!-- Footer -->
        <footer class="flex justify-end gap-2 mt-4">
          <button
            @click="editCard"
            class="px-4 py-2 bg-accent text-[#0f172a] rounded"
          >
            Bewerken
          </button>

          <button
            @click="close"
            class="px-4 py-2 bg-primary-btn border rounded"
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
  card: Object
})

const emit = defineEmits([
  'close',
  'edit',
  'add-label',
  'add-comment',
  'upload-attachment',
  'delete-attachment'
])

const tabs = ['Comments', 'Activity', 'Attachments']
const activeTab = ref('Comments')

const newComment = ref('')
const newLabel = ref('')
const newLabelColor = ref('#40E0D0')

function close() {
  emit('close')
}

function editCard() {
  emit('edit', props.card)
}

/* ---------------- LABELS ---------------- */

function addLabel() {
  if (!newLabel.value.trim()) return

  emit('add-label', {
    name: newLabel.value.trim(),
    color: newLabelColor.value
  })

  newLabel.value = ''
}

/* ---------------- COMMENTS ---------------- */

function addComment() {
  if (!newComment.value.trim()) return

  emit('add-comment', newComment.value.trim())

  newComment.value = ''
}

/* ---------------- ATTACHMENTS ---------------- */

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  emit('upload-attachment', file)
}

function removeAttachment(file) {
  emit('delete-attachment', file)
}

const fileInput = ref(null)

function triggerFileInput() {
  fileInput.value?.click()
}
</script>

<style scoped>
aside { transition: opacity 0.2s ease; }
</style>