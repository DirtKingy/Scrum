import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'
import { useToastStore } from './useToastStore' // importeer de toast store

export const useColumnsStore = defineStore('columns', {
  state: () => ({
    columns: [],
    errorMessage: '',
  }),
  actions: {
    async fetchColumns(boardId) {
      const toast = useToastStore()
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true })

      if (error) {
        toast.showToast({ message: error.message, type: 'error' })
      } else {
        this.columns = data
      }
    },
    async createColumn(boardId, name) {
      const toast = useToastStore()
      const position = this.columns.length
      const { data, error } = await supabase
        .from('columns')
        .insert({ board_id: boardId, name, position })
        .select()
      if (error) toast.showToast({ message: error.message, type: 'error' })
      else this.columns.push(data[0])
        toast.showToast({ message: 'Column succesvol aangemaakt', type: 'success' })

    },
    async updateColumn(id, name) {
      const toast = useToastStore()
      const { data, error } = await supabase
        .from('columns')
        .update({ name })
        .eq('id', id)
        .select()
      if (error) toast.showToast({ message: error.message, type: 'error' })
      else {
        const idx = this.columns.findIndex(c => c.id === id)
        if (idx !== -1) this.columns[idx] = data[0]
        toast.showToast({ message: 'Column succesvol bewerkt', type: 'success' })
      }
    },
    async deleteColumn(id) {
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', id)
      if (error) toast.showToast({ message: error.message, type: 'error' })
      else this.columns = this.columns.filter(c => c.id !== id)
      toast.showToast({ message: 'Column succesvol verwijderd', type: 'success' })
    }
  }
})
