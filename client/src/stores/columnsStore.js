import { defineStore } from 'pinia'
import { supabase } from '../services/supabaseClient'

export const useColumnsStore = defineStore('columns', {
  state: () => ({
    columns: [],
    errorMessage: ''
  }),
  actions: {
    async fetchColumns(boardId) {
      try {
        const { data, error } = await supabase.from('columns').select('*').eq('board_id', boardId)
        if (error) throw error
        this.columns = data
      } catch (err) {
        console.error(err)
        this.errorMessage = 'Kon columns niet laden'
      }
    }
  }
})
