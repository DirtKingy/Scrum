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
                backgroundColor: label.color || 'var(--color-accent)',
                color: '#0f172a'
              }"
            >
              {{ label.text }}
            </span>

            <span
              v-if="!card.labels || card.labels.length === 0"
              class="text-text-muted text-sm"
            >
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
        
        <!-- Voeg label toe -->
        <section class="mb-4">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Voeg label toe
          </p>

          <section class="flex gap-2">
            <input
              v-model="newLabel"
              placeholder="Label naam..."
              class="flex-1 px-2 py-1 rounded border border-gray-400 bg-surface text-text text-sm focus:border-accent focus:ring-1 focus:ring-accent"
            />

            <input
              v-model="newLabelColor"
              type="color"
              class="w-10 h-8 p-0 border-none cursor-pointer"
            />

            <button
              @click="addLabel"
              class="px-3 py-1 rounded bg-accent text-[#0f172a] font-semibold hover:brightness-110 transition"
            >
              +
            </button>
          </section>
        </section>

        <!-- Tabs -->
        <nav
          class="flex border-b border-gray-300 mb-4 justify-start md:justify-end overflow-x-auto flex-shrink-0"
          role="tablist"
        >
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 py-2 -mb-px font-medium transition whitespace-nowrap min-w-max',
              activeTab === tab
                ? 'border-b-2 border-accent text-accent'
                : 'text-text-muted hover:text-text'
            ]"
          >
            {{ tab }}
          </button>
        </nav>

        <!-- Tab Content -->
        <section class="flex-1 flex flex-col min-h-0">

          <!-- Comments -->
          <section v-if="activeTab === 'Comments'" class="flex-1 flex flex-col min-h-0">
            <ul class="space-y-2 flex-1 overflow-y-auto mb-3 pr-1">
              <li v-for="(comment, index) in card.comments" :key="index">
                {{ comment }}
              </li>
              <li v-if="!card.comments?.length">Geen comments</li>
            </ul>

            <form @submit.prevent="addComment" class="flex flex-col gap-2">
              <textarea
                v-model="newComment"
                placeholder="Schrijf iets..."
                class="w-full px-3 py-2 rounded border border-gray-400 text-text resize-none bg-surface focus:border-accent focus:ring-1 focus:ring-accent"
                rows="3"
              ></textarea>
              <button
                type="submit"
                class="self-end px-3 py-2 rounded bg-accent text-[#0f172a] font-semibold hover:brightness-110 transition"
              >
                Voeg toe
              </button>
            </form>
          </section>

          <!-- Activity -->
          <section v-else-if="activeTab === 'Activity'">
            <p class="text-text-muted">Activiteit log...</p>
          </section>

          <!-- Attachments -->
          <section v-else-if="activeTab === 'Attachments'" class="flex-1 flex flex-col min-h-0">
            <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
              Attachments
            </p>

            <!-- Upload -->
            <input
              type="file"
              @change="handleFileUpload"
              class="mb-3"
            />

            <!-- List -->
            <ul class="space-y-2 flex-1 overflow-y-auto mb-3 pr-1">
              <li
                v-for="(file, index) in card.attachments"
                :key="index"
                class="text-text-muted break-words flex justify-between items-center"
              >
                <section class="flex items-center gap-2">
                  <img
                    v-if="file.type.startsWith('image/')"
                    :src="file.data"
                    class="w-10 h-10 object-cover rounded"
                  />
                  {{ file.name }}
                </section>

                <button @click="removeAttachment(index)">✕</button>
              </li>

              <li v-if="!card.attachments?.length" class="text-text-muted">
                Geen bijlagen
              </li>
            </ul>
          </section>

        </section>

        <!-- Footer -->
        <footer class="flex justify-end gap-2 mt-4">
          <button
            @click="editCard"
            class="px-4 py-2 rounded bg-accent text-[#0f172a] font-semibold hover:brightness-110 transition shadow-md"
          >
            Bewerken
          </button>
          <button
            @click="close"
            class="px-4 py-2 rounded bg-primary-btn text-text font-medium border border-gray-500 hover:bg-[var(--color-primary-btn-hover)]"
          >
            Sluiten
          </button>
        </footer>
      </section>
    </section>
  </aside>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  card: { type: Object, required: true }
})

const emit = defineEmits(['close', 'edit'])

const tabs = ['Comments', 'Activity', 'Attachments']
const activeTab = ref('Comments')

const newComment = ref('')
const newLabel = ref('')
const newLabelColor = ref('#40E0D0')

// Storage keys
const storageKey = () => `card_labels_${props.card.id}`
const attachmentKey = () => `card_attachments_${props.card.id}`

// Load labels & attachments
onMounted(() => {
  const savedLabels = localStorage.getItem(storageKey())
  props.card.labels = savedLabels ? JSON.parse(savedLabels) : props.card.labels || []

  const savedAttachments = localStorage.getItem(attachmentKey())
  props.card.attachments = savedAttachments ? JSON.parse(savedAttachments) : props.card.attachments || []
})

// Save labels
watch(
  () => props.card.labels,
  (v) => localStorage.setItem(storageKey(), JSON.stringify(v)),
  { deep: true }
)

// Save attachments
watch(
  () => props.card.attachments,
  (v) => localStorage.setItem(attachmentKey(), JSON.stringify(v)),
  { deep: true }
)

// Actions
function close() { emit('close') }
function editCard() { emit('edit', props.card) }

function addComment() {
  if (!props.card.comments) props.card.comments = []
  props.card.comments.push(newComment.value.trim())
  newComment.value = ''
}

function addLabel() {
  if (!newLabel.value.trim()) return
  if (!props.card.labels) props.card.labels = []

  props.card.labels.push({ text: newLabel.value.trim(), color: newLabelColor.value })
  newLabel.value = ''
}

// Attachments
function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    props.card.attachments.push({ name: file.name, type: file.type, data: e.target.result })
  }
  reader.readAsDataURL(file)
}

function removeAttachment(index) {
  props.card.attachments.splice(index, 1)
}
</script>

<style scoped>
aside { transition: opacity 0.2s ease; }
</style>