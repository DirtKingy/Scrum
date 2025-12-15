import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'
import { useToastStore } from './useToastStore' // importeer de toast store

export const useCardsStore = defineStore('cards', {
  state: () => ({
    cardsByColumn: {} // { columnId: [cards] }
  }),
  actions: {
    async fetchCards(columnId) {
      const { data } = await supabase.from('cards').select('*').eq('column_id', columnId)
      this.cardsByColumn[columnId] = data || []
    },
    async createCard(columnId, title, description) {
      const { data } = await supabase.from('cards').insert({ column_id: columnId, title, description }).select()
      if (!this.cardsByColumn[columnId]) this.cardsByColumn[columnId] = []
      this.cardsByColumn[columnId].push(data[0])
    },
    async updateCard(cardId, updates) {
      const { data } = await supabase.from('cards').update(updates).eq('id', cardId).select()
      const updated = data[0]
      const colId = updated.column_id
      const idx = this.cardsByColumn[colId].findIndex(c => c.id === cardId)
      if (idx !== -1) this.cardsByColumn[colId][idx] = updated
      return updated
    },
    async moveCard(cardId, fromColumnId, toColumnId, oldIndex, newIndex) {
      // update in supabase
      await supabase.from('cards').update({ column_id: toColumnId }).eq('id', cardId)
      // update local state
      const [moved] = this.cardsByColumn[fromColumnId].splice(oldIndex, 1)
      if (!this.cardsByColumn[toColumnId]) this.cardsByColumn[toColumnId] = []
      this.cardsByColumn[toColumnId].splice(newIndex, 0, moved)
    }
  }
})
