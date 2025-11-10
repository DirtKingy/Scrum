import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useColumnsStore = defineStore('columns', {
  state: () => ({
    columns: [],
    errorMessage: '',
  }),
  actions: {
    async fetchColumns(boardId) {
      const { data, error } = await supabase
        .from('columns')
        .select('*')
        .eq('board_id', boardId)
        .order('position', { ascending: true })

      if (error) {
        this.errorMessage = error.message
      } else {
        this.columns = data
      }
    },
    async createColumn(boardId, name) {
      const position = this.columns.length
      const { data, error } = await supabase
        .from('columns')
        .insert({ board_id: boardId, name, position })
        .select()
      if (error) this.errorMessage = error.message
      else this.columns.push(data[0])
    },
    async updateColumn(id, name) {
      const { data, error } = await supabase
        .from('columns')
        .update({ name })
        .eq('id', id)
        .select()
      if (error) this.errorMessage = error.message
      else {
        const idx = this.columns.findIndex(c => c.id === id)
        if (idx !== -1) this.columns[idx] = data[0]
      }
    },
    async deleteColumn(id) {
      const { error } = await supabase
        .from('columns')
        .delete()
        .eq('id', id)
      if (error) this.errorMessage = error.message
      else this.columns = this.columns.filter(c => c.id !== id)
    }
  }
})
