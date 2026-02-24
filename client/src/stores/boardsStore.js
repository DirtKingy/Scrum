import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as boardService from '@/services/boardService'
import { useToastStore } from '@/stores/useToastStore'

export const useBoardsStore = defineStore('boards', () => {
  const boards = ref([])
  const toast = useToastStore()

  // -------------------- HELPERS --------------------
  function findBoard(boardId) {
    return boards.value.find(b => b.id === boardId)
  }
  function findColumn(boardId, columnId) {
    const board = findBoard(boardId)
    return board?.columns.find(c => c.id === columnId)
  }

  // -------------------- GETTERS --------------------
  const getBoardById = (boardId) => computed(() => findBoard(boardId))
  const getColumnsByBoard = (boardId) => computed(() => findBoard(boardId)?.columns || [])
  const getCardsByColumn = (columnId) =>
    computed(() => {
      for (const board of boards.value) {
        const col = board.columns.find(c => c.id === columnId)
        if (col) return col.cards
      }
      return []
    })
  const sortedBoards = computed(() => {
    return [...boards.value].sort(
      (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
    )
  })

  // -------------------- CARD OVERLAY --------------------
  const activeCard = ref(null) // <-- hier wordt de overlay op gebaseerd

  function openCardDetail(card) {
    activeCard.value = card
  }

  function closeCardDetail() {
    activeCard.value = null
  }

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

  async function createBoard(name) {
    if (!name) return
    try {
      const board = await boardService.createBoard(name)
      boards.value.push({ ...board, columns: [] })
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

  // -------------------- CARDS --------------------
  async function fetchCards(boardId, columnId) {
    try {
      const col = findColumn(boardId, columnId)
      if (!col) return
      col.cards = await boardService.fetchCards(columnId)
    } catch (err) {
      console.error(err)
      toast.showToast({ message: 'Kon kaarten niet laden', type: 'error' })
    }
  }

  async function createCard(boardId, columnId, { title, description }) {
    try {
      const col = findColumn(boardId, columnId)
      if (!col) return

      col.cards.forEach(c => {
        c.position += 1
      })

      const card = await boardService.createCard(columnId, {
        title,
        description,
        position: 0
      })

      col.cards.unshift(card)

      const payload = col.cards
        .filter(c => c.id)
        .map(c => ({
          id: c.id,
          position: c.position,
          column_id: c.column_id
        }))

      if (payload.length) {
        await boardService.updateCardPositions(payload)
      }

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
    toCol.cards.splice(newIndex, 0, card)
    card.column_id = toColumnId

    const renumber = (cards) => {
      cards.forEach((c, i) => {
        if (!c.id) throw new Error('Card missing ID during move')
        c.position = i
      })
    }
    renumber(fromCol.cards)
    renumber(toCol.cards)

    const payload = [...fromCol.cards, ...toCol.cards]
      .filter(c => c.id)
      .map(c => ({
        id: c.id,
        position: c.position,
        column_id: c.column_id
      }))

    try {
      if (payload.length) await boardService.updateCardPositions(payload)
    } catch (err) {
      console.error('Kon posities niet bijwerken', err)
    }
  }

  return {
    boards,
    sortedBoards,
    getBoardById,
    getColumnsByBoard,
    getCardsByColumn,
    activeCard,             // <-- reactive ref voor overlay
    openCardDetail,         // <-- open overlay
    closeCardDetail,        // <-- close overlay
    fetchBoards,
    createBoard,
    updateBoard,
    deleteBoard,
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
    fetchCards,
    createCard,
    updateCard,
    moveCard
  }
})