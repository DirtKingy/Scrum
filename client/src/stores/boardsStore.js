// stores/boardsStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as boardService from '@/services/boardService'
import { useToastStore } from '@/stores/useToastStore'

export const useBoardsStore = defineStore('boards', () => {
  const attachmentsByCard = ref({})
  const boards = ref([])
  const toast = useToastStore()
  const allLabels = ref([])


  // -------------------- HELPERS --------------------
  const findBoard = (boardId) => boards.value.find(b => b.id === boardId)
  const findColumn = (boardId, columnId) => {
    const board = findBoard(boardId)
    return board?.columns.find(c => c.id === columnId)
  }

  // -------------------- GETTERS --------------------
  const getBoardById = (boardId) => computed(() => findBoard(boardId))
  const getColumnsByBoard = (boardId) =>
    computed(() => findBoard(boardId)?.columns || [])
  const getCardsByColumn = (columnId) =>
    computed(() => {
      for (const board of boards.value) {
        const col = board.columns.find(c => c.id === columnId)
        if (col) return col.cards
      }
      return []
    })

  const sortedBoards = computed(() =>
    [...boards.value].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )
  )
  const getAttachments = (cardId) =>
    computed(() => attachmentsByCard.value[cardId] || [])
  // -------------------- CARD OVERLAY --------------------
  const activeCard = ref(null)
  const openCardDetail = (card) => { activeCard.value = card }
  const closeCardDetail = () => { activeCard.value = null }

  // -------------------- BOARDS --------------------
  async function fetchBoards() {
    try {
      const data = await boardService.getBoards()
      boards.value = data.map(b => ({ ...b, columns: [] }))
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon boards niet laden', type: 'error' })
    }
  }

  async function createBoard(name, useTemplate = false) {
    if (!name) return
    try {
      const board = await boardService.createBoard(name)
      const newBoard = { ...board, columns: [] }
      boards.value.push(newBoard)

      if (useTemplate) {
        const templateColumns = ['Backlog','Todo','In Progress','Review','Done']
        for (const colName of templateColumns) {
          const col = await boardService.createColumn(board.id, colName)
          newBoard.columns.push({ ...col, cards: [] })
        }
      }

      toast.showToast({ message: 'Board aangemaakt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon board niet aanmaken', type: 'error' })
    }
  }

  async function updateBoard(id, name) {
    if (!name) return
    try {
      const board = await boardService.updateBoard(id, { name })
      const index = boards.value.findIndex(b => b.id === id)
      if (index !== -1) boards.value[index].name = name
      toast.showToast({ message: 'Board bijgewerkt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon board niet updaten', type: 'error' })
    }
  }

  async function deleteBoard(id) {
    try {
      await boardService.deleteBoard(id)
      boards.value = boards.value.filter(b => b.id !== id)
      toast.showToast({ message: 'Board verwijderd', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon board niet verwijderen', type: 'error' })
    }
  }

  // -------------------- COLUMNS --------------------
  async function fetchColumns(boardId) {
    try {
      const board = findBoard(boardId)
      if (!board) return
      const data = await boardService.fetchColumns(boardId)
      board.columns = data.map(c => ({ ...c, cards: [] }))
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kolommen niet laden', type: 'error' })
    }
  }

  async function createColumn(boardId, name) {
    if (!name) return
    try {
      const board = findBoard(boardId)
      if (!board) return
      const col = await boardService.createColumn(boardId, name)
      board.columns.push({ ...col, cards: [] })
      toast.showToast({ message: 'Kolom aangemaakt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kolom niet aanmaken', type: 'error' })
    }
  }

  async function updateColumn(boardId, columnId, name) {
    if (!name) return
    try {
      await boardService.updateColumn(columnId, { name })
      const col = findColumn(boardId, columnId)
      if (col) col.name = name
      toast.showToast({ message: 'Kolom bijgewerkt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kolom niet updaten', type: 'error' })
    }
  }

  async function deleteColumn(boardId, columnId) {
    try {
      await boardService.deleteColumn(columnId)
      const board = findBoard(boardId)
      if (board) board.columns = board.columns.filter(c => c.id !== columnId)
      toast.showToast({ message: 'Kolom verwijderd', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kolom niet verwijderen', type: 'error' })
    }
  }

  async function moveColumn(boardId, newColumnsOrder) {
    const board = findBoard(boardId)
    if (!board) return

    board.columns = [...newColumnsOrder]

    const payload = board.columns.map((c, i) => ({ id: c.id, position: i }))
    try { await boardService.updateColumnPositions(payload) }
    catch (err) { console.error('Kon kolomposities niet bijwerken', err) }
  }

  // -------------------- CARDS --------------------
  async function fetchCards(boardId, columnId) {
    try {
      const col = findColumn(boardId, columnId)
      if (!col) return

      const cards = await boardService.fetchCards(columnId)

      for (const card of cards) {
        card.attachments = await boardService.fetchAttachments(card.id)
        card.comments = await boardService.fetchComments(card.id)
        card.labels = await boardService.fetchLabels(card.id)
      }

      col.cards = cards
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kaarten niet laden', type: 'error' })
    }
  }

  async function createCard(boardId, columnId, { title, description }) {
    try {
      const col = findColumn(boardId, columnId)
      if (!col) return

      col.cards.forEach(c => c.position += 1)
      const card = await boardService.createCard(columnId, { title, description, position: 0 })
      col.cards.unshift(card)

      const payload = col.cards.map(c => ({ id: c.id, position: c.position, column_id: c.column_id }))
      if (payload.length) await boardService.updateCardPositions(payload)
      toast.showToast({ message: 'Card aangemaakt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon card niet aanmaken', type: 'error' })
    }
  }

  async function updateCard(boardId, columnId, cardId, updates) {
    try {
      const col = findColumn(boardId, columnId)
      if (!col) return
      const card = await boardService.updateCard(cardId, updates)
      const index = col.cards.findIndex(c => c.id === cardId)
      if (index !== -1) col.cards[index] = card
      toast.showToast({ message: 'Card bijgewerkt', type: 'success' })
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon card niet updaten', type: 'error' })
    }
  }

  async function moveCard(boardId, cardId, fromColumnId, toColumnId, newIndex) {
    const fromCol = findColumn(boardId, fromColumnId)
    const toCol = findColumn(boardId, toColumnId)
    if (!fromCol || !toCol) return

    const cardIndex = fromCol.cards.findIndex(c => c.id === cardId)
    if (cardIndex === -1) return
    const [card] = fromCol.cards.splice(cardIndex, 1)
    card.column_id = toColumnId
    toCol.cards.splice(newIndex, 0, card)

    // Re-index
    const renumber = (cards) => cards.map((c, i) => ({ ...c, position: i }))
    const fromPayload = renumber(fromCol.cards)
    const toPayload = (fromColumnId !== toColumnId) ? renumber(toCol.cards) : fromPayload

    try {
      if (fromColumnId === toColumnId) {
        await boardService.updateCardPositions(fromPayload)
      } else {
        await boardService.updateCardPositions(fromPayload)
        await boardService.updateCardPositions(toPayload)
      }
    } catch (err) {
      console.error('Kon card move niet opslaan', err)
    }
  }

  // -------------------- ATTACHMENTS (via service) --------------------
  async function fetchAttachments(cardId) {
    try {
      const data = await boardService.fetchAttachments(cardId)
      attachmentsByCard.value[cardId] = data
      return data
    } catch (err) {
      console.error(err)
      attachmentsByCard.value[cardId] = []
      return []
    }
  }

  async function uploadAttachment(cardId, file) {
    try {
      const attachment = await boardService.uploadAttachment(cardId, file)

      if (!attachmentsByCard.value[cardId]) {
        attachmentsByCard.value[cardId] = []
      }

      attachmentsByCard.value[cardId].push(attachment)

      return attachment
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async function deleteAttachment(id, cardId) {
    try {
      await boardService.deleteAttachment(id)

      if (attachmentsByCard.value[cardId]) {
        attachmentsByCard.value[cardId] =
          attachmentsByCard.value[cardId].filter(a => a.id !== id)
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async function addComment(cardId, text) {
    try {
      const newComment = await boardService.addComment(cardId, text)

      const card = findCardById(cardId)

      if (card) {
        if (!card.comments) card.comments = []

        card.comments.push(newComment) // 👈 gebruik DB response
      }

    } catch (err) {
      console.error(err)
    }
  }

  function findCardById(cardId) {
    for (const board of boards.value) {
      for (const col of board.columns) {
        const card = col.cards.find(c => c.id === cardId)
        if (card) return card
      }
    }
    return null
  }

  function findBoardByCardId(cardId) {
    for (const board of boards.value) {
      for (const col of board.columns) {
        if (col.cards.some(c => c.id === cardId)) {
          return board
        }
      }
    }
    return null
  }

  async function createLabel(boardId, name, color) {
    const label = await boardService.createLabel(boardId, name, color)
    return label
  }

  async function addLabelToCard(cardId, labelId) {
    try {
      const card = findCardById(cardId)
      if (!card) return

      await boardService.addLabelToCard(cardId, labelId)

      if (!card.labels) card.labels = []

      // prevent duplicates
      const exists = card.labels.some(l => l.id === labelId)
      if (exists) return

      const label = allLabels.value.find(l => l.id === labelId)

      if (label) {
        card.labels.push(label)
      }

    } catch (err) {
      console.error(err)
    }
  }

  async function removeLabelFromCard(cardId, labelId) {
    try {
      const card = findCardById(cardId)
      if (!card) return

      await boardService.removeLabelFromCard(cardId, labelId)

      card.labels = card.labels.filter(l => l.id !== labelId)

    } catch (err) {
      console.error(err)
    }
  }

  async function fetchAllLabels(boardId) {
    const data = await boardService.fetchAllLabels(boardId)
    allLabels.value = data
  }

  return {
    boards,
    sortedBoards,
    getBoardById,
    getColumnsByBoard,
    getCardsByColumn,

    activeCard,
    openCardDetail,
    closeCardDetail,

    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,

    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    moveColumn,

    fetchCards,
    createCard,
    updateCard,
    moveCard,

    fetchAttachments,
    uploadAttachment,
    deleteAttachment,
    addComment,

    createLabel,
    addLabelToCard,
    removeLabelFromCard,
    fetchAllLabels,

    allLabels
  }
})