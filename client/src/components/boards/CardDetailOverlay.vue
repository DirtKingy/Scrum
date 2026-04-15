<template>
  <aside
    class="fixed inset-0 z-50 flex justify-center items-start pt-10 sm:pt-20"
    @click.self="close"
  >
    <section class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></section>

    <section
      class="relative rounded-xl shadow-xl w-full max-w-4xl p-4 sm:p-6 
             bg-surface text-text font-sans 
             flex flex-col md:flex-row gap-6 
             h-[90vh] md:h-[600px]"
    >
      <!-- LEFT -->
      <section class="flex-1 flex flex-col min-h-0">

        <header class="mb-4 flex-shrink-0">
          <h2 class="text-xl font-semibold font-display text-accent break-words leading-snug">
            {{ card.title }}
          </h2>
        </header>

        <!-- LABELS DISPLAY -->
        <section class="mb-4">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Labels
          </p>

          <section class="flex flex-wrap gap-2">
            <span
              v-for="label in card.labels"
              :key="label.id || label.labels?.id"
              class="px-2 py-1 rounded text-xs font-semibold"
              :style="{
                backgroundColor: label.color || label.labels?.color || 'var(--color-accent)',
                color: '#0f172a'
              }"
            >
              {{ label.name || label.labels?.name }}
            </span>

            <span v-if="!card.labels?.length" class="text-text-muted text-sm">
              Geen labels
            </span>
          </section>
        </section>

        <!-- LABEL DROPDOWN -->
        <section class="mb-4 relative">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Labels toevoegen
          </p>

          <button
            @click="showLabelDropdown = !showLabelDropdown"
            class="px-3 py-2 rounded bg-accent text-[#0f172a] font-semibold w-full"
          >
            + Voeg label toe
          </button>

          <section
            v-if="showLabelDropdown"
            class="absolute z-10 mt-2 w-full bg-surface border rounded shadow-lg p-3"
          >
            <p class="text-xs text-text-muted mb-2">
              Bestaande labels
            </p>

            <ul class="space-y-1 mb-3">
              <li v-for="label in props.labels" :key="label.id">
                <button
                  @click="toggleLabel(label)"
                  class="w-full text-left px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2"
                >
                  <span
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: label.color || '#ccc' }"
                  />
                  {{ label.name }}
                </button>
              </li>

              <li v-if="!props.labels?.length" class="text-text-muted text-sm">
                Geen labels beschikbaar
              </li>
            </ul>

            <hr class="my-2 border-gray-200" />

            <!-- CREATE LABEL (blijft bestaan maar correct gescheiden) -->
            <p class="text-xs text-text-muted mb-2">
              Nieuwe label
            </p>

            <input
              v-model="newLabel"
              placeholder="Label naam..."
              class="w-full px-2 py-1 mb-2 border rounded bg-surface text-sm"
            />

            <section class="flex items-center gap-2">
              <input
                v-model="newLabelColor"
                type="color"
                class="w-8 h-8"
              />

              <button
                @click="createLabel"
                class="px-3 py-1 rounded bg-accent text-[#0f172a] text-sm"
              >
                Create
              </button>
            </section>
          </section>
        </section>

        <!-- DESCRIPTION -->
        <section class="overflow-y-auto">
          <p class="text-xs uppercase tracking-wide text-text-muted mb-2">
            Beschrijving
          </p>
          <p class="text-text-muted">
            {{ card.description || 'Geen beschrijving' }}
          </p>
        </section>

      </section>

      <!-- RIGHT -->
      <section class="w-full md:w-78 flex flex-col h-full min-h-0 flex-shrink-0">

        <!-- TABS -->
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

        <!-- CONTENT -->
        <section class="flex-1 flex flex-col min-h-0">

          <!-- COMMENTS (ORIGINEEL TERUG) -->
          <section v-if="activeTab === 'Comments'" class="flex-1 flex flex-col">
            <ul class="flex-1 overflow-y-auto mb-3">
              <li v-for="comment in card.comments" :key="comment.id">
                {{ comment.comment }}
              </li>

              <li v-if="!card.comments?.length">
                Geen comments
              </li>
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

          <!-- ACTIVITY -->
          <section v-else-if="activeTab === 'Activity'">
            <p class="text-text-muted">Activiteit log...</p>
          </section>

          <!-- ATTACHMENTS (ORIGINEEL TERUG) -->
          <section v-else-if="activeTab === 'Attachments'" class="flex-1 flex flex-col">
            <p class="text-xs uppercase text-text-muted mb-2">Attachments</p>

            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileUpload"
            />

            <section class="mb-3 flex items-center gap-2">
              <button
                @click="triggerFileInput"
                class="px-3 py-2 rounded bg-accent text-[#0f172a] font-semibold"
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

        <!-- FOOTER -->
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
  card: Object,
  labels: { type: Array, default: () => [] }
})

const emit = defineEmits([
  'close',
  'edit',
  'add-label',
  'remove-label',
  'create-label',
  'add-comment',
  'upload-attachment',
  'delete-attachment'
])

const tabs = ['Comments', 'Activity', 'Attachments']
const activeTab = ref('Comments')

const newComment = ref('')
const newLabel = ref('')
const newLabelColor = ref('#40E0D0')
const showLabelDropdown = ref(false)

/* ================= LABEL LOGIC ================= */

function toggleLabel(label) {
  if (hasLabel(label)) {
    emit('remove-label', label)
  } else {
    emit('add-label', label)
  }
}

function hasLabel(label) {
  return props.card.labels?.some(l => l.id === label.id)
}

function createLabel() {
  if (!newLabel.value.trim()) return

  emit('create-label', {
    name: newLabel.value.trim(),
    color: newLabelColor.value
  })

  newLabel.value = ''
}

/* ================= OTHER ================= */

function close() {
  emit('close')
}

function editCard() {
  emit('edit', props.card)
}

function addComment() {
  if (!newComment.value.trim()) return
  emit('add-comment', newComment.value.trim())
  newComment.value = ''
}

function handleFileUpload(e) {
  const file = e.target.files[0]
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