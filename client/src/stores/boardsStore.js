import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'
import { useToastStore } from './useToastStore'

export const useBoardsStore = defineStore('boards', {
  state: () => ({
    boards: [],
    columnsByBoard: {},
    cardsByColumn: {},
  }),

  actions: {
    /* ===================== BOARDS ===================== */
    async fetchBoards() {
      const toast = useToastStore()
      try {
        const { data, error } = await supabase
          .from('boards')
          .select('*')
          .order('updated_at', { ascending: false })

        if (error) throw error
        this.boards = data
      } catch {
        toast.showToast({ message: 'Kon boards niet laden', type: 'error' })
      }
    },

    async createBoard(name) {
      const toast = useToastStore()
      const { data, error } = await supabase
        .from('boards')
        .insert([{ name }])
        .select()

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      this.boards.push(data[0])
      toast.showToast({ message: 'Board aangemaakt', type: 'success' })
    },

    /* ===================== COLUMNS ===================== */
    async fetchColumns(boardId) {
      const toast = useToastStore()
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position')

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      this.columnsByBoard[boardId] = data
    },

    async createColumn(boardId, name) {
      const toast = useToastStore()
      const position = this.columnsByBoard[boardId]?.length || 0

      const { data, error } = await supabase
        .from('columns')
        .insert({ board_id: boardId, name, position })
        .select()

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      if (!this.columnsByBoard[boardId]) {
        this.columnsByBoard[boardId] = []
      }

      this.columnsByBoard[boardId].push(data[0])
      toast.showToast({ message: 'Column aangemaakt', type: 'success' })
    },

    async deleteColumn(boardId, columnId) {
      const toast = useToastStore()
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', columnId)

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      this.columnsByBoard[boardId] =
        this.columnsByBoard[boardId].filter(c => c.id !== columnId)

      delete this.cardsByColumn[columnId]
      toast.showToast({ message: 'Column verwijderd', type: 'success' })
    },

    /* ===================== CARDS ===================== */
    async fetchCards(columnId) {
      const toast = useToastStore()
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('column_id', columnId)
        .order('position')

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      this.cardsByColumn[columnId] = data
    },

    async createCard(columnId, title, description = '') {
      const toast = useToastStore()
      if (title.length > 120) {
        toast.showToast({ message: 'Titel te lang', type: 'error' })
        return
      }

      const maxPos =
        this.cardsByColumn[columnId]?.reduce(
          (max, c) => Math.max(max, c.position),
          -1
        ) ?? -1

      const { data, error } = await supabase
        .from('cards')
        .insert({
          column_id: columnId,
          title,
          description,
          position: maxPos + 1,
        })
        .select()

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      if (!this.cardsByColumn[columnId]) {
        this.cardsByColumn[columnId] = []
      }

      this.cardsByColumn[columnId].push(data[0])
      toast.showToast({ message: 'Card aangemaakt', type: 'success' })
    },

    async updateCard(cardId, updates) {
      const toast = useToastStore()

      const { data, error } = await supabase
        .from('cards')
        .update(updates)
        .eq('id', cardId)
        .select()

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
        return
      }

      const updated = data[0]
      const colCards = this.cardsByColumn[updated.column_id]
      const idx = colCards?.findIndex(c => c.id === cardId)

      if (idx !== -1) colCards[idx] = updated
      toast.showToast({ message: 'Card bijgewerkt', type: 'success' })
    },
  },
})
